import React from 'react';
import Swipeable from 'react-swipeable';
import PropTypes from 'prop-types';
import { setTransformAnimation, throttle } from './common';


class AliceCarousel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      currentIndex: 1,
      duration: props.duration || 250,
      style: {
        transition: 'transform 0ms ease-out'
      }
    };

    this._slideNext = this._slideNext.bind(this);
    this._slidePrev = this._slidePrev.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._keyUpHandler = this._keyUpHandler.bind(this);
    this._disableAnimation = this._disableAnimation.bind(this);
    this._allowAnimation = this._allowAnimation.bind(this);
    this._getActiveSlideIndex = this._getActiveSlideIndex.bind(this);
    this._resizeHandler = throttle(this._resizeHandler, 250).bind(this);
    this._getStageComponentNode = this._getStageComponentNode.bind(this);
    this._onMouseEnterAutoPlayHandler = this._onMouseEnterAutoPlayHandler.bind(this);
    this._onMouseLeaveAutoPlayHandler = this._onMouseLeaveAutoPlayHandler.bind(this);
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
      slideToIndex, duration, startIndex, keysControlDisabled,
      autoPlayActionDisabled, autoPlayDirection, autoPlayInterval, autoPlay
    } = nextProps;

    if (this.props.duration !== duration) {
      this.setState({ duration });
    }

    if (currentIndex !== slideToIndex && slideToIndex !== undefined) {
      const slideNext = slideToIndex === currentIndex + 1;
      const slidePrev = slideToIndex === currentIndex - 1;

      slideNext ?
        this._slideToItem(currentIndex + 1) : slidePrev ?
        this._slideToItem(currentIndex - 1) : this._slideToItem(slideToIndex);
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
  }

  /**
   * create clones for carousel items
   *
   * @param children
   * @param itemsInSlide
   * @returns {object}
   */
  _cloneSlides(children, itemsInSlide) {
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
  _setStartIndex(childrenLength, index) {
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
  _resizeHandler() {
    this._setInitialState();
  }

  /**
   * refers to parent carousel node
   *
   * @param {HTMLElement} node
   * */
  _getStageComponentNode(node) { this.stageComponent = node; }

  /**
   * enable carousel animation
   */
  _allowAnimation() { this.allowAnimation = true; }

  /**
   * disable carousel animation
   */
  _disableAnimation() { this.allowAnimation = false; }

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
    const { slides, currentIndex, duration } = this.state;

    window.setTimeout(() => {
      const recalculate = !skip && (currentIndex < 0 || currentIndex >= slides.length);
      recalculate ? this._recalculateSlidePosition() : this._onSlideChanged();
    }, duration);
  }

  /**
   * set new props to the state
   */
  _recalculateSlidePosition() {
    let { items, itemWidth, slides, currentIndex } = this.state;

    currentIndex = (currentIndex < 0) ? slides.length - 1 : 0;

    this.setState({
      currentIndex,
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
   * create xml element
   * @returns {XML}
   */
  _prevButton() {
    return(
      <div className="alice-carousel__prev-btn">
          <div className="alice-carousel__prev-btn-wrapper"
               onMouseEnter={this._onMouseEnterAutoPlayHandler}
               onMouseLeave={this._onMouseLeaveAutoPlayHandler}
          >
              <div className="alice-carousel__prev-btn-item"
                   onClick={this._slidePrev}
              />
          </div>
      </div>
    );
  }

  /**
   * create xml element
   * @returns {XML}
   */
  _nextButton() {
    return(
      <div className="alice-carousel__next-btn">
          <div className="alice-carousel__next-btn-wrapper"
               onMouseEnter={this._onMouseEnterAutoPlayHandler}
               onMouseLeave={this._onMouseLeaveAutoPlayHandler}
          >
              <div className="alice-carousel__next-btn-item"
                   onClick={this._slideNext}
              />
          </div>
      </div>
    );
  }

  /**
   * calculate active dot navigation index
   * @returns {number}
   */
  _getActiveSlideIndex() {
    let { slides, items, currentIndex } = this.state;
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
      else if (currentIndex < items && currentIndex !== 0) {
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
   * create markdown for dots navigation
   * @returns {XML}
   */
  _renderDotsNavigation() {
    const { slides, items } = this.state;
    return(
      <ul className="alice-carousel__dots">
        {
          slides.map((item, i) => {
            if (i < slides.length / items) {
              return <li
                key={i}
                onClick={() => this._slideToItem(i * items)}
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
    return(
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
    const playInterval = typeof autoPlayInterval === 'number'
      ? Math.max(autoPlayInterval, duration)
      : duration;

    this.setState({isPlaying: true});

    if (!this._autoPlayIntervalId) {
      this._autoPlayIntervalId = window.setInterval(() => {
        if (!this._isHovered() && this._autoPlayIntervalId) { // check interval if force click

          if (!this.allowAnimation) return;
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
      this.setState({isPlaying: false});
    }
  }

  /**
   * call play/pause methods
   */
  _playPauseToggle () {
    this.state.isPlaying ? this._pause() : this._play();
  }

  /**
   * call external methods
   * @param {Event} e
   */
  _keyUpHandler(e) {
    if (!this.allowAnimation) return;


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
   * call external methods
   * @param {bool} action
   */
  _slidePrev(action = true) {
    if (action && this.props.autoPlayActionDisabled) {
      this._pause();
    }

    this._slideToItem(this.state.currentIndex - 1);
  }

  /**
   * call external methods
   * @param {bool} action
   */
  _slideNext(action = true) {
    if (action && this.props.autoPlayActionDisabled) {
      this._pause();
    }

    this._slideToItem(this.state.currentIndex + 1);
  }

  /**
   * set new props to the state
   *
   * @param {number} index
   * @param {bool} skip
   * @param {number} duration
   */
  _slideToItem(index, skip, duration = this.state.duration) {
    if (!this.allowAnimation) return;
    this._disableAnimation();
    this._onSlideChange();
    const { items, itemWidth } = this.state;
    const translate = (index + items) * itemWidth;

    this.setState({
      currentIndex: index,
      translate3d: -translate,
      style: { transition: `transform ${duration}ms ease-out` }
    }, () => this._checkRecalculation(skip));
  }

  /**
   * calculate swipePosition on touchEvent start
   */
  _onTouchMove() {
    this._pause();
    if (this.props.swipeDisabled) return;

    const { slides, items, itemWidth, translate3d } = this.state;
    const maxPosition = (slides.length + items) * itemWidth;
    const direction = arguments[1] > 0 ? 'LEFT' : 'RIGHT';
    let position = translate3d - arguments[1];

    if (position >= 0 || Math.abs(position) >= maxPosition) {
      recalculatePosition();
    }

    setTransformAnimation(this.stageComponent, position);

    this.swipePosition = { position, direction };

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
   * set transformations before touchEvent end
   */
  _beforeTouchEnd() {
    const { itemWidth, slides, items, duration } = this.state;
    const swipePosition = Math.abs(this.swipePosition.position);

    let swipeIndex = this.swipePosition.direction === 'LEFT'
      ? Math.floor(swipePosition / itemWidth) + 1
      : Math.floor(swipePosition / itemWidth);

    const transformPosition = -swipeIndex * itemWidth;
    setTransformAnimation(this.stageComponent, transformPosition, duration);

    let currentIndex = swipeIndex - items;
    if (currentIndex === slides.length) { currentIndex = 0; }
    if (currentIndex < 0) { currentIndex = slides.length + currentIndex; }

    const position = itemWidth * (currentIndex + items); //(index + items) * itemWidth;

    setTimeout(() => {
      setTransformAnimation(this.stageComponent, -position);
      this._slideToItem(currentIndex, true, 0);
    }, duration);
  }

  /**
   * called on touchEvent end
   */
  _onTouchEnd() {
    if (this.props.swipeDisabled) return;
    this._beforeTouchEnd();
  }

  /**
   * called on mouseEnter event for parent carousel node
   */
  _onMouseEnterAutoPlayHandler() {
    this.isHovered = true;
  }

  /**
   * called on mouseLeave event for parent carousel node
   */
  _onMouseLeaveAutoPlayHandler() {
    this.isHovered = false;
  }

  render() {
    const style = Object.assign(
      {},
      this.state.style,
      { transform: `translate3d(${this.state.translate3d}px, 0, 0)` }
    );
    const slides = this.state.clones || this.state.slides;

    return(
      <div className="alice-carousel">
        <Swipeable onSwiping={this._onTouchMove} onSwiped={this._onTouchEnd}>
          <div className="alice-carousel__wrapper"
            onMouseEnter={this._onMouseEnterAutoPlayHandler}
            onMouseLeave={this._onMouseLeaveAutoPlayHandler}
          >
            <ul className="alice-carousel__stage" ref={this._getStageComponentNode} style={style}>
              {
                slides.map((item, i) => (
                  <li
                    className="alice-carousel__stage-item" key={i}
                    style={{width: `${this.state.itemWidth}px`}}
                  >
                    {item}
                  </li>
                ))
              }
            </ul>
          </div>
        </Swipeable>

        { !this.props.buttonsDisabled ? this._prevButton() : null }
        { !this.props.buttonsDisabled ? this._nextButton() : null }
        { !this.props.dotsDisabled ? this._renderDotsNavigation() : null }
        { !this.props.playButtonDisabled ? this._renderPlayPauseButton() : null }

      </div>
    );
  }
}

AliceCarousel.propTypes = {
  children: PropTypes.array.isRequired,
  onSlideChange: PropTypes.func,
  onSlideChanged: PropTypes.func,
  keysControlDisabled: PropTypes.bool,
  playButtonDisabled: PropTypes.bool,
  buttonsDisabled: PropTypes.bool,
  dotsDisabled: PropTypes.bool,
  swipeDisabled: PropTypes.bool,
  responsive: PropTypes.object,
  duration: PropTypes.number,
  startIndex: PropTypes.number,
  slideToIndex: PropTypes.number,
  autoPlay: PropTypes.bool,
  autoPlayInterval: PropTypes.number,
  autoPlayDirection: PropTypes.string,
  autoPlayActionDisabled: PropTypes.bool
};

export default AliceCarousel;
