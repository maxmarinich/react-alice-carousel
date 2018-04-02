import React from 'react';
import Swipeable from 'react-swipeable';
import PropTypes from 'prop-types';
import { setTransformAnimation, primitiveEquals } from './common';

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
    window.addEventListener('resize', this._windowResizeHandler);

    if (!this.props.keysControlDisabled) {
      window.addEventListener('keyup', this._keyUpHandler);
    }

    if (this.props.autoPlay) this._play();
  }

  componentWillReceiveProps(nextProps) {
    const { currentIndex } = this.state;
    const {
      responsive, slideToIndex, duration, startIndex, keysControlDisabled, infinite,
      autoPlayActionDisabled, autoPlayDirection, autoPlayInterval, autoPlay, fadeOutAnimation
    } = nextProps;

    if (this.props.duration !== duration) {
      this.setState({ duration });
    }

    if (this.props.fadeOutAnimation !== fadeOutAnimation) {
      this.setState({ fadeOutAnimation: false }, this._resetAnimationProps);
    }

    if (slideToIndex !== this.props.slideToIndex) {
      this._onSlideToIndexChange(currentIndex, slideToIndex);
    }

    if (this.props.startIndex !== startIndex && !(slideToIndex !== this.props.slideToIndex)) {
      this._slideToItem(startIndex);
    }

    if (this.props.keysControlDisabled !== keysControlDisabled) {
      keysControlDisabled
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

    if (!primitiveEquals(responsive, this.props.responsive)) {
      this.setState(this._calculateInitialProps(nextProps));
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
    window.removeEventListener('resize', this._windowResizeHandler);

    if (!this.props.keysControlDisabled) {
      window.removeEventListener('keyup', this._keyUpHandler);
    }

    if (this._autoPlayIntervalId) {
      window.clearInterval(this._autoPlayIntervalId);
      this._autoPlayIntervalId = null;
    }
  }

  _onSlideToIndexChange = (currentIndex, slideToIndex) => {
    if (slideToIndex === currentIndex + 1) {
      this._slideNext();
    } else if (slideToIndex === currentIndex - 1) {
      this._slidePrev();
    } else {
      this._onDotClick(slideToIndex);
    }
  }

  _onInactiveItem = () => {
    this._onSlideChange();
    this._onSlideChanged();
    this._allowAnimation();
    this._pause();
  }

  _onSlideChange() {
    if (this.props.onSlideChange) {
      this.props.onSlideChange({
        item: this.state.currentIndex,
        slide: this._getActiveSlideIndex()
      });
    }
  }

  _onSlideChanged() {
    this._allowAnimation();
    if (this.props.onSlideChanged) {
      this.props.onSlideChanged({
        item: this.state.currentIndex,
        slide: this._getActiveSlideIndex()
      });
    }
  }

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

    if (this.props.autoPlayActionDisabled) {
      this._pause();
    }
    this._slideToItem(itemIndex);
  }

  _cloneCarouselItems = (children, itemsInSlide) => {
    const first = children.slice(0, itemsInSlide);
    const last = children.slice(children.length - itemsInSlide);

    return last.concat(children, first);
  }

  _setStartIndex = (childrenLength, index) => {
    const startIndex = index ? Math.abs(Math.ceil(index)) : 0;
    return Math.min(startIndex, (childrenLength - 1));
  }

  _calculateInitialProps(config) {
    const  { startIndex, children, responsive } = config;
    const items = this._setTotalItemsInSlide(responsive, children.length);
    const currentIndex = this._setStartIndex(children.length, startIndex);
    const itemWidth = this.stageComponent.getBoundingClientRect().width / items;

    return {
      items,
      itemWidth,
      currentIndex,
      slides: children,
      clones: this._cloneCarouselItems(children, items),
      translate3d: -itemWidth * (items + currentIndex)
    };
  }

  _setTotalItemsInSlide(responsiveConfig, childrenLength) {
    let items = 1;
    if (responsiveConfig) {
      const configKeys = Object.keys(responsiveConfig);

      if (configKeys.length) {
        configKeys.forEach(width => {
          if (width < window.innerWidth) {
            items = Math.min(responsiveConfig[width].items, childrenLength) || items;
          }
        });
      }
    }
    return items;
  }
  
  _setInitialState() {
    this.setState(this._calculateInitialProps(this.props));
  }

  _windowResizeHandler = () => this._setInitialState();

  _getStageComponentNode = node => this.stageComponent = node;

  _allowAnimation = () => this.allowAnimation = true;

  _disableAnimation = () => this.allowAnimation = false;

  _isHovered = () => this.isHovered;
  
  _checkSlidePosition(skip) {
    this._stopSwipeAnimation();
    this._resetAnimationProps();
    skip ? this._skipSlidePositionRecalculation() : this._updateSlidePosition();
  }

  _skipSlidePositionRecalculation = () => {
    if (this._allowFadeOutAnimation()) {
      this._resetFadeOutAnimationState();
      return;
    }
    this._onSlideChanged();
  }

  _updateSlidePosition = () => {
    window.setTimeout(() => {
      if (this._shouldRecalculatePosition()) {
        this._recalculateSlidePosition();
      } else if (this._allowFadeOutAnimation()) {
        this._resetFadeOutAnimationState();
      } else {
        this._onSlideChanged();
      }
    }, this.state.duration);
  }
  
  _shouldRecalculatePosition = () => {
    const { slides, currentIndex } = this.state;
    return (currentIndex < 0 || currentIndex >= slides.length);
  }

  _resetFadeOutAnimationState = () => {
    this.setState({ fadeOutAnimation: false }, this._onSlideChanged);
  };

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

  _isInactiveItem = () => {
    const { infinite } = this.props;
    const { slides, items, currentIndex } = this.state;

    const inactivePrev = infinite === false && currentIndex === 0;
    const inactiveNext = infinite === false && (slides.length - items === currentIndex);

    return { inactivePrev, inactiveNext };
  }

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

  _slideIndexInfo = () => {
    const { currentIndex, slides: { length }} = this.state;
    let slideIndex = currentIndex + 1;

    if (slideIndex < 1) { slideIndex = length; }
    else if (slideIndex > length) { slideIndex = 1; }

    return (
      <div className="alice-carousel__slide-info">
        <span className="alice-carousel__slide-info-item">{slideIndex}</span>
        <span className="alice-carousel__slide-info-item alice-carousel__slide-info-item--separator">/</span>
        <span className="alice-carousel__slide-info-item">{length}</span>
      </div>
    );
  }

  _getActiveSlideIndex = () => {
    let { slides, items, currentIndex } = this.state;
    const slidesLength = slides.length;
    const { inactiveNext } = this._isInactiveItem();
    const dotsLength = this._getDotsLength(slidesLength, items);

    currentIndex = currentIndex + items;

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

  _getDotsLength = (slidesLength, items) => {
    return slidesLength % items === 0
      ? Math.floor(slidesLength / items) - 1
      : Math.floor(slidesLength / items);
  }

  _setAnimationPropsOnDotsClick = itemIndex => {
    const { currentIndex } = this.state;
    const fadeOutIndex = currentIndex + 1;
    const fadeOutOffset = this._fadeOutOffset(itemIndex);

    this._setAnimationProps({ fadeOutIndex, fadeOutOffset, allowFadeOutAnimation: true });
  }

  _fadeOutOffset = itemIndex=> {
    const { currentIndex, itemWidth } = this.state;
    if (itemIndex < currentIndex) {
      return (currentIndex - itemIndex) * -itemWidth;
    } else {
      return (itemIndex - currentIndex) * itemWidth;
    }
  }

  _renderDotsNavigation() {
    const { slides, items } = this.state;
    const dotsLength = Math.ceil(slides.length / items);

    return (
      <ul className="alice-carousel__dots">
        {
          slides.map((item, i) => {
            if (i < dotsLength) {
              const itemIndex = this._getItemIndexForDotNavigation(i, dotsLength);
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

  _getItemIndexForDotNavigation = (i, dotsLength) => {
    const { slides, items } = this.state;
    const isNotInfinite = this.props.infinite === false;

    return isNotInfinite && i === dotsLength - 1 ? slides.length - items : i * items;
  }

  _renderPlayPauseButton() {
    return (
      <div className="alice-carousel__play-btn">
        <div className="alice-carousel__play-btn-wrapper" onClick={this._playPauseToggle}>
          <div className={`alice-carousel__play-btn-item${this.state.isPlaying ? ' __pause' : ''}`} />
        </div>
      </div>
    );
  }

  _play() {
    const { duration } = this.state;
    const { autoPlayDirection, autoPlayInterval } = this.props;
    const playInterval = Math.max(autoPlayInterval || duration, duration);

    this.setState({ isPlaying: true });

    if (!this._autoPlayIntervalId) {
      this._autoPlayIntervalId = window.setInterval(() => {
        if (!this._isHovered() && this._autoPlayIntervalId) {
          autoPlayDirection === 'rtl' ? this._slidePrev(false) : this._slideNext(false);
        }
      }, playInterval);
    }
  }

  _pause = () => {
    if (this._autoPlayIntervalId) {
      window.clearInterval(this._autoPlayIntervalId);
      this._autoPlayIntervalId = null;
      this.setState({ isPlaying: false });
    }
  }

  _playPauseToggle = () => {
    if (!this.allowAnimation) return;
    this.state.isPlaying ? this._pause() : this._play();
  }

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

  _intermediateStateProps = duration => {
    return this._allowFadeOutAnimation()
      ? { fadeOutAnimation: true,  style: { transition: 'transform 0ms ease-out' }}
      : { style: { transition: `transform ${duration}ms ease-out` }};
  }

  _slideToItem(index, skip, duration = this.state.duration) {
    this._onSlideChange();
    const { items, itemWidth } = this.state;
    const translate = (index + items) * itemWidth;

    this.setState({
      currentIndex: index,
      translate3d: -translate,
      ...this._intermediateStateProps(duration),
    }, () => this._checkSlidePosition(skip));
  }

  _allowFadeOutAnimation = () => {
    return (this.props.fadeOutAnimation && this.state.items === 1);
  }

  _isSwipeDisable = () => {
    return (this.props.swipeDisabled || this.state.fadeOutAnimation);
  }

  _addTouchEventToCallstack = () => {
    this.touchEventsCallstack
      ? this.touchEventsCallstack.push(1)
      : this.touchEventsCallstack = [];
  }

  _startSwipeAnimation = () => {
    this.swipeAnimation = true;
  }

  _stopSwipeAnimation = () => {
    this.swipeAnimation = false;
    this.touchEventsCallstack = null;
    this._resetSwipePositionProps();
  }

  _setAnimationProps = newProps => {
    let prevProps = this.animationProps || {};
    this.animationProps = { ...prevProps, ...newProps };
  }

  _resetAnimationProps = () => {
    this.animationProps = {};
  }

  _setSwipePositionProps = newProps => {
    const prevProps = this.swipePosition || {};
    this.swipePosition = { ...prevProps, ...newProps };
  }

  _resetSwipePositionProps = () => {
    this.swipePosition = {};
  }

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

  _checkNextItemIndex = (index, length) => {
    if (index === length) { return 0; }
    if (index < 0) { return length + index; }
    return index;
  }

  _beforeTouchEnd() {
    const { itemWidth, items, slides, duration } = this.state;
    const swipeIndex = this._calculateSwipeIndex();
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

  _calculateSwipeIndex = () => {
    const { itemWidth } = this.state;
    const swipePosition = Math.abs(this.swipePosition.position);

    return this.swipePosition.direction === 'LEFT'
      ? Math.floor(swipePosition / itemWidth) + 1
      : Math.floor(swipePosition / itemWidth);
  }

  _onTouchEnd = () => {
    if (this._isSwipeDisable()) {
      return;
    }

    const startPosition = this.swipePosition.position;

    this._setSwipePositionProps({ startPosition });
    this._addTouchEventToCallstack();
    this._beforeTouchEnd();
  }

  _onMouseEnterAutoPlayHandler = () => {
    if (this.props.stopAutoPlayOnHover) {
      this.isHovered = true;
    }
  }

  _onMouseLeaveAutoPlayHandler = () => this.isHovered = false;

  _setAnimationPropsOnPrevNextClick = (direction = 'next') => {
    const { currentIndex, itemWidth } = this.state;

    const fadeOutIndex = currentIndex === 0 ? 1 : currentIndex + 1;
    const fadeOutOffset = direction === 'next' ? itemWidth : -itemWidth;

    this._setAnimationProps({ fadeOutIndex, fadeOutOffset, allowFadeOutAnimation: true });
  }

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
      this._onInactiveItem();
      return;
    }

    if (action && this.props.autoPlayActionDisabled) {
      this._pause();
    }

    this._slideToItem(this.state.currentIndex - 1);
  }

  _slideNext = (action = true) => {
    if (!this.allowAnimation || this.swipeAnimation) {
      return;
    }
    this._disableAnimation();

    const { inactiveNext } = this._isInactiveItem();

    if (inactiveNext) {
      this._onInactiveItem();
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

  _isActiveItem = (i) => {
    const { currentIndex, items } = this.state;
    return currentIndex + items === i;
  }

  _isClonedItem = (i) => {
    const { items, slides } = this.state;
    return this.props.infinite === false && (i < items || i > slides.length + items - 1);
  }

  _isAnimatedItem = (i) => {
    const { allowFadeOutAnimation, fadeOutIndex } = this.animationProps;
    return allowFadeOutAnimation && fadeOutIndex === i;
  }

  _setItemStyles = (i) => {
    const { itemWidth, duration } = this.state;
    const { fadeOutOffset } = this.animationProps;

    return !this._isAnimatedItem(i)
      ? { width: `${itemWidth}px` }
      : { transform: `translateX(${fadeOutOffset}px)`, animationDuration: `${duration}ms`, width: `${itemWidth}px` };
  }

  _setItemClassName = (i) => {
    const isActive = this._isActiveItem(i) ? ' __active' : '';
    const isCloned =  this._isClonedItem(i) ? ' __cloned' : '';
    const isAnimated = this._isAnimatedItem(i) ? ' animated animated-out fadeOut' : '';

    return 'alice-carousel__stage-item' + isActive + isCloned + isAnimated;
  }

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
        { this.props.showSlideIndex ? this._slideIndexInfo() : null }
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
  showSlideIndex: PropTypes.bool,
  mouseDragEnabled: PropTypes.bool,
  fadeOutAnimation: PropTypes.bool,
  autoPlayInterval: PropTypes.number,
  autoPlayDirection: PropTypes.string,
  autoPlayActionDisabled: PropTypes.bool,
  stopAutoPlayOnHover: PropTypes.bool
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
};
