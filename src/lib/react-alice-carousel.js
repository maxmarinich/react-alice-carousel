import React from 'react'
import VanillaSwipe from 'vanilla-swipe'

import * as Utils from './utils'
import * as Views from './views'
import { defaultProps, propTypes } from './prop-types'

export default class AliceCarousel extends React.PureComponent {
  constructor(props) {
    super(props)

    const slides = Utils.getSlides(props)
    const clones = Utils.cloneCarouselItems(slides)

    this.state = {
      clones,
      currentIndex: 1,
      duration: props.duration,
      initialStageHeight: 0,
      isAutoPlaying: false,
      isAutoplayCanceledOnAction: false,
      slides,
      stagePadding: {},
      style: Utils.getDefaultStyles(),
      isRTL: !!props.isRTL,
    }

    this.hasUserAction = false
    this.slideTo = this.slideTo.bind(this)
    this.slidePrev = this.slidePrev.bind(this)
    this.slideNext = this.slideNext.bind(this)
    this._onTouchMove = this._onTouchMove.bind(this)
    this._handleOnDotClick = this._handleOnDotClick.bind(this)
    this._throttledOnTouchMove = Utils.throttle(this._onTouchMove, 10)
    this._debouncedHandleOnWindowResize = Utils.debounce(this._handleOnWindowResize, 100)
  }

  componentDidMount() {
    this._setInitialState()
    this._setupSwipeHandlers()
    this._resetAllIntermediateProps()

    window.addEventListener('resize', this._debouncedHandleOnWindowResize)

    if (!this.props.keysControlDisabled) {
      window.addEventListener('keyup', this._handleOnKeyUp)
    }

    this.props.autoPlay && this._play()
  }

  componentDidUpdate(prevProps) {
    if (this.props.autoHeight && this.stageComponent && !this.state.initialStageHeight) {
      const initialStageHeight = Utils.getGalleryItemHeight(this.stageComponent, this.props, this.state)
      this.setState({ initialStageHeight })
    }

    if (this.props.duration !== prevProps.duration) {
      this.setState({ duration: this.props.duration })
    }

    if (this.props.fadeOutAnimation !== prevProps.fadeOutAnimation) {
      this.setState({ fadeoutAnimationProcessing: false }, this._resetAnimationProps)
    }

    if (this.props.slideToIndex !== prevProps.slideToIndex) {
      this._onSlideToIndexChange(this.state.currentIndex, this.props.slideToIndex)
    }

    if (this.props.autoPlay !== prevProps.autoPlay) {
      this.props.autoPlay ? this._play() : this._pause()
      this.setState({ isAutoPlaying: this.props.autoPlay })
    }

    if (
      this.props.stagePadding !== prevProps.stagePadding ||
      this.props.responsive !== prevProps.responsive ||
      this.props.infinite !== prevProps.infinite ||
      this.props.items !== prevProps.items ||
      this.props.isRTL !== prevProps.isRTL
    ) {
      this._resetAllIntermediateProps()
      this.setState(Utils.calculateInitialProps(this.props, this.stageComponent))
    }

    if (this.props.keysControlDisabled !== prevProps.keysControlDisabled) {
      this.props.keysControlDisabled
        ? window.removeEventListener('keyup', this._handleOnKeyUp)
        : window.addEventListener('keyup', this._handleOnKeyUp)
    }

    if (
      !this.swipingStarted &&
      (this.props.mouseTrackingEnabled !== prevProps.mouseTrackingEnabled ||
        this.props.touchTrackingEnabled !== prevProps.touchTrackingEnabled ||
        this.props.preventEventOnTouchMove !== prevProps.preventEventOnTouchMove ||
        this.props.swipeDelta !== prevProps.swipeDelta)
    ) {
      this.swiper.update({
        delta: this.props.swipeDelta,
        mouseTrackingEnabled: this.props.mouseTrackingEnabled,
        touchTrackingEnabled: this.props.touchTrackingEnabled,
        preventDefaultTouchmoveEvent: this.props.preventEventOnTouchMove,
      })
    }
  }

  componentWillUnmount() {
    this._pause()
    this._resetAllIntermediateProps()
    this.swiper.destroy()
    window.removeEventListener('keyup', this._handleOnKeyUp)
    window.removeEventListener('resize', this._debouncedHandleOnWindowResize)
  }

  slideTo(index = 0) {
    if (this._isClickDisabled(index)) return

    this._pause()
    this._disableAnimation()
    this._isFadeOutAnimationAllowed() && this.setAnimationPropsOnDotClick(index)
    this._slideToItem(index)
  }

  slidePrev(e) {
    if (e && e.isTrusted) {
      this.hasUserAction = true
    }

    if (this._isClickDisabled()) return

    this._pause()
    this._disableAnimation()
    this._isFadeOutAnimationAllowed() && this._setAnimationPropsOnClick('prev')

    if (Utils.itemInfo(this.state).isPrevSlideDisabled) {
      return this._onInactiveItem()
    }
    this._slideToItem(this.state.currentIndex - 1)
  }

  slideNext(e) {
    if (e && e.isTrusted) {
      this.hasUserAction = true
    }

    if (this._isClickDisabled()) return

    this._pause()
    this._disableAnimation()
    this._isFadeOutAnimationAllowed() && this._setAnimationPropsOnClick('next')

    if (Utils.itemInfo(this.state).isNextSlideDisabled) {
      return this._onInactiveItem()
    }
    this._slideToItem(this.state.currentIndex + 1)
  }

  _handleOnDotClick(index) {
    this.hasUserAction = true
    this.slideTo(index)
  }

  _setupSwipeHandlers() {
    this.swiper = new VanillaSwipe({
      element: this.rootComponent,
      delta: this.props.swipeDelta,
      onSwiping: this._throttledOnTouchMove,
      onSwiped: this._onTouchEnd,
      rotationAngle: 5,
      mouseTrackingEnabled: this.props.mouseTrackingEnabled,
      touchTrackingEnabled: this.props.touchTrackingEnabled,
      preventDefaultTouchmoveEvent: this.props.preventEventOnTouchMove,
      preventTrackingOnMouseleave: true,
    })

    this.swiper.init()
  }

  _handleOnWindowResize = (e) => {
    const { shouldHandleResizeEvent } = this.props
    const currentDimensions = Utils.getElementDimensions(this.rootComponent)
    const shouldProcessEvent = shouldHandleResizeEvent || Utils.shouldHandleResizeEvent

    if (shouldProcessEvent(e, this.rootComponentDimensions, currentDimensions)) {
      this.rootComponentDimensions = currentDimensions
      this._disableAnimation()
      this._pause()

      const { currentIndex, isAutoPlaying } = this.state
      const isAnimationCanceled = this._isSwipeAnimationProcessing()
      const initialProps = Utils.preserveProps(this.props, { startIndex: currentIndex })
      const currState = Utils.calculateInitialProps(initialProps, this.stageComponent)
      const translate3d = Utils.getTranslate3dPosition(currState.currentIndex, currState)
      const nextState = { ...currState, translate3d, isAnimationCanceled, isAutoPlaying, initialStageHeight: 0 }

      if (isAnimationCanceled) Utils.animate(this.stageComponent, { position: translate3d })

      this.setState(nextState, () => {
        this._resetAllIntermediateProps()
        isAutoPlaying && this._play()
        this._onResized()
      })
    }
  }

  _handleOnAnimationCanceled = () => {
    this._resetAllIntermediateProps()
    this.setState({ isAnimationCanceled: false })
  }

  _handleOnKeyUp = (e) => {
    const { isRTL } = this.state
    switch (e.code) {
      case 'Space':
        return this.props.autoPlay && this._playPauseToggle()
      case 'ArrowLeft':
        return isRTL? this.slideNext() : this.slidePrev()
      case 'ArrowRight':
        return isRTL? this.slidePrev() : this.slideNext()
    }
  }

  _handleOnMouseEnter = () => {
    if (this.props.stopAutoPlayOnHover && this.state.isAutoPlaying) {
      this.isHovered = true
      this._pause()
    }
  }

  _handleOnMouseLeave = () => {
    if (this.state.isAutoPlaying) {
      this.isHovered = false
      this._play()
    }
  }

  _onSlideToIndexChange = (currentIndex, slideToIndex) => {
    if (slideToIndex === currentIndex + 1) {
      this.slideNext()
    } else if (slideToIndex === currentIndex - 1) {
      this.slidePrev()
    } else {
      this.slideTo(slideToIndex)
    }
  }

  _onInactiveItem = () => {
    this._onSlideChange()
    this._onSlideChanged()
  }

  _onSlideChange() {
    if (this.props.onSlideChange) {
      this.props.onSlideChange(this._getEventObject())
    }
  }

  _onSlideChanged() {
    const { isAutoPlaying, isAutoplayCanceledOnAction } = this.state
    const { disableAutoPlayOnAction, onSlideChanged } = this.props

    if (disableAutoPlayOnAction && this.hasUserAction && !isAutoplayCanceledOnAction) {
      this.setState({ isAutoplayCanceledOnAction: true, isAutoPlaying: false }, () => {
        this._allowAnimation()

        if (onSlideChanged) {
          onSlideChanged(this._getEventObject())
        }
      })
    } else {
      isAutoPlaying && this._play()
      this._allowAnimation()

      if (onSlideChanged) {
        onSlideChanged(this._getEventObject())
      }
    }
  }

  _onInitialized(initialState) {
    this.rootComponentDimensions = Utils.getElementDimensions(this.rootComponent)

    if (this.props.onInitialized) {
      this.props.onInitialized(this._getEventObject(initialState))
    }
  }

  _onResized() {
    if (this.props.onResized) {
      this.props.onResized(this._getEventObject())
    }
  }

  _setInitialState() {
    const initialState = Utils.calculateInitialProps(this.props, this.stageComponent)
    this.setState(initialState, this._onInitialized(initialState))
  }

  _getFadeOutAnimationState = (shouldRecalculate) => {
    if (shouldRecalculate || this._isFadeOutAnimationAllowed()) {
      return { fadeoutAnimationProcessing: false }
    }
    return {}
  }

  _setRootComponentRef = (node) => {
    return (this.rootComponent = node)
  }

  _setStageComponentRef = (node) => {
    return (this.stageComponent = node)
  }

  _allowAnimation = () => {
    return (this.allowAnimation = true)
  }

  _disableAnimation = () => {
    return (this.allowAnimation = false)
  }

  _checkSlidePosition(shouldSkipRecalculation) {
    this._stopSwipeAnimation()
    this._resetAnimationProps()
    this._resetSwipePositionProps()

    shouldSkipRecalculation ? this._skipSlidePositionRecalculation() : this._updateSlidePosition()
  }

  _skipSlidePositionRecalculation = () => {
    if (this._isFadeOutAnimationAllowed()) {
      return this._resetFadeOutAnimationState()
    }

    this._onSlideChanged()
  }

  _updateSlidePosition = () => {
    this._updateSlidePositionIntervalId = setTimeout(() => {
      if (this._shouldRecalculatePosition()) {
        this._recalculateSlidePosition()
      } else if (this._isFadeOutAnimationAllowed()) {
        this._resetFadeOutAnimationState()
      } else {
        this._onSlideChanged()
      }
    }, this.state.duration)
  }

  _resetFadeOutAnimationState = () => {
    this.setState({ fadeoutAnimationProcessing: false }, this._onSlideChanged)
  }

  _resetAllIntermediateProps = () => {
    this.prevSwipPosition = 0
    this.swipingStarted = false

    this._stopSwipeAnimation()
    this._resetAnimationProps()
    this._resetSwipePositionProps()
    this._clearUpdateSlidePositionIntervalId()
    this._allowAnimation()
  }

  _recalculateSlidePosition = () => {
    const style = Utils.getDefaultStyles()
    const currentIndex = Utils.recalculateCurrentSlideIndex(this.state)
    const translate3d = Utils.recalculateTranslatePosition(this.state)

    this.setState(
      {
        currentIndex,
        translate3d,
        style,
        ...this._getFadeOutAnimationState(),
      },
      () => this._onSlideChanged(),
    )
  }

  _getEventObject = (state = this.state) => {
    const { items: itemsInSlide, currentIndex: item } = state
    const { isNextSlideDisabled, isPrevSlideDisabled } = Utils.itemInfo(state)
    const slide = Utils.getActiveSlideIndex(isNextSlideDisabled, state)

    return { item, slide, itemsInSlide, isNextSlideDisabled, isPrevSlideDisabled }
  }

  setAnimationPropsOnDotClick = (itemIndex) => {
    const { currentIndex, itemWidth } = this.state
    const fadeOutIndex = currentIndex + 1
    const fadeOutOffset = Utils.getFadeOutOffsetOnDotClick(itemIndex, currentIndex, itemWidth)

    this._setAnimationProps({ fadeOutIndex, fadeOutOffset, allowFadeOutAnimation: true })
  }

  _setAutoPlayInterval() {
    const { autoPlayDirection, autoPlayInterval } = this.props

    this._autoPlayIntervalId = setTimeout(() => {
      if (!this.isHovered) {
        autoPlayDirection === 'rtl' ? this.slidePrev() : this.slideNext()
      }
    }, autoPlayInterval)
  }

  _clearAutoPlayInterval() {
    clearTimeout(this._autoPlayIntervalId)
    this._autoPlayIntervalId = undefined
  }

  _clearUpdateSlidePositionIntervalId() {
    clearTimeout(this._updateSlidePositionIntervalId)
    this._updateSlidePositionIntervalId = undefined
  }

  _play() {
    this._setAutoPlayInterval()
  }

  _pause = () => {
    this._clearAutoPlayInterval()
  }

  _playPauseToggle = () => {
    const { isAutoPlaying } = this.state

    this.hasUserAction = true
    this.setState({ isAutoPlaying: !isAutoPlaying, isAutoplayCanceledOnAction: true }, () => {
      isAutoPlaying ? this._pause() : this._play()
    })
  }

  _getIntermediateStateProps = (duration, shouldSkipRecalculation) => {
    const { transitionTimingFunction } = this.props
    const condition = !shouldSkipRecalculation && this._isFadeOutAnimationAllowed()
    return Utils.getIntermediateTransitionProps(condition, duration, transitionTimingFunction)
  }

  _slideToItem(index, options = {}) {
    this._onSlideChange()
    const { duration = this.state.duration, shouldSkipRecalculation = false } = options
    const translate3d = Utils.getTranslate3dPosition(index, this.state)

    this.setState(
      {
        currentIndex: index,
        translate3d,
        ...this._getIntermediateStateProps(duration, shouldSkipRecalculation),
      },
      () => this._checkSlidePosition(shouldSkipRecalculation),
    )
  }

  _startSwipeAnimation = () => {
    this.swipeAnimation = true
  }

  _stopSwipeAnimation = () => {
    this.swipeAnimation = false
    this.touchEndAnimation = false
    this.touchEndTimeoutId = null
  }

  _setAnimationProps = (newProps) => {
    let prevProps = this.animationProps || {}
    this.animationProps = { ...prevProps, ...newProps }
  }

  _resetAnimationProps = () => {
    this.animationProps = {}
  }

  _setSwipePositionProps = (newProps) => {
    const prevProps = this.swipePosition || {}
    this.swipePosition = { ...prevProps, ...newProps }
  }

  _resetSwipePositionProps = () => {
    this.swipePosition = {}
  }

  _getTranslateXPosition = (deltaX) => {
    const { translate3d } = this.state
    const { lastSwipePosition } = this.swipePosition
    let position = lastSwipePosition || translate3d

    if (this.touchEndAnimation) {
      this.touchEndAnimation = false
      const translateX = Utils.getTranslateX(this.stageComponent)

      if (translateX) {
        return translateX
      }
    }
    return position - Math.floor(deltaX)
  }

  _onTouchMove(e, deltaX, deltaY, absX, absY) {
    this.hasUserAction = true

    if (this._isSwipeDisabled()) {
      return
    }

    if (!this.swipingStarted && Utils.isVerticalTouchMoveDetected(e, absX, absY)) {
      return
    }

    this.swipingStarted = true

    this._pause()
    this._disableAnimation()
    this._startSwipeAnimation()
    this._clearUpdateSlidePositionIntervalId()
    this.touchEndTimeoutId && clearTimeout(this.touchEndTimeoutId)

    const { slides, items, itemWidth, infinite, stagePadding, isRTL } = this.state
    const slidesLength = slides.length
    const direction = Utils.getSwipeDirection(this.prevSwipPosition, deltaX)
    this.prevSwipPosition = deltaX

    let position = this._getTranslateXPosition(deltaX)

    if (infinite === false) {
      const minSwipeLimit = Utils.getMinSwipeLimitIfNotInfinite(items, itemWidth)
      const maxSwipeLimit = Utils.getMaxSwipeLimitIfNotInfinite(slidesLength, itemWidth)

      if (Utils.shouldRecalculateSwipePosition(position, minSwipeLimit, maxSwipeLimit, isRTL)) {
        return
      }

      Utils.animate(this.stageComponent, { position })
      this._setSwipePositionProps({ position, direction })
      return
    }

    const minPosition = Utils.getMinSwipePosition(items, itemWidth)
    const minSwipeLimit = Utils.getMinSwipeLimit(minPosition, stagePadding)
    const maxPosition = Utils.getMaxSwipePosition(items, itemWidth, slidesLength)
    const maxSwipeLimit = Utils.getMaxSwipeLimit(maxPosition, stagePadding, itemWidth)

    if (Utils.shouldRecalculateSwipePosition(position, minSwipeLimit, maxSwipeLimit, isRTL)) {
      try {
        recalculatePosition()
      } catch (err) {
        Utils.debug(err)
      }
    }

    Utils.animate(this.stageComponent, { position })
    this._setSwipePositionProps({ position, direction })

    function recalculatePosition() {
      const direction = Utils.getSwipeDirection(0, deltaX)

      direction === 'RIGHT'
        ? (position = position + slidesLength * -itemWidth)
        : (position = position + maxPosition - items * itemWidth)

      if (Utils.shouldRecalculateSwipePosition(position, minSwipeLimit, maxSwipeLimit, isRTL)) {
        recalculatePosition()
      }
    }
  }

  _onTouchEnd = () => {
    if (!this.swipingStarted || this._isSwipeDisabled()) return
    this.swipingStarted = false
    this.prevSwipPosition = 0

    this._setSwipePositionProps({ lastSwipePosition: this.swipePosition.position })
    this._beforeTouchEnd()
  }

  _beforeTouchEnd() {
    const { direction, position } = this.swipePosition
    const { transitionTimingFunction } = this.props
    const { itemWidth, items, duration, infinite, isRTL } = this.state
    const swipeIndex = Utils.calculateSwipeIndex(itemWidth, position, direction, isRTL)
    const currentIndex = Utils.getSwipeIndexOnBeforeTouchEnd(swipeIndex, items)
    const translateXPosition = Utils.getSwipePositionOnBeforeTouchEnd(swipeIndex, itemWidth, isRTL)

    if (infinite === false) {
      this._isInfiniteModeDisabledBeforeTouchEnd(swipeIndex, currentIndex)
      return
    }

    Utils.animate(this.stageComponent, { position: translateXPosition, duration, transitionTimingFunction })

    this.touchEndAnimation = true
    this.touchEndTimeoutId = setTimeout(() => {
      if (this._isSwipeAnimationLastFrame()) {
        if (this.state.isAnimationCanceled) {
          return this._handleOnAnimationCanceled()
        }

        const nextItemIndex = Utils.getNextItemIndexBeforeTouchEnd(translateXPosition, this.state)
        const nextTranslateXPosition = Utils.getTranslate3dPosition(nextItemIndex, this.state)

        Utils.animate(this.stageComponent, { position: nextTranslateXPosition })
        this._slideToItem(nextItemIndex, { duration: 0, shouldSkipRecalculation: true })
      }
    }, duration)
  }

  _isInfiniteModeDisabledBeforeTouchEnd(swipeIndex, currentIndex) {
    const { transitionTimingFunction } = this.props
    const { items, itemWidth, duration, slides, isRTL } = this.state
    let position = Utils.getTranslate3dPosition(currentIndex, { itemWidth, items, isRTL })

    if (swipeIndex < items) {
      currentIndex = Utils.recalculateCurrentIndexOnBeforeTouchEnd()
      position = Utils.recalculatePositionOnBeforeTouchEnd(items, itemWidth)
    }

    if (swipeIndex > slides.length) {
      currentIndex = Utils.recalculateCurrentIndexOnBeforeTouchEnd(slides.length, items)
      position = Utils.recalculatePositionOnBeforeTouchEnd(slides.length, itemWidth)
    }

    Utils.animate(this.stageComponent, { position, duration, transitionTimingFunction })

    this.touchEndAnimation = true
    this.touchEndTimeoutId = setTimeout(() => {
      if (this._isSwipeAnimationLastFrame()) {
        if (this.state.isAnimationCanceled) {
          return this._handleOnAnimationCanceled()
        }

        Utils.animate(this.stageComponent, { position })
        this._slideToItem(currentIndex, { duration: 0, shouldSkipRecalculation: true })
      }
    }, duration)
  }

  _isClickDisabled = (itemIndex) => {
    const { currentIndex, isAnimationCanceled } = this.state
    return currentIndex === itemIndex || isAnimationCanceled || !this.allowAnimation || this.swipeAnimation
  }

  _isFadeOutAnimationAllowed = () => {
    const { stagePadding, items } = this.state
    const hasNoStagePadding = !(stagePadding.paddingLeft || stagePadding.paddingRight)

    return this.props.fadeOutAnimation && items === 1 && hasNoStagePadding
  }

  _isSwipeDisabled = () => {
    const { isAnimationCanceled, fadeoutAnimationProcessing } = this.state
    return this.props.swipeDisabled || fadeoutAnimationProcessing || isAnimationCanceled
  }

  _isSwipeAnimationLastFrame = () => {
    return !this.swipingStarted
  }

  _isSwipeAnimationProcessing = () => {
    return this.touchEndTimeoutId
  }

  _shouldRecalculatePosition = () => {
    const { slides, currentIndex } = this.state
    return currentIndex < 0 || currentIndex >= slides.length
  }

  _setAnimationPropsOnClick = (direction) => {
    const { currentIndex, itemWidth } = this.state
    const fadeOutIndex = Utils.getFadeOutIndexOnClick(currentIndex)
    const fadeOutOffset = Utils.getFadeOutOffsetOnClick(direction, itemWidth)

    this._setAnimationProps({ fadeOutIndex, fadeOutOffset, allowFadeOutAnimation: true })
  }

  _renderSlideInfo = () => {
    const { currentIndex, slides } = this.state
    return <Views.SlideInfo slidesLength={slides.length} currentIndex={currentIndex} />
  }

  _renderPrevButton() {
    const { isPrevSlideDisabled } = Utils.itemInfo(this.state)
    return (
      <Views.PrevNextButton
        name="prev"
        disabled={isPrevSlideDisabled}
        onClick={this.slidePrev}
      />
    )
  }

  _renderNextButton() {
    const { isNextSlideDisabled } = Utils.itemInfo(this.state)
    return (
      <Views.PrevNextButton
        name="next"
        disabled={isNextSlideDisabled}
        onClick={this.slideNext}
      />
    )
  }

  _renderStageItem = (item, i) => {
    const style = Utils.itemStyles(i, this.state, this.animationProps)
    const className = Utils.itemClassName(i, this.state, this.animationProps)
    return <Views.StageItem styles={style} className={className} key={`stage-item-${i}`} item={item} />
  }

  _renderPlayPauseButton() {
    const { isAutoPlaying } = this.state
    return <Views.PlayPauseButton isPlaying={isAutoPlaying} onClick={this._playPauseToggle} />
  }

  _renderDotsNavigation() {
    return (
      <Views.DotsNavigation
        state={this.state}
        onClick={this._handleOnDotClick}
      />
    )
  }

  render() {
    const { style, translate3d, clones } = this.state
    const wrapperStyles = Utils.getWrapperStyles(this.stageComponent, this.props, this.state)
    const stageStyles = Utils.getStageStyles({ translate3d }, style)
    const dotsDisabled = Utils.shouldDisableDots(this.props, this.state)
    const containerClassName = Utils.containerClassName(this.state)

    return (
      <div className={containerClassName}>
        <div ref={this._setRootComponentRef}>
          <div
            style={wrapperStyles}
            className="alice-carousel__wrapper"
            onMouseEnter={this._handleOnMouseEnter}
            onMouseLeave={this._handleOnMouseLeave}
          >
            <ul style={stageStyles} className="alice-carousel__stage" ref={this._setStageComponentRef}>
              {clones.map(this._renderStageItem)}
            </ul>
          </div>
        </div>

        {this.props.showSlideInfo ? this._renderSlideInfo() : null}
        {dotsDisabled ? null : this._renderDotsNavigation()}
        {!this.props.buttonsDisabled ? this._renderPrevButton() : null}
        {!this.props.buttonsDisabled ? this._renderNextButton() : null}
        {this.props.playButtonEnabled ? this._renderPlayPauseButton() : null}
      </div>
    )
  }
}

AliceCarousel.propTypes = propTypes
AliceCarousel.defaultProps = defaultProps
