import React from 'react'
import Swipeable from 'react-swipeable'
import PropTypes from 'prop-types'
import { animate, debounce, getElementWidth, deviceInfo, shouldCallHandlerOnWindowResize, getStagePadding, getTranslateX } from './common'

export default class AliceCarousel extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      clones: [],
      currentIndex: 1,
      duration: props.duration,
      slides: this._galleryChildren(props),
      style: { transition: 'transform 0ms ease-out' }
    }

    this._onTouchMove = this._onTouchMove.bind(this)
    this.handleOnResize = debounce(this._windowResizeHandler, 200)
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

    this.deviceInfo = deviceInfo()
  }

  componentWillReceiveProps(nextProps) {
    const {
      items, responsive, slideToIndex, duration, startIndex, keysControlDisabled, infinite,
      autoPlayActionDisabled, autoPlayDirection, autoPlayInterval, autoPlay, fadeOutAnimation
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

    if (this.props.autoPlayActionDisabled !== autoPlayActionDisabled ||
      this.props.autoPlayDirection !== autoPlayDirection ||
      this.props.autoPlayInterval !== autoPlayInterval ||
      this.props.infinite !== infinite ||
      this.props.autoPlay !== autoPlay) {
      this._pause()
    }

    if (this.props.items !== items || this.props.responsive !== responsive) {
      this.setState(this._calculateInitialProps(nextProps))
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.autoPlayActionDisabled !== prevProps.autoPlayActionDisabled ||
      this.props.autoPlayDirection !== prevProps.autoPlayDirection ||
      this.props.autoPlayInterval !== prevProps.autoPlayInterval ||
      this.props.autoPlay !== prevProps.autoPlay) {
      if (this.props.autoPlay) {
        this._play()
      }
    }

    if (this.props.stagePadding !== prevProps.stagePadding) {
      this.setState(this._calculateInitialProps(this.props))
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
    this._allowAnimation()
    if (this.props.onSlideChanged) {
      this.props.onSlideChanged({
        item: this.state.currentIndex,
        slide: this._getActiveSlideIndex()
      })
    }
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

    if (this.props.autoPlayActionDisabled) {
      this._pause()
    }
    this._slideToItem(itemIndex)
  }

  _cloneCarouselItems = (children, itemsInSlide, props) => {
    let items = itemsInSlide
    const { stagePadding, infinite } = props
    const { paddingLeft, paddingRight } = getStagePadding({ stagePadding })

    if (infinite) {
      if (paddingLeft || paddingRight) {
        if (itemsInSlide < children.length) {
          items = itemsInSlide + 1
        } else {
          const lastElement = children.slice(-1)
          const firstElement = children.slice(0, 1)
          const clonesBefore = lastElement.concat(children)
          const clonesAfter = children.concat(firstElement)

          return [].concat(clonesBefore, children, clonesAfter)
        }
      }
    }
    const clonesAfter = children.slice(0, items)
    const clonesBefore = children.slice(children.length - items)

    return [].concat(clonesBefore, children, clonesAfter)
  }

  _setStartIndex = (childrenLength, index) => {
    const startIndex = index ? Math.abs(Math.ceil(index)) : 0
    return Math.min(startIndex, (childrenLength - 1))
  }

  _calculateInitialProps(props) {
    const { startIndex, responsive } = props
    const children = this._galleryChildren(props)
    const items = this._setTotalItemsInSlide(responsive, children.length)
    const clones = this._cloneCarouselItems(children, items, props)
    const currentIndex = this._setStartIndex(children.length, startIndex)
    const galleryWidth = getElementWidth(this.stageComponent)
    const itemWidth = this._getItemWidth(galleryWidth, items)
    const translate3d = this._getTranslate3dPosition(currentIndex, { itemWidth, items }, props)

    return {
      items,
      itemWidth,
      currentIndex,
      slides: children,
      clones,
      translate3d,
    }
  }

  _setTotalItemsInSlide(responsiveConfig, childrenLength) {
    let items = 1
    if (responsiveConfig) {
      const configKeys = Object.keys(responsiveConfig)

      if (configKeys.length) {
        configKeys.forEach(width => {
          if (width < window.innerWidth) {
            items = Math.min(responsiveConfig[width].items, childrenLength) || items
          }
        })
      }
    }
    return items
  }

  _setInitialState() {
    this.setState(this._calculateInitialProps(this.props))
  }

  _windowResizeHandler = () => {
    if (shouldCallHandlerOnWindowResize(this.deviceInfo)) {
      this._pause()
      const { currentIndex } = this.state
      const prevProps = this._calculateInitialProps(this.props)
      const translate3d = this._getTranslate3dPosition(currentIndex, prevProps)
      const nextProps = { ...prevProps, currentIndex, translate3d }

      this.deviceInfo = deviceInfo()
      this.setState(nextProps)
    }
  }

  _getItemWidth = (galleryWidth, totalItems) => {
    return galleryWidth / totalItems
  }

  _getTranslate3dPosition = (currentIndex, state, nextProps) => {
    const { itemWidth, items } = state
    const { stagePadding, infinite } = nextProps || this.props
    const { paddingLeft, paddingRight } = getStagePadding({ stagePadding })

    if (infinite) {
      if (paddingLeft || paddingRight) {
        currentIndex += 1
      }
    }

    return (items + currentIndex) * -itemWidth
  }

  _galleryChildren = ({ children, items }) => {
    return children && children.length ? children : items
  }

  _recalculateTranslatePosition = (state) => {
    const { items, itemWidth, slides } = state || this.state
    const maxSlidePosition = slides.length - 1
    const currentIndex = (this.state.currentIndex < 0) ? maxSlidePosition : 0
    const nextIndex = (currentIndex === 0) ? items : (maxSlidePosition + items)
    const { paddingLeft, paddingRight } = getStagePadding(this.props)

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

  _shouldRecalculatePosition = (state) => {
    const { slides, currentIndex } = state || this.state
    return (currentIndex < 0 || currentIndex >= slides.length)
  }

  _resetFadeOutAnimationState = () => {
    this.setState({ fadeoutAnimationProcessing: false }, this._onSlideChanged)
  };

  _resetAllIntermediateProps = () => {
    this.swipingStarted = false
    this.touchEventsCallstack = []
    this.verticalSwipingDetected = false
    this.translateAnimationPrpcessing = false

    this._allowAnimation()
    this._stopSwipeAnimation()
    this._resetAnimationProps()
    this._resetSwipePositionProps()
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

  _isInactiveItem = (props, state) => {
    const { infinite } = props || this.props
    const { slides, items, currentIndex } = state || this.state

    const inactivePrev = infinite === false && currentIndex === 0
    const inactiveNext = infinite === false && (slides.length - items === currentIndex)

    return { inactivePrev, inactiveNext }
  }

  _prevButton() {
    const { inactivePrev } = this._isInactiveItem()
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
    const { inactiveNext } = this._isInactiveItem()
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
    const { currentIndex, slidesLength } = this._getSlideIndexInfo()

    return (
      <div className="alice-carousel__slide-info">
        <span className="alice-carousel__slide-info-item">{currentIndex}</span>
        <span className="alice-carousel__slide-info-item alice-carousel__slide-info-item--separator">/</span>
        <span className="alice-carousel__slide-info-item">{slidesLength}</span>
      </div>
    )
  }

  _getSlideIndexInfo = (state) => {
    const { currentIndex: index, slides: { length }} = state || this.state
    let currentIndex = index + 1

    if (currentIndex < 1) { currentIndex = length }
    else if (currentIndex > length) { currentIndex = 1 }

    return {
      currentIndex,
      slidesLength: length,
    }
  }

  _getActiveSlideIndex = (state) => {
    let { slides, items, currentIndex } = state || this.state
    const slidesLength = slides.length
    const { inactiveNext } = this._isInactiveItem()
    const dotsLength = this._getDotsLength(slidesLength, items)

    currentIndex = currentIndex + items

    if (items === 1) {
      if (currentIndex < items) {
        return slidesLength - items
      }
      else if (currentIndex > slidesLength) {
        return 0
      }
      else {
        return currentIndex - 1
      }
    } else {
      if (currentIndex === slidesLength + items) {
        return 0
      }
      else if (inactiveNext || currentIndex < items && currentIndex !== 0) {
        return dotsLength
      }
      else if (currentIndex === 0) {
        return slidesLength % items === 0 ? dotsLength : dotsLength - 1
      }
      else {
        return Math.floor(currentIndex / items) - 1
      }
    }
  }

  _getDotsLength = (slidesLength, items) => {
    return slidesLength % items === 0
      ? Math.floor(slidesLength / items) - 1
      : Math.floor(slidesLength / items)
  }

  _setAnimationPropsOnDotsClick = (itemIndex, state) => {
    const { currentIndex } = state || this.state
    const fadeOutIndex = currentIndex + 1
    const fadeOutOffset = this._fadeOutOffset(itemIndex)

    this._setAnimationProps({ fadeOutIndex, fadeOutOffset, allowFadeOutAnimation: true })
  }

  _fadeOutOffset = (itemIndex, state)=> {
    const { currentIndex, itemWidth } = state || this.state

    if (itemIndex < currentIndex) {
      return (currentIndex - itemIndex) * -itemWidth
    } else {
      return (itemIndex - currentIndex) * itemWidth
    }
  }

  _renderDotsNavigation(state) {
    const { slides, items } = state || this.state
    const dotsLength = Math.ceil(slides.length / items)

    return (
      <ul className="alice-carousel__dots">
        {
          slides.map((item, i) => {
            if (i < dotsLength) {
              const itemIndex = this._getItemIndexForDotNavigation(i, dotsLength)
              return <li
                key={i}
                onClick={() => this._onDotClick(itemIndex)}
                onMouseEnter={this._onMouseEnterAutoPlayHandler}
                onMouseLeave={this._onMouseLeaveAutoPlayHandler}
                className={`alice-carousel__dots-item${ this._getActiveSlideIndex() === i ? ' __active' : '' }`}
              />
            }
          })
        }
      </ul>
    )
  }

  _getItemIndexForDotNavigation = (i, dotsLength) => {
    const { slides, items } = this.state
    const isNotInfinite = this.props.infinite === false

    return isNotInfinite && i === dotsLength - 1 ? (slides.length - items) : (i * items)
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
        if (!this._isHovered() && this._autoPlayIntervalId) {
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

    const translate3d = this._getTranslate3dPosition(index, this.state)

    this.setState({
      currentIndex: index,
      translate3d,
      ...this._intermediateStateProps(duration, shouldSkipRecalculation),
    }, () => this._checkSlidePosition(shouldSkipRecalculation))
  }

  _isFadeOutAnimationAllowed = () => {
    const { paddingLeft, paddingRight } = getStagePadding(this.props)

    return (
      this.props.fadeOutAnimation &&
      !(paddingLeft || paddingRight) &&
      (this.state.items === 1)
    )
  }

  _isSwipeDisable = () => {
    return (
      this.props.swipeDisabled ||
      this.state.fadeOutAnimation
    )
  }

  _verticalTouchMoveDetected = (e, deltaX, deltaY) => {
    const gap = 32
    const vertical = Math.abs(deltaY)
    const horizontal = Math.abs(deltaX)

    return (vertical > horizontal && horizontal < gap)
  }

  _addTouchEventToCallstack = () => {
    this.touchEventsCallstack.push(1)
  }

  _removeTouchEventFromCallstack = () => {
    this.touchEventsCallstack.pop()
  }

  _setTranslateAnimationProcessingFlag = () => {
    this.translateAnimationPrpcessing = true
  }

  _resetTranslateAnimationProcessingFlag = () => {
    this.translateAnimationPrpcessing = false
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

  _getNextItemIndexBeforeTouchEnd = (currentTranslateXPosition) => {
    const { items, itemWidth, slides: { length }} = this.state
    const { stagePadding, infinite } = this.props

    let currInd = currentTranslateXPosition / -itemWidth - items

    if (infinite) {
      if (stagePadding) {
        currInd -= 1
      }
    }

    if (currInd === length) { return 0 }
    if (currInd < 0) {
      return length + currInd
    }

    return currInd
  }

  _getTranslateXPosition = () => {
    const { translate3d } = this.state
    const { startPosition = translate3d } = this.swipePosition

    if (!!this.touchEventsCallstack.length && this.translateAnimationPrpcessing) {
      this._resetTranslateAnimationProcessingFlag()
      const lastTranslateXPosition = getTranslateX(this.stageComponent)

      if (lastTranslateXPosition) {
        return lastTranslateXPosition
      }
    }

    return startPosition
  }

  _getStartSwipePositionOnTouchMove = (deltaX) => (
    this._getTranslateXPosition() - deltaX
  )

  _getSwipeDirection = (deltaX) => (
    deltaX > 0 ? 'LEFT' : 'RIGHT'
  )

  _getMaxSWipePosition = () => {
    const { slides, items, itemWidth } = this.state
    return (slides.length + items) * itemWidth
  }

  _onTouchMove(e, deltaX, deltaY) {
    if (this._isSwipeDisable()) {
      return
    }

    if (this._verticalTouchMoveDetected(e, deltaX, deltaY)) {
      this.verticalSwipingDetected = true
      return
    }

    this.swipingStarted = true
    this.verticalSwipingDetected = false

    const { slides, items, itemWidth } = this.state

    this._disableAnimation()
    this._startSwipeAnimation()
    this._onMouseEnterAutoPlayHandler()

    const maxPosition = this._getMaxSWipePosition()
    const direction = this._getSwipeDirection(deltaX)
    let position = this._getStartSwipePositionOnTouchMove(deltaX)

    if (this.props.infinite === false) {

      const slideOffset = Math.min(itemWidth / 2, 250)
      const leftTranslate = (items * -itemWidth) + slideOffset
      const rightTranslate = (slides.length * -itemWidth) - slideOffset

      if (position > leftTranslate || position < rightTranslate) {
        return
      }
    }

    const { paddingLeft, paddingRight } = getStagePadding(this.props)
    const limitMinPos = (paddingLeft) ? (itemWidth + paddingLeft) : 0
    const limitMaxPos = (paddingRight) ? (maxPosition + itemWidth - paddingRight) : maxPosition

    // if (position >= (0 - limitMinPos) || Math.abs(position) >= (limitMaxPos)) {
    //   recalculatePosition()
    // }

    if (position >= 0 - limitMinPos || Math.abs(position) >= limitMaxPos) {
      recalculatePosition()
    }

    animate(this.stageComponent, position)
    this._setSwipePositionProps({ position, direction })

    function recalculatePosition() {
      direction === 'RIGHT'
        ? position += slides.length * -itemWidth
        : position += maxPosition - items * itemWidth

      if (position >= (0 - limitMinPos) || Math.abs(position) >= (limitMaxPos)) {
        recalculatePosition()
      }
    }
  }

  _onTouchEnd = () => {
    this.swipingStarted = false

    if (this._isSwipeDisable() || this.verticalSwipingDetected) {
      return
    }

    this._addTouchEventToCallstack()
    this._setSwipePositionProps({ startPosition: this.swipePosition.position })

    this._beforeTouchEnd()
    this._onMouseLeaveAutoPlayHandler()
  }

  _beforeTouchEnd() {
    const { itemWidth, items, duration } = this.state
    const swipeIndex = this._calculateSwipeIndex()
    const currentIndex = swipeIndex - items
    const translateXPosition = swipeIndex * -itemWidth

    if (this.props.infinite === false) {
      this._isInfiniteModeDisabledBeforeTouchEnd(swipeIndex, currentIndex)
      return
    }

    animate(this.stageComponent, translateXPosition, duration)
    this._setTranslateAnimationProcessingFlag()

    setTimeout(() => {
      this._removeTouchEventFromCallstack()
      this._resetTranslateAnimationProcessingFlag()

      if (!this.swipingStarted && this.touchEventsCallstack.length === 0) {

        const nextItemIndex = this._getNextItemIndexBeforeTouchEnd(translateXPosition)
        const nextTranslateXPosition = this._getTranslate3dPosition(nextItemIndex, { itemWidth, items })

        animate(this.stageComponent, nextTranslateXPosition, 0)
        this._slideToItem(nextItemIndex, { duration: 0, shouldSkipRecalculation: true })
      }
    }, duration)
  }

  _isInfiniteModeDisabledBeforeTouchEnd(swipeIndex, currentIndex) {
    const { items, itemWidth, duration, slides } = this.state
    let position = this._getTranslate3dPosition(currentIndex, { itemWidth, items })

    if (swipeIndex < items) {
      currentIndex = 0
      position = items * -itemWidth
    }

    if (swipeIndex > slides.length) {
      currentIndex = slides.length - items
      position = slides.length * -itemWidth
    }

    animate(this.stageComponent, position, duration)
    this._setTranslateAnimationProcessingFlag()

    setTimeout(() => {
      this._removeTouchEventFromCallstack()
      this._resetTranslateAnimationProcessingFlag()

      if (!this.swipingStarted && this.touchEventsCallstack.length === 0) {
        animate(this.stageComponent, position)
        this._slideToItem(currentIndex, { duration: 0, shouldSkipRecalculation: true })
      }
    }, duration)
  }

  _onMouseEnterAutoPlayHandler = () => {
    if (this.props.stopAutoPlayOnHover) {
      this.isHovered = true
    }
  }

  _onMouseLeaveAutoPlayHandler = () => this.isHovered = false

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

    const { inactivePrev } = this._isInactiveItem()

    if (this._isFadeOutAnimationAllowed()) {
      this._setAnimationPropsOnPrevNextClick('prev')
    }

    if (inactivePrev) {
      this._onInactiveItem()
      return
    }

    if (action && this.props.autoPlayActionDisabled) {
      this._pause()
    }

    this._slideToItem(this.state.currentIndex - 1)
  }

  _slideNext = (action = true) => {
    if (!this.allowAnimation || this.swipeAnimation) {
      return
    }
    this._disableAnimation()

    const { inactiveNext } = this._isInactiveItem()

    if (inactiveNext) {
      this._onInactiveItem()
      return
    }

    if (action && this.props.autoPlayActionDisabled) {
      this._pause()
    }

    if (this._isFadeOutAnimationAllowed()) {
      this._setAnimationPropsOnPrevNextClick('next')
    }

    this._slideToItem(this.state.currentIndex + 1)
  }

  _isActiveItem = (i) => {
    const { paddingLeft, paddingRight } = getStagePadding(this.props)
    let { currentIndex, items } = this.state

    if (paddingLeft || paddingRight) {
      currentIndex += 1
    }
    return currentIndex + items === i
  }

  _isClonedItem = (i) => {
    const { items, slides } = this.state
    return this.props.infinite === false && (i < items || i > slides.length + items - 1)
  }

  _isAnimatedItem = (i) => {
    const { allowFadeOutAnimation, fadeOutIndex } = this.animationProps
    return allowFadeOutAnimation && fadeOutIndex === i
  }

  _setItemStyles = (i) => {
    const { itemWidth, duration } = this.state
    const { fadeOutOffset } = this.animationProps

    return !this._isAnimatedItem(i)
      ? { width: `${itemWidth}px` }
      : { transform: `translateX(${fadeOutOffset}px)`, animationDuration: `${duration}ms`, width: `${itemWidth}px` }
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
    const { paddingLeft, paddingRight } = getStagePadding(this.props)
    const stageStyle = { ...style, ...{ transform: `translate3d(${translate3d}px, 0, 0)` }}
    const wrapperStyle = { paddingLeft: paddingLeft + 'px', paddingRight: paddingRight + 'px' }

    return (
      <div className="alice-carousel">
        <Swipeable
          stopPropagation={true}
          onSwiping={this._onTouchMove}
          onSwiped={this._onTouchEnd}
          rotationAngle={3}
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

        { this.props.showSlideIndex ? this._slideIndexInfoComponent() : null }
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
  showSlideIndex: PropTypes.bool,
  mouseDragEnabled: PropTypes.bool,
  fadeOutAnimation: PropTypes.bool,
  autoPlayInterval: PropTypes.number,
  autoPlayDirection: PropTypes.string,
  autoPlayActionDisabled: PropTypes.bool,
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
  showSlideIndex: false,
  swipeDisabled: false,
  autoPlayInterval: 250,
  buttonsDisabled: false,
  mouseDragEnabled: false,
  fadeOutAnimation: false,
  playButtonEnabled: false,
  autoPlayDirection: 'ltr',
  keysControlDisabled: false,
  autoPlayActionDisabled: false,
  stopAutoPlayOnHover: true,
  preventEventOnTouchMove: false,
}
