import React from 'react'
import Swipeable from 'react-swipeable'
import PropTypes from 'prop-types'
import * as Utils from './utils'

export default class AliceCarousel extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      clones: [],
      currentIndex: 1,
      stagePadding: {},
      duration: props.duration,
      slides: Utils.getSlides(props),
      style: { transition: 'transform 0ms ease-out' }
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

    if (this.props.autoPlay) {
      this._play()
    }

    this.deviceInfo = Utils.deviceInfo()
  }

  componentWillReceiveProps(nextProps) {
    const {
      slideToIndex, duration, startIndex, keysControlDisabled, infinite,
      disableAutoPlayOnAction, autoPlayDirection, autoPlayInterval, autoPlay, fadeOutAnimation
    } = nextProps

    if (this.props.duration !== duration) {
      this.setState({ duration })
    }

    if (this.props.fadeOutAnimation !== fadeOutAnimation) {
      this.setState({ fadeoutAnimationProcessing: false }, this._resetAnimationProps)
    }

    if (slideToIndex !== this.props.slideToIndex) {
      this._onSlideToIndexChange(this.state.currentIndex, slideToIndex)
    }

    if (this.props.startIndex !== startIndex && slideToIndex === this.props.slideToIndex) {
      this._slideToItem(startIndex)
    }

    if (this.props.keysControlDisabled !== keysControlDisabled) {
      keysControlDisabled
        ? window.removeEventListener('keyup', this._keyUpHandler)
        : window.addEventListener('keyup', this._keyUpHandler)
    }

    if (this.props.disableAutoPlayOnAction !== disableAutoPlayOnAction ||
      this.props.autoPlayDirection !== autoPlayDirection ||
      this.props.autoPlayInterval !== autoPlayInterval ||
      this.props.infinite !== infinite ||
      this.props.autoPlay !== autoPlay) {
      this._pause()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.disableAutoPlayOnAction !== prevProps.disableAutoPlayOnAction ||
      this.props.autoPlayDirection !== prevProps.autoPlayDirection ||
      this.props.autoPlayInterval !== prevProps.autoPlayInterval ||
      this.props.autoPlay !== prevProps.autoPlay) {
      if (this.props.autoPlay) {
        this._play()
      }
    }

    if (this.props.stagePadding !== prevProps.stagePadding ||
      this.props.responsive !== prevProps.responsive ||
      this.props.infinite !== prevProps.infinite ||
      this.props.items !== prevProps.items
    ) {
      this._resetAllIntermediateProps()
      this.setState(
        Utils.calculateInitialProps(this.props, this.stageComponent)
      )
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
      this.props.onSlideChange({
        item: this.state.currentIndex,
        slide: this._getActiveSlideIndex()
      })
    }
  }

  _onSlideChanged() {
    if (this.props.onSlideChanged) {
      this.props.onSlideChanged({
        item: this.state.currentIndex,
        slide: this._getActiveSlideIndex()
      })
    }
    this._allowAnimation()
  }

  _onDotClick = (itemIndex) => {
    if (this.state.currentIndex === itemIndex
      || !this.allowAnimation
      || this.swipeAnimation) {
      return
    }
    this._disableAnimation()

    if (this._isFadeOutAnimationAllowed()) {
      this._setAnimationPropsOnDotsClick(itemIndex)
    }

    if (this.props.disableAutoPlayOnAction) {
      this._pause()
    }
    this._slideToItem(itemIndex)
  }

  _setInitialState() {
    const initialState = Utils.calculateInitialProps(this.props, this.stageComponent)
    this.setState(initialState)
  }

  _windowResizeHandler = () => {
    if (Utils.shouldCallHandlerOnWindowResize(this.deviceInfo)) {
      this._pause()
      this._resetAllIntermediateProps()
      this.deviceInfo = Utils.deviceInfo()

      const { currentIndex } = this.state
      const currState = Utils.calculateInitialProps(this.props, this.stageComponent)
      const translate3d = Utils.getTranslate3dPosition(currentIndex, currState)
      const nextState = { ...currState, currentIndex, translate3d }

      this.setState(nextState, () => {
        if (this.props.autoPlay) {
          this._play()
        }
      })
    }
  }

  _recalculateTranslatePosition = () => {
    const { items, itemWidth, slides, stagePadding } = this.state
    const { paddingLeft, paddingRight } = stagePadding
    const maxSlidePosition = slides.length - 1
    const currentIndex = (this.state.currentIndex < 0) ? maxSlidePosition : 0
    const nextIndex = (currentIndex === 0) ? items : (maxSlidePosition + items)

    if (paddingLeft || paddingRight) {
      return (nextIndex + 1) * -itemWidth
    }
    return nextIndex * -itemWidth
  }

  _recalculateCurrentSlideIndex = (state) => {
    const { slides, currentIndex } = state || this.state
    return currentIndex < 0 ? (slides.length - 1) : 0
  }

  _recalculateFadeOutAnimationState = (shouldRecalculate) => {
    if (shouldRecalculate || this._isFadeOutAnimationAllowed()) {
      return { fadeoutAnimationProcessing: false }
    }
    return {}
  }

  _getStageComponentNode = node => this.stageComponent = node

  _allowAnimation = () => this.allowAnimation = true

  _disableAnimation = () => this.allowAnimation = false

  _isHovered = () => this.isHovered

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

    if (this.props.disableAutoPlayOnAction) {
      this._pause()
    }
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
    return (currentIndex < 0 || currentIndex >= slides.length)
  }

  _resetFadeOutAnimationState = () => {
    this.setState({ fadeoutAnimationProcessing: false }, this._onSlideChanged)
  };

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

  _recalculateSlidePosition() {
    const currentIndex = this._recalculateCurrentSlideIndex()
    const translate3d = this._recalculateTranslatePosition()

    this.setState({
      currentIndex,
      translate3d,
      ...this._recalculateFadeOutAnimationState(),
      style: { transition: 'transform 0ms ease-out' }
    }, () => this._onSlideChanged())
  }

  _prevButton() {
    const { inactivePrev } = Utils.isInactiveItem(this.state)
    const className = `alice-carousel__prev-btn-item${inactivePrev ? ' __inactive' : ''}`

    return (
      <div className="alice-carousel__prev-btn">
        <div
          className="alice-carousel__prev-btn-wrapper"
          onMouseEnter={this._onMouseEnterAutoPlayHandler}
          onMouseLeave={this._onMouseLeaveAutoPlayHandler}
        >
          <p className={className} onClick={this._slidePrev}><span data-area="Prev" /></p>
        </div>
      </div>
    )
  }

  _nextButton() {
    const { inactiveNext } = Utils.isInactiveItem(this.state)
    const className = `alice-carousel__next-btn-item${inactiveNext ? ' __inactive' : ''}`

    return (
      <div className="alice-carousel__next-btn">
        <div
          className="alice-carousel__next-btn-wrapper"
          onMouseEnter={this._onMouseEnterAutoPlayHandler}
          onMouseLeave={this._onMouseLeaveAutoPlayHandler}
        >
          <p className={className} onClick={this._slideNext}><span data-area="Next" /></p>
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

  _getActiveSlideIndex = () => {
    const { slides, items, currentIndex } = this.state
    const { inactiveNext } = Utils.isInactiveItem(this.state)

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
    const dotsLength = Utils.getDotsCeilLength(slides.length, items)

    return (
      <ul className="alice-carousel__dots">
        {
          slides.map((item, i) => {
            if (i < dotsLength) {
              const itemIndex = this._getItemIndexForDotNavigation(i, dotsLength)
              const className = this._getActiveSlideIndex() === i ? ' __active' : ''
              return <li
                key={i}
                onClick={() => this._onDotClick(itemIndex)}
                onMouseEnter={this._onMouseEnterAutoPlayHandler}
                onMouseLeave={this._onMouseLeaveAutoPlayHandler}
                className={`alice-carousel__dots-item${className}`}
              />
            }
          })
        }
      </ul>
    )
  }

  _getItemIndexForDotNavigation = (i, dotsLength) => {
    const { slides, items, infinite } = this.state
    const isNotInfinite = (infinite === false)

    return (isNotInfinite && i === (dotsLength - 1)) ? (slides.length - items) : (i * items)
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
    switch(e.keyCode) {
    case 32:
      this._playPauseToggle()
      break
    case 37:
      this._slidePrev()
      break
    case 39:
      this._slideNext()
      break
    }
  }

  _intermediateStateProps = (duration, shouldSkipRecalculation) => {
    return this._isFadeOutAnimationAllowed() && !shouldSkipRecalculation
      ? { fadeoutAnimationProcessing: true,  style: { transition: 'transform 0ms ease-out' }}
      : { style: { transition: `transform ${duration}ms ease-out` }}
  }

  _slideToItem(index, options = {}) {
    this._onSlideChange()

    const {
      duration = this.state.duration,
      shouldSkipRecalculation = false
    } = options

    const translate3d = Utils.getTranslate3dPosition(index, this.state)

    this.setState({
      currentIndex: index,
      translate3d,
      ...this._intermediateStateProps(duration, shouldSkipRecalculation),
    }, () => this._checkSlidePosition(shouldSkipRecalculation))
  }

  _isFadeOutAnimationAllowed = () => {
    const { stagePadding, items } = this.state
    const { paddingLeft, paddingRight } = stagePadding

    return (
      this.props.fadeOutAnimation && !(paddingLeft || paddingRight) && (items === 1)
    )
  }

  _isSwipeDisable = () => {
    return (
      this.props.swipeDisabled ||
      this.state.fadeOutAnimation ||
      this.verticalSwipingDetected
    )
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

  _setAnimationProps = newProps => {
    let prevProps = this.animationProps || {}
    this.animationProps = { ...prevProps, ...newProps }
  }

  _resetAnimationProps = () => {
    this.animationProps = {}
  }

  _setSwipePositionProps = newProps => {
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

  _getStartSwipePositionOnTouchMove = (deltaX) => (
    this._getTranslateXPosition() - deltaX
  )

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
    const direction = Utils.getSwipeDirection(deltaX)
    let position = this._getStartSwipePositionOnTouchMove(deltaX)

    if (infinite === false) {
      const leftTranslateLimit = Utils.getLeftTranslateLimit(items, itemWidth)
      const rightTranslateLimit = Utils.getRightTranslateLimit(slides.length, itemWidth)

      if (position > leftTranslateLimit || position < rightTranslateLimit) {
        return
      }

      Utils.animate(this.stageComponent, position)
      this._setSwipePositionProps({ position, direction })
      return
    }

    const maxPosition = Utils.getMaxSWipePosition(this.state)
    const limitMinPos = Utils.getSwipeMinLimit(itemWidth, stagePadding)
    const limitMaxPos = Utils.getSwipeMaxLimit(itemWidth, maxPosition, stagePadding)

    if (position >= 0 - limitMinPos || Math.abs(position) >= limitMaxPos) {
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
        ? position += slides.length * -itemWidth
        : position += maxPosition - items * itemWidth

      if (position >= (0 - limitMinPos) || Math.abs(position) >= (limitMaxPos)) {
        try {
          recalculatePosition()
        } catch (err) {
          Utils.debug(err)
        }
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

  _onMouseEnterAutoPlayHandler = ()  => {
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

  _slidePrev =  (action = true) => {
    if (!this.allowAnimation || this.swipeAnimation) {
      return
    }
    this._disableAnimation()

    const { inactivePrev } = Utils.isInactiveItem(this.state)

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

    const { inactiveNext } = Utils.isInactiveItem(this.state)

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

  _isActiveItem = (i) => {
    let { currentIndex, items, stagePadding } = this.state
    const { paddingLeft, paddingRight } = stagePadding

    if (paddingLeft || paddingRight) {
      currentIndex += 1
    }
    return currentIndex + items === i
  }

  _isClonedItem = (i) => {
    const { items, slides, infinite } = this.state
    return infinite === false && (i < items || i > slides.length + items - 1)
  }

  _isAnimatedItem = (i) => {
    const { allowFadeOutAnimation, fadeOutIndex } = this.animationProps
    return allowFadeOutAnimation && fadeOutIndex === i
  }

  _setItemStyles = (i) => {
    const { itemWidth, duration } = this.state
    const { fadeOutOffset } = this.animationProps

    return this._isAnimatedItem(i)
      ? { transform: `translateX(${fadeOutOffset}px)`, animationDuration: `${duration}ms`, width: `${itemWidth}px` }
      : { width: `${itemWidth}px` }
  }

  _setItemClassName = (i) => {
    const isActive = this._isActiveItem(i) ? ' __active' : ''
    const isCloned =  this._isClonedItem(i) ? ' __cloned' : ''
    const isAnimated = this._isAnimatedItem(i) ? ' animated animated-out fadeOut' : ''

    return 'alice-carousel__stage-item' + isActive + isCloned + isAnimated
  }

  _renderStageItem = (item, i) => {
    const itemStyle = this._setItemStyles(i)
    const itemClassName = this._setItemClassName(i)

    return <li style={itemStyle} className={itemClassName} key={i}>{ item }</li>
  }

  render() {
    const { style, translate3d, clones } = this.state
    const { paddingLeft, paddingRight } = Utils.getStagePadding(this.props)
    const stageStyle = { ...style, ...{ transform: `translate3d(${translate3d}px, 0, 0)` }}
    const wrapperStyle = { paddingLeft: paddingLeft + 'px', paddingRight: paddingRight + 'px' }

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
              { clones.map(this._renderStageItem) }
            </ul>
          </div>
        </Swipeable>

        { this.props.showSlideInfo ? this._slideIndexInfoComponent() : null }
        { !this.props.dotsDisabled ? this._renderDotsNavigation() : null }
        { !this.props.buttonsDisabled ? this._prevButton() : null }
        { !this.props.buttonsDisabled ? this._nextButton() : null }
        { this.props.playButtonEnabled ? this._renderPlayPauseButton() : null }

      </div>
    )
  }
}

AliceCarousel.propTypes = {
  items: PropTypes.array,
  children: PropTypes.array,
  onSlideChange: PropTypes.func,
  onSlideChanged: PropTypes.func,
  keysControlDisabled: PropTypes.bool,
  playButtonEnabled: PropTypes.bool,
  buttonsDisabled: PropTypes.bool,
  dotsDisabled: PropTypes.bool,
  swipeDisabled: PropTypes.bool,
  responsive: PropTypes.object,
  stagePadding: PropTypes.object,
  duration: PropTypes.number,
  startIndex: PropTypes.number,
  slideToIndex: PropTypes.number,
  autoPlay: PropTypes.bool,
  infinite: PropTypes.bool,
  showSlideInfo: PropTypes.bool,
  mouseDragEnabled: PropTypes.bool,
  fadeOutAnimation: PropTypes.bool,
  autoPlayInterval: PropTypes.number,
  autoPlayDirection: PropTypes.string,
  disableAutoPlayOnAction: PropTypes.bool,
  stopAutoPlayOnHover: PropTypes.bool,
  preventEventOnTouchMove: PropTypes.bool,
}

AliceCarousel.defaultProps = {
  items: [],
  children: [],
  responsive: {},
  stagePadding: {},
  duration: 250,
  startIndex: 0,
  slideToIndex: 0,
  autoPlay: false,
  infinite: true,
  dotsDisabled: false,
  showSlideInfo: false,
  swipeDisabled: false,
  autoPlayInterval: 250,
  buttonsDisabled: false,
  mouseDragEnabled: false,
  fadeOutAnimation: false,
  playButtonEnabled: false,
  autoPlayDirection: 'ltr',
  keysControlDisabled: false,
  disableAutoPlayOnAction: false,
  stopAutoPlayOnHover: true,
  preventEventOnTouchMove: false,
}
