import React from 'react'
import Swipeable from 'react-swipeable'

import * as Utils from './utils'
import * as Views from './views'
import { propTypes, defaultProps } from './prop-types'

export default class AliceCarousel extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      clones: [],
      currentIndex: 1,
      initialStageHeight: 0,
      stagePadding: {},
      duration: props.duration,
      slides: Utils.getSlides(props),
      style: { transition: 'transform 0ms ease-out' },
    }

    this._onTouchMove = this._onTouchMove.bind(this)
    this.handleOnResize = Utils.debounce(this._handleOnWindowResize, 100)
  }

  componentDidMount() {
    this._setInitialState()
    this._resetAllIntermediateProps()

    window.addEventListener('resize', this.handleOnResize)

    if (!this.props.keysControlDisabled) {
      window.addEventListener('keyup', this._handleOnKeyUp)
    }

    this.deviceInfo = Utils.deviceInfo()
    this.props.autoPlay && this._play()
  }

  componentDidUpdate(prevProps) {
    if (this.props.autoHeigth && this.stageComponent && !this.state.initialStageHeight) {
      const initialStageHeight = this._getStageHeight()
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

    if (
      this.props.disableAutoPlayOnAction !== prevProps.disableAutoPlayOnAction ||
      this.props.autoPlayDirection !== prevProps.autoPlayDirection ||
      this.props.autoPlayInterval !== prevProps.autoPlayInterval ||
      this.props.infinite !== prevProps.infinite ||
      this.props.autoPlay !== prevProps.autoPlay
    ) {
      this.props.autoPlay ? this._play() : this._pause()
    }

    if (
      this.props.stagePadding !== prevProps.stagePadding ||
      this.props.responsive !== prevProps.responsive ||
      this.props.infinite !== prevProps.infinite ||
      this.props.items !== prevProps.items
    ) {
      this._resetAllIntermediateProps()
      this.setState(Utils.calculateInitialProps(this.props, this.stageComponent))
    }

    if (this.props.keysControlDisabled !== prevProps.keysControlDisabled) {
      this.props.keysControlDisabled
        ? window.removeEventListener('keyup', this._handleOnKeyUp)
        : window.addEventListener('keyup', this._handleOnKeyUp)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleOnResize)

    if (!this.props.keysControlDisabled) {
      window.removeEventListener('keyup', this._handleOnKeyUp)
    }

    if (this._autoPlayIntervalId) {
      window.clearInterval(this._autoPlayIntervalId)
      this._autoPlayIntervalId = null
    }
  }

  _handleOnWindowResize = () => {
    if (Utils.shouldCallHandlerOnWindowResize(this.deviceInfo)) {
      this.windowResizing = true
      const { currentIndex } = this.state

      this.isHovered = true
      this.deviceInfo = Utils.deviceInfo()
      this._resetAllIntermediateProps()
      this._disableAnimation()

      const currState = Utils.calculateInitialProps(this.props, this.stageComponent)
      const translate3d = Utils.getTranslate3dPosition(currentIndex, currState)
      const nextState = { ...currState, currentIndex, translate3d, isAnimationCanceled: true }

      this.setState(nextState, () => {
        this._allowAnimation()
        this._onResized()
        this.isHovered = false
      })
    }
  }

  _handleOnKeyUp = (e) => {
    switch (e.keyCode) {
      case 32:
        return this._handleOnSpaceBarClick()
      case 37:
        return this._slidePrev()
      case 39:
        return this._slideNext()
    }
  }

  _handleOnSpaceBarClick = () => {
    this.props.autoPlay && this._playPauseToggle()
  }

  _handleOnMouseEnter = () => {
    if (this.props.stopAutoPlayOnHover) {
      this.isHovered = true
    }
  }

  _handleOnMouseLeave = () => {
    this.isHovered = false
  }

  _onSlideToIndexChange = (currentIndex, slideToIndex) => {
    if (slideToIndex === currentIndex + 1) {
      this._slideNext()
    } else if (slideToIndex === currentIndex - 1) {
      this._slidePrev()
    } else {
      this._onDotClick(slideToIndex)
    }
  }

  _onInactiveItem = () => {
    this._onSlideChange()
    this._onSlideChanged()
    this._allowAnimation()
    this._pause()
  }

  _onSlideChange() {
    if (this.props.onSlideChange) {
      this.props.onSlideChange(this._getEventObject())
    }
  }

  _onSlideChanged() {
    if (this.props.onSlideChanged) {
      this.props.onSlideChanged(this._getEventObject())
    }
    this._allowAnimation()
  }

  _onInitialized(initialState) {
    if (this.props.onInitialized) {
      this.props.onInitialized(this._getEventObject(initialState))
    }
  }

  _onResized() {
    if (this.props.onResized) {
      this.props.onResized(this._getEventObject())
    }
  }

  _onDotClick = (itemIndex) => {
    if (this.state.currentIndex === itemIndex || !this.allowAnimation || this.swipeAnimation) {
      return
    }
    this._disableAnimation()
    this._isFadeOutAnimationAllowed() && this.setAnimationPropsOnDotClick(itemIndex)
    this.props.disableAutoPlayOnAction && this._pause()
    this._slideToItem(itemIndex)
  }

  _setInitialState() {
    const initialState = Utils.calculateInitialProps(this.props, this.stageComponent)
    this.setState(initialState, this._onInitialized(initialState))
  }

  _recalculateFadeOutAnimationState = (shouldRecalculate) => {
    if (shouldRecalculate || this._isFadeOutAnimationAllowed()) {
      return { fadeoutAnimationProcessing: false }
    }
    return {}
  }

  _getStageComponentNode = (node) => {
    return (this.stageComponent = node)
  }

  _getStageHeight() {
    const slidesOffset = 2
    const itemIndex = this.state.currentIndex + slidesOffset
    const height = Utils.getGalleryItemHeight(this.stageComponent, itemIndex)

    return height || this.state.initialStageHeight
  }

  _allowAnimation = () => {
    return (this.allowAnimation = true)
  }

  _disableAnimation = () => {
    return (this.allowAnimation = false)
  }

  _isHovered = () => {
    return this.isHovered
  }

  _checkSlidePosition(shouldSkipRecalculation) {
    this._stopSwipeAnimation()
    this._resetAnimationProps()
    this._resetSwipePositionProps()

    shouldSkipRecalculation ? this._skipSlidePositionRecalculation() : this._updateSlidePosition()
  }

  _skipSlidePositionRecalculation = () => {
    if (this._isFadeOutAnimationAllowed()) {
      this._resetFadeOutAnimationState()
      return
    }

    this._onSlideChanged()
    this.props.disableAutoPlayOnAction && this._pause()
    this.isHovered = false
  }

  _updateSlidePosition = () => {
    window.setTimeout(() => {
      if (this._shouldRecalculatePosition()) {
        this._recalculateSlidePosition()
      } else if (this._isFadeOutAnimationAllowed()) {
        this._resetFadeOutAnimationState()
      } else {
        this._onSlideChanged()
      }
    }, this.state.duration)
  }

  _shouldRecalculatePosition = () => {
    const { slides, currentIndex } = this.state
    return currentIndex < 0 || currentIndex >= slides.length
  }

  _resetFadeOutAnimationState = () => {
    this.setState({ fadeoutAnimationProcessing: false }, this._onSlideChanged)
  }

  _resetAllIntermediateProps = () => {
    this.swipingStarted = false
    this.touchEventsCallstack = []
    this.verticalSwipingDetected = false

    this._allowAnimation()
    this._stopSwipeAnimation()
    this._resetAnimationProps()
    this._resetSwipePositionProps()
    this._resetTranslateAnimationProcessingFlag()
  }

  _recalculateSlidePosition = () => {
    const currentIndex = Utils.recalculateCurrentSlideIndex(this.state)
    const translate3d = Utils.recalculateTranslatePosition(this.state)

    this.setState(
      {
        currentIndex,
        translate3d,
        ...this._recalculateFadeOutAnimationState(),
        style: { transition: 'transform 0ms ease-out' },
      },
      () => this._onSlideChanged(),
    )
  }

  _getEventObject = (state = this.state) => {
    const { items: itemsInSlide, currentIndex: item } = state
    const { isNextSlideDisabled } = Utils.itemInfo(state)
    const slide = Utils.getActiveSlideIndex(isNextSlideDisabled, state)

    return { item, slide, itemsInSlide }
  }

  setAnimationPropsOnDotClick = (itemIndex) => {
    const { currentIndex, itemWidth } = this.state
    const fadeOutIndex = currentIndex + 1
    const fadeOutOffset = Utils.getFadeOutOffsetOnDotClick(itemIndex, currentIndex, itemWidth)

    this._setAnimationProps({ fadeOutIndex, fadeOutOffset, allowFadeOutAnimation: true })
  }

  _setAutoPlayInterval() {
    const { duration } = this.state
    const { autoPlayDirection, autoPlayInterval } = this.props
    const playInterval = Math.max(autoPlayInterval, duration)

    this._autoPlayIntervalId = window.setInterval(() => {
      if (!this._isHovered() && this._autoPlayIntervalId && this.state.isPlaying) {
        autoPlayDirection === 'rtl' ? this._slidePrev(false) : this._slideNext(false)
      }
    }, playInterval)
  }

  _clearAutoPlayInterval() {
    window.clearInterval(this._autoPlayIntervalId)
    this._autoPlayIntervalId = null
  }

  _play() {
    this.setState({ isPlaying: true })

    if (!this._autoPlayIntervalId) {
      this._setAutoPlayInterval()
    }
  }

  _pause = () => {
    if (this._autoPlayIntervalId) {
      this._clearAutoPlayInterval()
      this.setState({ isPlaying: false })
    }
  }

  _playPauseToggle = () => {
    if (!this.allowAnimation) return
    this.state.isPlaying ? this._pause() : this._play()
  }

  _intermediateStateProps = (duration, shouldSkipRecalculation) => {
    const condition = !shouldSkipRecalculation && this._isFadeOutAnimationAllowed()
    return Utils.intermediateTransitionProps(condition, duration)
  }

  _slideToItem(index, options = {}) {
    this._onSlideChange()
    const { duration = this.state.duration, shouldSkipRecalculation = false } = options
    const translate3d = Utils.getTranslate3dPosition(index, this.state)

    this.setState(
      {
        currentIndex: index,
        translate3d,
        ...this._intermediateStateProps(duration, shouldSkipRecalculation),
      },
      () => this._checkSlidePosition(shouldSkipRecalculation),
    )
  }

  _isFadeOutAnimationAllowed = () => {
    const { stagePadding, items } = this.state
    const hasNoStagePadding = !(stagePadding.paddingLeft || stagePadding.paddingRight)

    return this.props.fadeOutAnimation && items === 1 && hasNoStagePadding
  }

  _isSwipeDisable = () => {
    return this.props.swipeDisabled || this.state.fadeOutAnimation || this.verticalSwipingDetected
  }

  _addTouchEventToCallstack = () => {
    this.touchEventsCallstack.push(1)
  }

  _removeTouchEventFromCallstack = () => {
    this.touchEventsCallstack.pop()
  }

  _setTranslateAnimationProcessingFlag = () => {
    this.translateAnimationProcessing = true
  }

  _resetTranslateAnimationProcessingFlag = () => {
    this.translateAnimationProcessing = false
  }

  _startSwipeAnimation = () => {
    this.swipeAnimation = true
  }

  _stopSwipeAnimation = () => {
    this.swipeAnimation = false
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

  _calculateSwipeIndex = () => {
    const { itemWidth } = this.state
    const swipePosition = Math.abs(this.swipePosition.position)

    return this.swipePosition.direction === 'LEFT'
      ? Math.floor(swipePosition / itemWidth) + 1
      : Math.floor(swipePosition / itemWidth)
  }

  _getTranslateXPosition = (deltaX) => {
    const { translate3d } = this.state
    const { startPosition = translate3d } = this.swipePosition

    if (!!this.touchEventsCallstack.length && this.translateAnimationProcessing) {
      this._resetTranslateAnimationProcessingFlag()
      const lastTranslateXPosition = Utils.getTranslateX(this.stageComponent)

      if (lastTranslateXPosition) {
        return lastTranslateXPosition - deltaX
      }
    }
    return startPosition - deltaX
  }

  _onTouchMove(e, deltaX, deltaY) {
    this.swipingStarted = true
    this._handleOnMouseEnter()

    if (Utils.isVerticalTouchMoveDetected(e, deltaX, deltaY)) {
      this.verticalSwipingDetected = true
      return
    } else {
      this.verticalSwipingDetected = false
    }

    if (this._isSwipeDisable()) {
      return
    }

    this._disableAnimation()
    this._startSwipeAnimation()

    const { slides, items, itemWidth, infinite, stagePadding } = this.state
    const slidesLength = slides.length
    const direction = Utils.getSwipeDirection(deltaX)
    let position = this._getTranslateXPosition(deltaX)

    if (infinite === false) {
      const minSwipeLimit = Utils.getMinSwipeLimitIfNotInfinite(items, itemWidth)
      const maxSwipeLimit = Utils.getMaxSwipeLimitIfNotInfinite(slidesLength, itemWidth)

      if (Utils.shouldRecalculateSwipePosition(position, minSwipeLimit, maxSwipeLimit)) {
        return
      }

      Utils.animate(this.stageComponent, position)
      this._setSwipePositionProps({ position, direction })
      return
    }

    const maxPosition = Utils.getMaxSwipePosition(items, itemWidth, slidesLength)
    const minPosition = Utils.getMinSwipePosition(items, itemWidth)
    const maxSwipeLimit = Utils.getMaxSwipeLimit(maxPosition, stagePadding)
    const minSwipeLimit = Utils.getMinSwipeLimit(minPosition, stagePadding)

    if (Utils.shouldRecalculateSwipePosition(position, minSwipeLimit, maxSwipeLimit)) {
      try {
        recalculatePosition()
      } catch (err) {
        Utils.debug(err)
      }
    }

    Utils.animate(this.stageComponent, position)
    this._setSwipePositionProps({ position, direction })

    function recalculatePosition() {
      direction === 'RIGHT'
        ? (position = position + slidesLength * -itemWidth)
        : (position = position + maxPosition - items * itemWidth)

      if (Utils.shouldRecalculateSwipePosition(position, minSwipeLimit, maxSwipeLimit)) {
        recalculatePosition()
      }
    }
  }

  _onTouchEnd = () => {
    this.swipingStarted = false

    if (this._isSwipeDisable()) {
      return
    }

    this._addTouchEventToCallstack()
    this._setSwipePositionProps({ startPosition: this.swipePosition.position })
    this._beforeTouchEnd()
  }

  _beforeTouchEnd() {
    const { itemWidth, items, duration, infinite } = this.state
    const swipeIndex = this._calculateSwipeIndex()
    const currentIndex = swipeIndex - items
    const translateXPosition = swipeIndex * -itemWidth

    if (infinite === false) {
      this._isInfiniteModeDisabledBeforeTouchEnd(swipeIndex, currentIndex)
      return
    }

    this._setTranslateAnimationProcessingFlag()
    Utils.animate(this.stageComponent, translateXPosition, duration)

    setTimeout(() => {
      this._removeTouchEventFromCallstack()
      this._resetTranslateAnimationProcessingFlag()

      if (!this.swipingStarted && this.touchEventsCallstack.length === 0) {
        const nextItemIndex = Utils.getNextItemIndexBeforeTouchEnd(translateXPosition, this.state)
        const nextTranslateXPosition = Utils.getTranslate3dPosition(nextItemIndex, this.state)

        Utils.animate(this.stageComponent, nextTranslateXPosition, 0)
        this._slideToItem(nextItemIndex, { duration: 0, shouldSkipRecalculation: true })
      }
    }, duration)
  }

  _isInfiniteModeDisabledBeforeTouchEnd(swipeIndex, currentIndex) {
    const { items, itemWidth, duration, slides } = this.state
    let position = Utils.getTranslate3dPosition(currentIndex, { itemWidth, items })

    if (swipeIndex < items) {
      currentIndex = 0
      position = items * -itemWidth
    }

    if (swipeIndex > slides.length) {
      currentIndex = slides.length - items
      position = slides.length * -itemWidth
    }

    Utils.animate(this.stageComponent, position, duration)
    this._setTranslateAnimationProcessingFlag()

    setTimeout(() => {
      this._removeTouchEventFromCallstack()
      this._resetTranslateAnimationProcessingFlag()

      if (!this.swipingStarted && this.touchEventsCallstack.length === 0) {
        Utils.animate(this.stageComponent, position)
        this._slideToItem(currentIndex, { duration: 0, shouldSkipRecalculation: true })
      }
    }, duration)
  }

  _setAnimationPropsOnClick = (direction) => {
    const { currentIndex, itemWidth } = this.state
    const fadeOutIndex = Utils.getFadeOutIndexOnClick(currentIndex)
    const fadeOutOffset = Utils.getFadeOutOffsetOnClick(direction, itemWidth)

    this._setAnimationProps({ fadeOutIndex, fadeOutOffset, allowFadeOutAnimation: true })
  }

  _slidePrev = (action = true) => {
    if (!this.allowAnimation || this.swipeAnimation) {
      return
    }

    this._disableAnimation()
    const { isPrevSlideDisabled } = Utils.itemInfo(this.state)

    if (this._isFadeOutAnimationAllowed()) {
      this._setAnimationPropsOnClick('prev')
    }

    if (isPrevSlideDisabled) {
      this._onInactiveItem()
      return
    }

    if (action && this.props.disableAutoPlayOnAction) {
      this._pause()
    }

    this._slideToItem(this.state.currentIndex - 1)
  }

  _slideNext = (action = true) => {
    if (!this.allowAnimation || this.swipeAnimation) {
      return
    }
    this._disableAnimation()

    const { isNextSlideDisabled } = Utils.itemInfo(this.state)

    if (isNextSlideDisabled) {
      this._onInactiveItem()
      return
    }

    if (action && this.props.disableAutoPlayOnAction) {
      this._pause()
    }

    if (this._isFadeOutAnimationAllowed()) {
      this._setAnimationPropsOnClick('next')
    }

    this._slideToItem(this.state.currentIndex + 1)
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
        onClick={this._slidePrev}
        onMouseEnter={this._handleOnMouseEnter}
        onMouseLeave={this._handleOnMouseLeave}
      />
    )
  }

  _renderNextButton() {
    const { isNextSlideDisabled } = Utils.itemInfo(this.state)

    return (
      <Views.PrevNextButton
        name="next"
        disabled={isNextSlideDisabled}
        onClick={this._slideNext}
        onMouseEnter={this._handleOnMouseEnter}
        onMouseLeave={this._handleOnMouseLeave}
      />
    )
  }

  _renderStageItem = (item, i) => {
    const style = Utils.itemStyles(i, this.state, this.animationProps)
    const className = Utils.itemClassName(i, this.state, this.animationProps)

    return <Views.StageItem styles={style} className={className} key={`stage-item-${i}`} item={item} />
  }

  _renderPlayPauseButton() {
    return <Views.PlayPauseButton isPlaying={this.state.isPlaying} onClick={this._playPauseToggle} />
  }

  _renderDotsNavigation() {
    return (
      <Views.DotsNavigation
        state={this.state}
        onClick={this._onDotClick}
        onMouseEnter={this._handleOnMouseEnter}
        onMouseLeave={this._handleOnMouseLeave}
      />
    )
  }

  render() {
    const { style, translate3d, clones } = this.state
    const height = this.props.autoHeigth && this._getStageHeight()
    const stagePadding = Utils.getStagePadding(this.props)
    const wrapperStyle = Utils.wrapperStyle(stagePadding)
    const stageStyle = Utils.stageStyle(style, { translate3d, height })

    console.debug('item: ', height)

    return (
      <div className="alice-carousel">
        <Swipeable
          rotationAngle={3}
          stopPropagation={true}
          onSwiping={this._onTouchMove}
          onSwiped={this._onTouchEnd}
          trackMouse={this.props.mouseDragEnabled}
          preventDefaultTouchmoveEvent={this.props.preventEventOnTouchMove}
        >
          <div
            style={wrapperStyle}
            className="alice-carousel__wrapper"
            onMouseEnter={this._handleOnMouseEnter}
            onMouseLeave={this._handleOnMouseLeave}
          >
            <ul style={stageStyle} className="alice-carousel__stage" ref={this._getStageComponentNode}>
              {clones.map(this._renderStageItem)}
            </ul>
          </div>
        </Swipeable>

        {this.props.showSlideInfo ? this._renderSlideInfo() : null}
        {!this.props.dotsDisabled ? this._renderDotsNavigation() : null}
        {!this.props.buttonsDisabled ? this._renderPrevButton() : null}
        {!this.props.buttonsDisabled ? this._renderNextButton() : null}
        {this.props.playButtonEnabled ? this._renderPlayPauseButton() : null}
      </div>
    )
  }
}

AliceCarousel.propTypes = propTypes
AliceCarousel.defaultProps = defaultProps
