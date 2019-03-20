import React from 'react'
import Swipeable from 'react-swipeable'

import * as Utils from './utils'
import { propTypes, defaultProps } from './propTypes'

export default class AliceCarousel extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      clones: [],
      currentIndex: 1,
      stagePadding: {},
      duration: props.duration,
      slides: Utils.getSlides(props),
      style: { transition: 'transform 0ms ease-out' },
    }

    this._onTouchMove = this._onTouchMove.bind(this)
    this.handleOnResize = Utils.debounce(this._windowResizeHandler, 100)
  }

  componentDidMount() {
    this._setInitialState()
    this._resetAllIntermediateProps()

    window.addEventListener('resize', this.handleOnResize)

    if (!this.props.keysControlDisabled) {
      window.addEventListener('keyup', this._keyUpHandler)
    }

    this.deviceInfo = Utils.deviceInfo()
    this.props.autoPlay && this._play()
  }

  componentWillReceiveProps(nextProps) {
    const { slideToIndex, duration, fadeOutAnimation } = nextProps

    if (this.props.duration !== duration) {
      this.setState({ duration })
    }

    if (this.props.fadeOutAnimation !== fadeOutAnimation) {
      this.setState({ fadeoutAnimationProcessing: false }, this._resetAnimationProps)
    }

    if (slideToIndex !== this.props.slideToIndex) {
      this._onSlideToIndexChange(this.state.currentIndex, slideToIndex)
    }
  }

  componentDidUpdate(prevProps) {
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
        ? window.removeEventListener('keyup', this._keyUpHandler)
        : window.addEventListener('keyup', this._keyUpHandler)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleOnResize)

    if (!this.props.keysControlDisabled) {
      window.removeEventListener('keyup', this._keyUpHandler)
    }

    if (this._autoPlayIntervalId) {
      window.clearInterval(this._autoPlayIntervalId)
      this._autoPlayIntervalId = null
    }
  }

  _windowResizeHandler = () => {
    if (Utils.shouldCallHandlerOnWindowResize(this.deviceInfo)) {
      const { currentIndex, isPlaying } = this.state

      this._pause()
      this._resetAllIntermediateProps()
      this._disableAnimation()
      this.deviceInfo = Utils.deviceInfo()

      const currState = Utils.calculateInitialProps(this.props, this.stageComponent)
      const translate3d = Utils.getTranslate3dPosition(currentIndex, currState)
      const nextState = { ...currState, currentIndex, translate3d }

      this.setState(nextState, () => {
        this.props.autoPlay && isPlaying && this._play()
        this._allowAnimation()
        this._onResized()
      })
    }
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
    this._isFadeOutAnimationAllowed() && this._setAnimationPropsOnDotsClick(itemIndex)
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

  _prevButton() {
    const { inactivePrev } = Utils.itemInfo(this.state)
    const className = `alice-carousel__prev-btn-item${inactivePrev ? ' __inactive' : ''}`

    return (
      <div className="alice-carousel__prev-btn">
        <div
          className="alice-carousel__prev-btn-wrapper"
          onMouseEnter={this._onMouseEnterAutoPlayHandler}
          onMouseLeave={this._onMouseLeaveAutoPlayHandler}
        >
          <p className={className} onClick={this._slidePrev}>
            <span data-area="Prev" />
          </p>
        </div>
      </div>
    )
  }

  _nextButton() {
    const { inactiveNext } = Utils.itemInfo(this.state)
    const className = `alice-carousel__next-btn-item${inactiveNext ? ' __inactive' : ''}`

    return (
      <div className="alice-carousel__next-btn">
        <div
          className="alice-carousel__next-btn-wrapper"
          onMouseEnter={this._onMouseEnterAutoPlayHandler}
          onMouseLeave={this._onMouseLeaveAutoPlayHandler}
        >
          <p className={className} onClick={this._slideNext}>
            <span data-area="Next" />
          </p>
        </div>
      </div>
    )
  }

  _slideIndexInfoComponent = () => {
    const { currentIndex, slides } = this.state
    const { slideIndex, slidesLength } = Utils.getSlideInfo(currentIndex, slides.length)
    return (
      <div className="alice-carousel__slide-info">
        <span className="alice-carousel__slide-info-item">{slideIndex}</span>
        <span className="alice-carousel__slide-info-item alice-carousel__slide-info-item--separator">/</span>
        <span className="alice-carousel__slide-info-item">{slidesLength}</span>
      </div>
    )
  }

  _getEventObject = (state = this.state) => {
    const { items: itemsInSlide, currentIndex: item } = state
    const slide = this._getActiveSlideIndex(state)

    return { item, slide, itemsInSlide }
  }

  _getActiveSlideIndex = (state = this.state) => {
    const { slides, items, currentIndex } = state
    const { inactiveNext } = Utils.itemInfo(state)

    return Utils.getActiveSlideIndex(inactiveNext, currentIndex, items, slides.length)
  }

  _setAnimationPropsOnDotsClick = (itemIndex) => {
    const { currentIndex, itemWidth } = this.state
    const fadeOutIndex = currentIndex + 1
    const fadeOutOffset = Utils.getFadeOutOffset(itemIndex, currentIndex, itemWidth)

    this._setAnimationProps({ fadeOutIndex, fadeOutOffset, allowFadeOutAnimation: true })
  }

  _renderDotsNavigation() {
    const { slides, items } = this.state
    const dotsLength = Utils.getDotsNavigationLength(slides.length, items)

    return (
      <ul className="alice-carousel__dots">
        {slides.map((item, i) => {
          if (i < dotsLength) {
            const itemIndex = this._getItemIndexForDotNavigation(i, dotsLength)
            const className = this._getActiveSlideIndex() === i ? ' __active' : ''
            return (
              <li
                key={i}
                onClick={() => this._onDotClick(itemIndex)}
                onMouseEnter={this._onMouseEnterAutoPlayHandler}
                onMouseLeave={this._onMouseLeaveAutoPlayHandler}
                className={`alice-carousel__dots-item${className}`}
              />
            )
          }
        })}
      </ul>
    )
  }

  _getItemIndexForDotNavigation = (i, dotsLength) => {
    const { slides, items, infinite } = this.state
    const isNotInfinite = infinite === false

    return isNotInfinite && i === dotsLength - 1 ? slides.length - items : i * items
  }

  _renderPlayPauseButton() {
    return (
      <div className="alice-carousel__play-btn">
        <div className="alice-carousel__play-btn-wrapper">
          <div
            onClick={this._playPauseToggle}
            className={`alice-carousel__play-btn-item${this.state.isPlaying ? ' __pause' : ''}`}
          />
        </div>
      </div>
    )
  }

  _play() {
    const { duration } = this.state
    const { autoPlayDirection, autoPlayInterval } = this.props
    const playInterval = Math.max(autoPlayInterval || duration, duration)

    this.setState({ isPlaying: true })

    if (!this._autoPlayIntervalId) {
      this._autoPlayIntervalId = window.setInterval(() => {
        if (!this._isHovered() && this._autoPlayIntervalId && this.state.isPlaying) {
          autoPlayDirection === 'rtl' ? this._slidePrev(false) : this._slideNext(false)
        }
      }, playInterval)
    }
  }

  _pause = () => {
    if (this._autoPlayIntervalId) {
      window.clearInterval(this._autoPlayIntervalId)
      this._autoPlayIntervalId = null
      this.setState({ isPlaying: false })
    }
  }

  _playPauseToggle = () => {
    if (!this.allowAnimation) return
    this.state.isPlaying ? this._pause() : this._play()
  }

  _keyUpHandler = (e) => {
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

  _intermediateStateProps = (duration, shouldSkipRecalculation) => {
    const condition = this._isFadeOutAnimationAllowed() && !shouldSkipRecalculation
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
    const { paddingLeft, paddingRight } = stagePadding

    return this.props.fadeOutAnimation && !(paddingLeft || paddingRight) && items === 1
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

  _getTranslateXPosition = () => {
    const { translate3d } = this.state
    const { startPosition = translate3d } = this.swipePosition

    if (!!this.touchEventsCallstack.length && this.translateAnimationProcessing) {
      this._resetTranslateAnimationProcessingFlag()
      const lastTranslateXPosition = Utils.getTranslateX(this.stageComponent)

      if (lastTranslateXPosition) {
        return lastTranslateXPosition
      }
    }

    return startPosition
  }

  _getStartSwipePositionOnTouchMove = (deltaX) => {
    return this._getTranslateXPosition() - deltaX
  }

  _onTouchMove(e, deltaX, deltaY) {
    this.swipingStarted = true
    this._onMouseEnterAutoPlayHandler()

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
    let position = this._getStartSwipePositionOnTouchMove(deltaX)

    if (infinite === false) {
      const minSwipeLimit = Utils.getMinSwipeLimitIfNotInfinite(itemWidth)
      const maxSwipeLimit = Utils.getMaxSwipeLimitIfNotInfinite(slidesLength, itemWidth)

      if (position > -minSwipeLimit || Math.abs(position) > maxSwipeLimit) {
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

    if (position >= 0 - minSwipeLimit || Math.abs(position) >= maxSwipeLimit) {
      try {
        recalculatePosition()
      } catch (err) {
        Utils.debug(err)
      }
    }

    Utils.animate(this.stageComponent, position)
    this._setSwipePositionProps({ position, direction })

    function recalculatePosition() {
      direction === 'RIGHT' ? (position += slidesLength * -itemWidth) : (position += maxPosition - items * itemWidth)

      if (position >= 0 - minSwipeLimit || Math.abs(position) >= maxSwipeLimit) {
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

    Utils.animate(this.stageComponent, translateXPosition, duration)
    this._setTranslateAnimationProcessingFlag()

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

  _onMouseEnterAutoPlayHandler = () => {
    if (this.props.stopAutoPlayOnHover) {
      this.isHovered = true
    }
  }

  _onMouseLeaveAutoPlayHandler = () => {
    this.isHovered = false
  }

  _setAnimationPropsOnPrevNextClick = (direction = 'next') => {
    const { currentIndex, itemWidth } = this.state

    const fadeOutIndex = currentIndex === 0 ? 1 : currentIndex + 1
    const fadeOutOffset = direction === 'next' ? itemWidth : -itemWidth

    this._setAnimationProps({ fadeOutIndex, fadeOutOffset, allowFadeOutAnimation: true })
  }

  _slidePrev = (action = true) => {
    if (!this.allowAnimation || this.swipeAnimation) {
      return
    }

    this._disableAnimation()
    const { inactivePrev } = Utils.itemInfo(this.state)

    if (this._isFadeOutAnimationAllowed()) {
      this._setAnimationPropsOnPrevNextClick('prev')
    }

    if (inactivePrev) {
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

    const { inactiveNext } = Utils.itemInfo(this.state)

    if (inactiveNext) {
      this._onInactiveItem()
      return
    }

    if (action && this.props.disableAutoPlayOnAction) {
      this._pause()
    }

    if (this._isFadeOutAnimationAllowed()) {
      this._setAnimationPropsOnPrevNextClick('next')
    }

    this._slideToItem(this.state.currentIndex + 1)
  }

  _renderStageItem = (item, i) => {
    const itemStyle = Utils.itemStyles(i, this.state, this.animationProps)
    const itemClassName = Utils.itemClassName(i, this.state, this.animationProps)

    return (
      <li style={itemStyle} className={itemClassName} key={i}>
        {item}
      </li>
    )
  }

  render() {
    const { style, translate3d, clones } = this.state
    const stagePadding = Utils.getStagePadding(this.props)
    const stageStyle = Utils.stageStyle(style, translate3d)
    const wrapperStyle = Utils.wrapperStyle(stagePadding)

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
            onMouseEnter={this._onMouseEnterAutoPlayHandler}
            onMouseLeave={this._onMouseLeaveAutoPlayHandler}
          >
            <ul style={stageStyle} className="alice-carousel__stage" ref={this._getStageComponentNode}>
              {clones.map(this._renderStageItem)}
            </ul>
          </div>
        </Swipeable>

        {this.props.showSlideInfo ? this._slideIndexInfoComponent() : null}
        {!this.props.dotsDisabled ? this._renderDotsNavigation() : null}
        {!this.props.buttonsDisabled ? this._prevButton() : null}
        {!this.props.buttonsDisabled ? this._nextButton() : null}
        {this.props.playButtonEnabled ? this._renderPlayPauseButton() : null}
      </div>
    )
  }
}

AliceCarousel.propTypes = { ...propTypes }
AliceCarousel.defaultProps = { ...defaultProps }
