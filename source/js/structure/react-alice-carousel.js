import React from 'react';
import Swipeable from 'react-swipeable';
import PropTypes from 'prop-types';
import { setTransformAnimation } from './common';


export default class AliceCarousel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      currentIndex: 1,
      duration: props.duration,
      style: { transition: 'transform 0ms ease-out' }
    };

    this.swipePosition = {};
    this.animationProps = {};
    this._onTouchMove = this._onTouchMove.bind(this);
  }

  componentDidMount() {
    this._allowAnimation();
    this._setInitialState();
    window.addEventListener('resize', this._resizeHandler);

    if (!this.props.keysControlDisabled) {
      window.addEventListener('keyup', this._keyUpHandler);
    }

    if (this.props.autoPlay) this._play();
  }

  componentWillReceiveProps(nextProps) {
    const { currentIndex } = this.state;
    const {
      slideToIndex, duration, startIndex, keysControlDisabled, infinite,
      autoPlayActionDisabled, autoPlayDirection, autoPlayInterval, autoPlay, fadeOutAnimation
    } = nextProps;

    if (this.props.duration !== duration) {
      this.setState({ duration });
    }

    if (this.props.fadeOutAnimation !== fadeOutAnimation) {
      this.setState({ fadeOutAnimation: false }, this._resetAnimationProps);
    }

    if (currentIndex !== slideToIndex && slideToIndex !== undefined) {

      if (slideToIndex === currentIndex + 1) {
        this._slideNext();
      } else if (slideToIndex === currentIndex - 1) {
        this._slidePrev();
      } else {
        this._onDotClick(slideToIndex);
      }
    }

    if (this.props.startIndex !== startIndex && !slideToIndex && slideToIndex !== 0) {
      this._slideToItem(startIndex);
    }

    if (this.props.keysControlDisabled !== keysControlDisabled) {
      keysControlDisabled === true
        ? window.removeEventListener('keyup', this._keyUpHandler)
        : window.addEventListener('keyup', this._keyUpHandler);
    }

    if (this.props.autoPlayActionDisabled !== autoPlayActionDisabled ||
      this.props.autoPlayDirection !== autoPlayDirection ||
      this.props.autoPlayInterval !== autoPlayInterval ||
      this.props.infinite !== infinite ||
      this.props.autoPlay !== autoPlay) {
      this._pause();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.autoPlayActionDisabled !== prevProps.autoPlayActionDisabled ||
      this.props.autoPlayDirection !== prevProps.autoPlayDirection ||
      this.props.autoPlayInterval !== prevProps.autoPlayInterval ||
      this.props.autoPlay !== prevProps.autoPlay) {
      if (this.props.autoPlay) {
        this._play();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeHandler);

    if (!this.props.keysControlDisabled) {
      window.removeEventListener('keyup', this._keyUpHandler);
    }

    if (this._autoPlayIntervalId) {
      window.clearInterval(this._autoPlayIntervalId);
      this._autoPlayIntervalId = null;
    }
  }

  /**
   * create clones for carousel items
   *
   * @param children
   * @param itemsInSlide
   * @returns {object}
   */
  _cloneSlides = (children, itemsInSlide) => {
    const first = children.slice(0, itemsInSlide);
    const last = children.slice(children.length - itemsInSlide);

    return last.concat(children, first);
  }

  /**
   * set initial carousel index
   *
   * @param {number} index
   * @param {number} childrenLength
   * @returns {number}
   */
  _setStartIndex = (childrenLength, index) => {
    const startIndex = index ? Math.abs(Math.ceil(index)) : 0;
    return Math.min(startIndex, (childrenLength - 1));
  }

  /**
   * calculate initial props
   *
   * @param {object} nextProps props which will be received
   * @returns {object}
   */
  _calculateInitialProps(nextProps) {
    let totalItems;
    let  { startIndex, children } = this.props;

    if (nextProps) {
      totalItems = nextProps.responsive;
      children =  nextProps.children;
    }

    const items = this._setTotalItemsInSlide(totalItems, children.length);
    const currentIndex = this._setStartIndex(children.length, startIndex);
    const itemWidth = this.stageComponent.getBoundingClientRect().width / items;

    return {
      items,
      itemWidth,
      currentIndex,
      slides: children,
      clones: this._cloneSlides(children, items),
      translate3d: -itemWidth * (items + currentIndex)
    };
  }

  /**
   * calculate total items in the slide
   *
   * @param {number} totalItems total items for the slide
   * @param {number} childrenLength slides length
   * @returns {number}
   */
  _setTotalItemsInSlide(totalItems, childrenLength) {
    let items = 1;
    const width = window.innerWidth;

    if (this.props.responsive) {
      const responsive = totalItems || this.props.responsive || {};

      if (Object.keys(responsive).length) {
        Object.keys(responsive).forEach((key) => {
          if (key < width) items = Math.min(responsive[key].items, childrenLength) || items;
        });
      }
    }
    return items;
  }

  /**
   * set initial state
   * */
  _setInitialState() {
    this.setState(this._calculateInitialProps());
  }

  /**
   * window resize handler
   * */
  _resizeHandler = () => this._setInitialState();

  /**
   * refers to parent carousel node
   *
   * @param {HTMLElement} node
   * */
  _getStageComponentNode = node => this.stageComponent = node;

  /**
   * enable carousel animation
   */
  _allowAnimation = () => this.allowAnimation = true;

  /**
   * disable carousel animation
   */
  _disableAnimation = () => this.allowAnimation = false;

  /**
   * check MouseEnter event
   * @returns {boolean}
   */
  _isHovered() { return this.isHovered; }

  /**
   * check if need recalculate a slide position
   * @param {bool} skip
   */
  _checkRecalculation(skip) {
    this._stopSwipeAnimation();
    this._resetAnimationProps();
    const { slides, currentIndex, duration } = this.state;
    const shouldRecalculatePosition = (currentIndex < 0 || currentIndex >= slides.length);

    if (skip) {
      if (this._allowFadeOutAnimation()) {
        this._resetFadeOutAnimationState();
        return;
      }
      this._onSlideChanged();
      return;
    }

    window.setTimeout(() => {
      if (shouldRecalculatePosition) {
        this._recalculateSlidePosition();
        return;
      }
      if (this._allowFadeOutAnimation()) {
        this._resetFadeOutAnimationState();
        return;
      }
      this._onSlideChanged();
    }, duration);
  }

  /**
   * reset fadeOutAnimation property
   */
  _resetFadeOutAnimationState = () => {
    this.setState({ fadeOutAnimation: false }, this._onSlideChanged);
  };

  /**
   * set new props to the state
   */
  _recalculateSlidePosition() {
    let { items, itemWidth, slides, currentIndex } = this.state;

    const fadeOutAnimationState = this._allowFadeOutAnimation() ? { fadeOutAnimation: false } : {};
    currentIndex = (currentIndex < 0) ? slides.length - 1 : 0;

    this.setState({
      currentIndex,
      ...fadeOutAnimationState,
      translate3d: -itemWidth * (currentIndex === 0 ? items : slides.length - 1 + items),
      style: {transition: 'transform 0ms ease-out'}
    }, () => this._onSlideChanged());
  }

  /**
   * call callback from props
   */
  _onSlideChange() {
    if (this.props.onSlideChange) {
      this.props.onSlideChange({
        item: this.state.currentIndex,
        slide: this._getActiveSlideIndex()
      });
    }
  }

  /**
   * call callback from props
   */
  _onSlideChanged() {
    this._allowAnimation();

    if (this.props.onSlideChanged) {
      this.props.onSlideChanged({
        item: this.state.currentIndex,
        slide: this._getActiveSlideIndex()
      });
    }
  }

  /**
   * check if current position is the first or the last
   * @returns {{inactivePrev: boolean, inactiveNext: boolean}}
   */
  _isInactiveItem = () => {
    const { infinite } = this.props;
    const { slides, items, currentIndex } = this.state;

    const inactivePrev = infinite === false && currentIndex === 0;
    const inactiveNext = infinite === false && (slides.length - items === currentIndex);

    return { inactivePrev, inactiveNext };
  }

  /**
   * create xml element
   * @returns {XML}
   */
  _prevButton() {
    const { inactivePrev } = this._isInactiveItem();
    const className = `alice-carousel__prev-btn-item${inactivePrev ? ' __inactive' : ''}`;

    return (
      <div className="alice-carousel__prev-btn">
        <div
          className="alice-carousel__prev-btn-wrapper"
          onMouseEnter={this._onMouseEnterAutoPlayHandler}
          onMouseLeave={this._onMouseLeaveAutoPlayHandler}
        >
          <div className={className} onClick={this._slidePrev} />
        </div>
      </div>
    );
  }

  /**
   * create xml element
   * @returns {XML}
   */
  _nextButton() {
    const { inactiveNext } = this._isInactiveItem();
    const className = `alice-carousel__next-btn-item${inactiveNext ? ' __inactive' : ''}`;

    return (
      <div className="alice-carousel__next-btn">
        <div
          className="alice-carousel__next-btn-wrapper"
          onMouseEnter={this._onMouseEnterAutoPlayHandler}
          onMouseLeave={this._onMouseLeaveAutoPlayHandler}
        >
          <div className={className} onClick={this._slideNext} />
        </div>
      </div>
    );
  }

  /**
   * calculate active dot navigation index
   * @returns {number}
   */
  _getActiveSlideIndex = () => {
    let { slides, items, currentIndex } = this.state;
    const { inactiveNext } = this._isInactiveItem();

    currentIndex = currentIndex + items;

    const slidesLength = slides.length;
    const dotsLength = slidesLength % items === 0
      ? Math.floor(slidesLength / items) - 1
      : Math.floor(slidesLength / items);

    if (items === 1) {
      if (currentIndex < items) {
        return slidesLength - items;
      }
      else if (currentIndex > slidesLength) {
        return 0;
      }
      else {
        return currentIndex - 1;
      }
    } else {
      if (currentIndex === slidesLength + items) {
        return 0;
      }
      else if (inactiveNext || currentIndex < items && currentIndex !== 0) {
        return dotsLength;
      }
      else if (currentIndex === 0) {
        return slidesLength % items === 0 ? dotsLength : dotsLength - 1;
      }
      else {
        return Math.floor(currentIndex / items) - 1;
      }
    }
  }

  /**
   * set additional animation props
   * @param itemIndex {number}
   */
  _setAnimationPropsOnDotsClick = itemIndex => {
    let fadeOutOffset;
    const { currentIndex, itemWidth } = this.state;
    const fadeOutIndex = currentIndex + 1;

    if (itemIndex < currentIndex) {
      fadeOutOffset = (currentIndex - itemIndex) * -itemWidth;
    } else {
      fadeOutOffset = (itemIndex - currentIndex) * itemWidth;
    }

    this._setAnimationProps({ fadeOutIndex, fadeOutOffset, allowFadeOutAnimation: true });
  }

  /**
   * call external method
   * @param itemIndex {number}
   */
  _onDotClick = itemIndex => {
    if (this.state.currentIndex === itemIndex
      || !this.allowAnimation
      || this.swipeAnimation) {
      return;
    }

    this._disableAnimation();

    if (this._allowFadeOutAnimation()) {
      this._setAnimationPropsOnDotsClick(itemIndex);
    }

    this._slideToItem(itemIndex);
  }

  /**
   * create markdown for dots navigation
   * @returns {XML}
   */
  _renderDotsNavigation() {
    const { slides, items } = this.state;
    const isNotInfinite = this.props.infinite === false;
    const dotsLength = Math.ceil(slides.length / items);

    return (
      <ul className="alice-carousel__dots">
        {
          slides.map((item, i) => {
            if (i < dotsLength) {
              const itemIndex = isNotInfinite && i === dotsLength - 1 ? slides.length - items : i * items;

              return <li
                key={i}
                onClick={() => this._onDotClick(itemIndex)}
                onMouseEnter={this._onMouseEnterAutoPlayHandler}
                onMouseLeave={this._onMouseLeaveAutoPlayHandler}
                className={`alice-carousel__dots-item${ this._getActiveSlideIndex() === i ? ' __active' : '' }`}
              />;
            }
          })
        }
      </ul>
    );
  }

  /**
   * create markdown for play/pause button
   * @returns {XML}
   */
  _renderPlayPauseButton() {
    return (
      <div className="alice-carousel__play-btn" onClick={() => this._playPauseToggle()}>
        <div className="alice-carousel__play-btn-wrapper">
          <div className={`alice-carousel__play-btn-item${this.state.isPlaying ? ' __pause' : ''}`} />
        </div>
      </div>
    );
  }

  /**
   * set auto-play interval
   */
  _play() {
    const { duration } = this.state;
    const { autoPlayDirection, autoPlayInterval } = this.props;
    const playInterval = Math.max(autoPlayInterval || duration, duration);

    this.setState({ isPlaying: true });

    if (!this._autoPlayIntervalId) {
      this._autoPlayIntervalId = window.setInterval(() => {
        if (!this._isHovered() && this._autoPlayIntervalId) { // check interval if force click

          //if (!this.allowAnimation) return;
          autoPlayDirection === 'rtl' ? this._slidePrev(false) : this._slideNext(false);
        }
      }, playInterval);
    }
  }

  /**
   * clear auto-play interval
   */
  _pause() {
    if (this._autoPlayIntervalId) {
      window.clearInterval(this._autoPlayIntervalId);
      this._autoPlayIntervalId = null;
      this.setState({ isPlaying: false });
    }
  }

  /**
   * call play/pause methods
   */
  _playPauseToggle () {
    if (!this.allowAnimation) return;
    this.state.isPlaying ? this._pause() : this._play();
  }

  /**
   * call external methods
   * @param {Event} e
   */
  _keyUpHandler = (e) => {
    switch(e.keyCode) {
    case 32:
      this._playPauseToggle();
      break;
    case 37:
      this._slidePrev();
      break;
    case 39:
      this._slideNext();
      break;
    }
  }

  /**
   * set props for fadeout animation if it is needed
   *
   * @param duration
   * @return {object}
   */
  _intermediateStateProps = (duration) => {
    return this._allowFadeOutAnimation()
      ? { fadeOutAnimation: true,  style: { transition: 'transform 0ms ease-out' }}
      : { style: { transition: `transform ${duration}ms ease-out` }};
  }

  /**
   * set new props to the state
   *
   * @param {number} index
   * @param {bool} skip
   * @param {number} duration
   */
  _slideToItem(index, skip, duration = this.state.duration) {
    this._onSlideChange();
    const { items, itemWidth } = this.state;
    const translate = (index + items) * itemWidth;

    this.setState({
      currentIndex: index,
      translate3d: -translate,
      ...this._intermediateStateProps(duration),
    }, () => this._checkRecalculation(skip));
  }

  /**
   * check if fadeout animation is allowed
   * @return {Boolean|boolean}
   */
  _allowFadeOutAnimation = () => {
    return (this.props.fadeOutAnimation && this.state.items === 1);
  }

  /**
   * check if swipe action is allowed
   * @return {Boolean|boolean}
   */
  _isSwipeDisable = () => {
    return (this.props.swipeDisabled || this.state.fadeOutAnimation);
  }

  /**
   * add event to the touch events callstack
   */
  _addTouchEventToCallstack = () => {
    this.touchEventsCallstack
      ? this.touchEventsCallstack.push(1)
      : this.touchEventsCallstack = [];
  }

  /**
   * set flag on swipe animation start
   */
  _startSwipeAnimation = () => {
    this.swipeAnimation = true;
  }

  /**
   * reset swipe animation props, reset touch events callstack
   */
  _stopSwipeAnimation = () => {
    this.swipeAnimation = false;
    this.touchEventsCallstack = null;
    this._resetSwipePositionProps();
  }

  /**
   * assign new props for animation object
   * @param newProps
   */
  _setAnimationProps = (newProps) => {
    let prevProps = this.animationProps || {};
    this.animationProps = { ...prevProps, ...newProps };
  }

  /**
   * reset animation props object
   */
  _resetAnimationProps = () => {
    this.animationProps = {};
  }

  /**
   * assign new props for swipe position
   * @param newProps
   */
  _setSwipePositionProps = (newProps) => {
    const prevProps = this.swipePosition || {};
    this.swipePosition = { ...prevProps, ...newProps };
  }

  /**
   * reset swipe position object
   */
  _resetSwipePositionProps = () => {
    this.swipePosition = {};
  }

  /**
   * calculate swipePosition on touchEvent start
   */
  _onTouchMove() {
    this._pause();

    if (this._isSwipeDisable()) {
      return;
    }

    this._disableAnimation();
    this._startSwipeAnimation();

    const { slides, items, itemWidth, translate3d } = this.state;

    const maxPosition = (slides.length + items) * itemWidth;
    const direction = arguments[1] > 0 ? 'LEFT' : 'RIGHT';
    const startPosition = this.swipePosition.startPosition || translate3d;

    let position = startPosition - arguments[1];

    if (this.props.infinite === false) {

      const slideOffset = Math.min(itemWidth / 2, 250);
      const leftTranslate = items * -itemWidth + slideOffset;
      const rightTranslate = slides.length * -itemWidth - slideOffset;

      if (position > leftTranslate || position < rightTranslate) {
        return;
      }
    }

    if (position >= 0 || Math.abs(position) >= maxPosition) {
      recalculatePosition();
    }

    setTransformAnimation(this.stageComponent, position);
    this._setSwipePositionProps({ position, direction, startPosition });

    function recalculatePosition() {
      direction === 'RIGHT'
        ? position += -slides.length * itemWidth
        : position += maxPosition - items * itemWidth;

      if (position >= 0 || Math.abs(position) >= maxPosition) {
        recalculatePosition();
      }
    }
  }

  /**
   * set transformations before touchEvent end if infinite property is false
   *
   * @param swipeIndex
   * @param currentIndex
   * @param position
   */
  _isInfiniteModeDisabledBeforeTouchEnd(swipeIndex, currentIndex, position) {
    const { items, itemWidth, duration, slides } = this.state;

    if (swipeIndex < items) {
      currentIndex = 0;
      position = items * itemWidth;
    }

    if (swipeIndex > slides.length) {
      currentIndex = slides.length - items;
      position = slides.length * itemWidth;
    }

    setTransformAnimation(this.stageComponent, -position, duration);

    setTimeout(() => {

      if (this.touchEventsCallstack.length) {
        this.touchEventsCallstack.pop();
        return;
      }

      setTransformAnimation(this.stageComponent, -position, 0);
      this._slideToItem(currentIndex, true, 0);
    }, duration);
  }

  /**
   * check if index  will be changed
   * @param index
   * @param length
   * @return {number}
   */
  _checkNextItemIndex = (index, length) => {
    if (index === length) { return 0; }
    if (index < 0) { return length + index; }
    return index;
  }

  /**
   * set transformations before touchEvent end
   */
  _beforeTouchEnd() {
    const { itemWidth, items, slides, duration } = this.state;
    const swipePosition = Math.abs(this.swipePosition.position);

    let swipeIndex = this.swipePosition.direction === 'LEFT'
      ? Math.floor(swipePosition / itemWidth) + 1
      : Math.floor(swipePosition / itemWidth);

    let itemIndex = swipeIndex - items;
    let position = itemWidth * (itemIndex + items);
    const transformPosition = -swipeIndex * itemWidth;

    if (this.props.infinite === false) {
      this._isInfiniteModeDisabledBeforeTouchEnd(swipeIndex, itemIndex, position);
      return;
    }

    setTransformAnimation(this.stageComponent, transformPosition, duration);

    setTimeout(() => {

      if (this.touchEventsCallstack.length) {
        this.touchEventsCallstack.pop();
        return;
      }
      const nextItemIndex = this._checkNextItemIndex(itemIndex, slides.length);

      setTransformAnimation(this.stageComponent, transformPosition, 0);
      this._slideToItem(nextItemIndex, true, 0);
    }, duration);
  }

  /**
   * called on touchEvent end
   */
  _onTouchEnd = () => {
    if (this._isSwipeDisable()) {
      return;
    }

    const startPosition = this.swipePosition.position;

    this._setSwipePositionProps({ startPosition });
    this._addTouchEventToCallstack();
    this._beforeTouchEnd();
  }

  /**
   * called on mouseEnter event for parent carousel node   *
   * @return {bool}
   */
  _onMouseEnterAutoPlayHandler = () => this.isHovered = true;

  /**
   * called on mouseLeave event for parent carousel node   *
   * @return {bool}
   */
  _onMouseLeaveAutoPlayHandler = () => this.isHovered = false;

  /**
   * set additional props for fadeout animation
   * @param {string} direction
   */
  _setAnimationPropsOnPrevNextClick = (direction = 'next') => {
    const { currentIndex, itemWidth } = this.state;

    const fadeOutIndex = currentIndex === 0 ? 1 : currentIndex + 1;
    const fadeOutOffset = direction === 'next' ? itemWidth : -itemWidth;

    this._setAnimationProps({ fadeOutIndex, fadeOutOffset, allowFadeOutAnimation: true });
  }

  /**
   * call external methods
   * @param {bool} action
   */
  _slidePrev =  (action = true) => {
    if (!this.allowAnimation || this.swipeAnimation) {
      return;
    }
    this._disableAnimation();

    const { inactivePrev } = this._isInactiveItem();

    if (this._allowFadeOutAnimation()) {
      this._setAnimationPropsOnPrevNextClick('prev');
    }

    if (inactivePrev) {
      this._allowAnimation();
      this._pause();
      return;
    }

    if (action && this.props.autoPlayActionDisabled) {
      this._pause();
    }

    this._slideToItem(this.state.currentIndex - 1);
  }

  /**
   * call external methods
   * @param {bool} action
   */
  _slideNext = (action = true) => {
    if (!this.allowAnimation || this.swipeAnimation) {
      return;
    }
    this._disableAnimation();

    const { inactiveNext } = this._isInactiveItem();

    if (inactiveNext) {
      this._allowAnimation();
      this._pause();
      return;
    }

    if (action && this.props.autoPlayActionDisabled) {
      this._pause();
    }

    if (this._allowFadeOutAnimation()) {
      this._setAnimationPropsOnPrevNextClick();
    }

    this._slideToItem(this.state.currentIndex + 1);
  }

  /**
   * check if item is active
   * @param i
   * @return {boolean}
   */
  _isActiveItem = (i) => {
    const { currentIndex, items } = this.state;
    return currentIndex + items === i;
  }

  /**
   * check if item is clone
   * @param i
   * @return {boolean}
   */
  _isClonedItem = (i) => {
    const { items, slides } = this.state;
    return this.props.infinite === false && (i < items || i > slides.length + items - 1);
  }

  /**
   * check whether an item to be animated
   * @param i
   * @return {*|boolean}
   */
  _isAnimatedItem = (i) => {
    const { allowFadeOutAnimation, fadeOutIndex } = this.animationProps;
    return allowFadeOutAnimation && fadeOutIndex === i;
  }

  /**
   * generate item styles
   * @param i
   * @return {object}
   */
  _setItemStyles = (i) => {
    const { itemWidth, duration } = this.state;
    const { fadeOutOffset } = this.animationProps;

    return !this._isAnimatedItem(i)
      ? { width: `${itemWidth}px` }
      : { transform: `translateX(${fadeOutOffset}px)`, animationDuration: `${duration}ms`, width: `${itemWidth}px` };
  }

  /**
   * concat item class names
   * @param i
   * @return {string}
   */
  _setItemClassName = (i) => {
    const isActive = this._isActiveItem(i) ? ' __active' : '';
    const isCloned =  this._isClonedItem(i) ? ' __cloned' : '';
    const isAnimated = this._isAnimatedItem(i) ? ' animated animated-out fadeOut' : '';

    return 'alice-carousel__stage-item' + isActive + isCloned + isAnimated;
  }

  /**
   * wrap carousel child nodes
   * @param {object} item
   * @param {number} i
   * @return {XML}
   */
  _renderStageItem = (item, i) => {
    const itemStyle = this._setItemStyles(i);
    const itemClassName = this._setItemClassName(i);

    return <li style={itemStyle} className={itemClassName} key={i}>{ item }</li>;
  }

  render() {
    const { style, translate3d, clones, slides } = this.state;
    const stageStyle = { ...style, ...{ transform: `translate3d(${translate3d}px, 0, 0)` }};
    const items = clones || slides;


    return (
      <div className="alice-carousel">
        <Swipeable
          onSwiping={this._onTouchMove}
          onSwiped={this._onTouchEnd}
          trackMouse={this.props.mouseDragEnabled}
        >
          <div
            className="alice-carousel__wrapper"
            onMouseEnter={this._onMouseEnterAutoPlayHandler}
            onMouseLeave={this._onMouseLeaveAutoPlayHandler}
          >
            <ul style={stageStyle} className="alice-carousel__stage" ref={this._getStageComponentNode}>
              { items.map(this._renderStageItem) }
            </ul>
          </div>
        </Swipeable>

        { !this.props.buttonsDisabled ? this._prevButton() : null }
        { !this.props.buttonsDisabled ? this._nextButton() : null }
        { !this.props.dotsDisabled ? this._renderDotsNavigation() : null }
        { this.props.playButtonEnabled ? this._renderPlayPauseButton() : null }

      </div>
    );
  }
}

AliceCarousel.propTypes = {
  children: PropTypes.array.isRequired,
  onSlideChange: PropTypes.func,
  onSlideChanged: PropTypes.func,
  keysControlDisabled: PropTypes.bool,
  playButtonEnabled: PropTypes.bool,
  buttonsDisabled: PropTypes.bool,
  dotsDisabled: PropTypes.bool,
  swipeDisabled: PropTypes.bool,
  responsive: PropTypes.object,
  duration: PropTypes.number,
  startIndex: PropTypes.number,
  slideToIndex: PropTypes.number,
  autoPlay: PropTypes.bool,
  infinite: PropTypes.bool,
  mouseDragEnabled: PropTypes.bool,
  fadeOutAnimation: PropTypes.bool,
  autoPlayInterval: PropTypes.number,
  autoPlayDirection: PropTypes.string,
  autoPlayActionDisabled: PropTypes.bool
};

AliceCarousel.defaultProps = {
  children: [],
  responsive: {},
  duration: 250,
  startIndex: 0,
  slideToIndex: 0,
  autoPlay: false,
  infinite: true,
  dotsDisabled: false,
  swipeDisabled: false,
  autoPlayInterval: 250,
  buttonsDisabled: false,
  mouseDragEnabled: false,
  fadeOutAnimation: false,
  playButtonEnabled: false,
  autoPlayDirection: 'ltr',
  keysControlDisabled: false,
  autoPlayActionDisabled: false
};
