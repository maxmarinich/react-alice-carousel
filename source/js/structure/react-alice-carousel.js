import React from 'react';
import Swipeable from 'react-swipeable';
import PropTypes from 'prop-types';
import { setTransformAnimation } from './common';


class AliceCarousel extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            slides: [],
            currentIndex: 1,
            style: {
                transition: 'transform 0ms ease-out' }
        };

        this._slideNext = this._slideNext.bind(this);
        this._slidePrev = this._slidePrev.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._resizeHandler = this._resizeHandler.bind(this);
        this._keyUpHandler = this._keyUpHandler.bind(this);
        this._disableAnimation = this._disableAnimation.bind(this);
        this._allowAnimation = this._allowAnimation.bind(this);
        this._getActiveSlideIndex = this._getActiveSlideIndex.bind(this);
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
        if (this.props.children !== nextProps.children ||
            this.props.responsive !== nextProps.responsive ||
            this.props.startIndex !== nextProps.startIndex ) {
            this.setState(this._calculateInitialProps(nextProps));
        }

        if (this.props.keysControlDisabled !== nextProps.keysControlDisabled) {
            nextProps.keysControlDisabled === true
                ? window.removeEventListener('keyup', this._keyUpHandler)
                : window.addEventListener('keyup', this._keyUpHandler);
        }

        if (this.props.autoPlayActionDisabled !== nextProps.autoPlayActionDisabled ||
            this.props.autoPlayDirection !== nextProps.autoPlayDirection ||
            this.props.autoPlayInterval !== nextProps.autoPlayInterval ||
            this.props.autoPlay !== nextProps.autoPlay) {
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

    _cloneSlides(children, itemsInSlide) {
        const first = children.slice(0, itemsInSlide);
        const last = children.slice(children.length - itemsInSlide);

        return last.concat(children, first);
    }

    _setStartIndex(itemsInSlide, index) {
        const { children } = this.props;
        const maxValue = Math.ceil(children.length / itemsInSlide);

        return Math.min(index, maxValue) * itemsInSlide;
    }

    _calculateInitialProps(nextProps) {
        let totalItems;
        let  { startIndex, children } = this.props;

        if (nextProps) {
            totalItems = nextProps.responsive;
            startIndex = nextProps.startIndex;
            children =  nextProps.children;
        }
        startIndex = startIndex ? Math.abs(Math.ceil(startIndex)) : 0;

        const items = this._setTotalItemsInSlide(totalItems, children);
        const currentIndex = this._setStartIndex(items, startIndex + 1);
        const itemWidth = this.stageComponent.getBoundingClientRect().width / items;

        return {
            items,
            itemWidth,
            currentIndex,
            slides: children,
            translate3d: -itemWidth * currentIndex,
            clones: this._cloneSlides(children, items)
        };
    }

    _setTotalItemsInSlide(totalItems, children) {
        let items = 1;
        const width = window.innerWidth;

        if (this.props.responsive) {
            const responsive = totalItems || this.props.responsive || {};

            if (Object.keys(responsive).length) {
                Object.keys(responsive).forEach((key) => {
                    if (key < width) items = Math.min(responsive[key].items, children.length) || items;
                });
            }
        }
        return items;
    }

    _setInitialState() {
        this.setState(this._calculateInitialProps());
    }

    _resizeHandler() {
        this._setInitialState();
    }

    _getStageComponentNode(node) { this.stageComponent = node; }

    _getDuration() { return this.props.duration || 250; }

    _allowAnimation() { this.allowAnimation = true; }

    _disableAnimation() { this.allowAnimation = false; }

    _isHovered() { return this.isHovered; }

    _checkRecalculation() {
        const { items, slides, currentIndex } = this.state;
        const recalculate = (currentIndex === 0 || currentIndex === slides.length + items);

        recalculate ? this._recalculateSlidePosition() : this._onSlideChange();
    }

    _recalculateSlidePosition() {
        const { items, itemWidth, slides, currentIndex } = this.state;

        this.setState({
            currentIndex: (currentIndex === 0) ? slides.length : items,
            translate3d: -itemWidth * (currentIndex === 0 ? slides.length : items),
            style: {transition: 'transform 0ms ease-out'}
        }, () => this._onSlideChange());
    }

    _onSlideChange() {
        if (this.props.onSlideChange) {
            this.props.onSlideChange(this._getActiveSlideIndex());
        }
        this._allowAnimation();
    }

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

    _getActiveSlideIndex() {
        const { slides, items, currentIndex } = this.state;
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

    _renderDotsNavigation() {
        const { slides, items } = this.state;

        return(
            <ul className="alice-carousel__dots">
                {
                    slides.map((item, i) => {
                        if (i < slides.length / items) {
                            return <li
                                key={i}
                                onClick={() => this._slideToItem(i + 1)}
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

    _renderPlayPauseButton() {
        return(
            <div className="alice-carousel__play-btn" onClick={() => this._playPauseToggle()}>
                <div className="alice-carousel__play-btn-wrapper">
                    <div className={`alice-carousel__play-btn-item${this.state.isPlaying ? ' __pause' : ''}`} />
                </div>
            </div>
        );
    }

    _play() {
        const { autoPlayDirection, autoPlayInterval } = this.props;
        const playInterval = typeof autoPlayInterval === 'number'
            ? Math.max(autoPlayInterval, this._getDuration())
            : this._getDuration();

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

    _pause() {
        if (this._autoPlayIntervalId) {
            window.clearInterval(this._autoPlayIntervalId);
            this._autoPlayIntervalId = null;
            this.setState({isPlaying: false});
        }
    }

    _playPauseToggle () {
        this.state.isPlaying ? this._pause() : this._play();
    }

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

    _slidePrev(action = true) {
        if (action && this.props.autoPlayActionDisabled) {
            this._pause();
        }

        const { currentIndex, items }  = this.state;
        this._slideToItem((currentIndex - 1) / items);
    }

    _slideNext(action = true) {
        if (action && this.props.autoPlayActionDisabled) {
            this._pause();
        }

        const { currentIndex, items }  = this.state;
        this._slideToItem((currentIndex + 1) / items);
    }

    _slideToItem(index, position) {
        if (!this.allowAnimation) return;
        this._disableAnimation();

        const { items, itemWidth } = this.state;
        const translate = position || index * items * itemWidth;
        const duration = this._getDuration();
        const currentIndex = index * items;

        this.setState({
            currentIndex,
            translate3d: -translate,
            style: { transition: `transform ${duration}ms ease-out` }
        }, () => window.setTimeout(() => this._checkRecalculation(), duration));
    }

    _onTouchMove() {
        this._onMouseEnterAutoPlayHandler();
        if (this.props.swipeDisabled) return;

        const { slides, items, itemWidth, translate3d } = this.state;
        const maxPosition = (slides.length + items) * itemWidth;
        const direction = arguments[1] > 0 ? 'LEFT' : 'RIGHT';
        let position = translate3d - arguments[1];

        if (position >= 0 || Math.abs(position) >= maxPosition) {
            recalculatePosition();
        }

        setTransformAnimation(this.stageComponent, position, 0);
        this.swipePosition = { position, direction };

        function recalculatePosition() {
            direction === 'RIGHT'
                ? position += - slides.length * itemWidth
                : position += maxPosition - items * itemWidth;

            if (position >= 0 || Math.abs(position) >= maxPosition) {
                recalculatePosition();
            }
        }
    }

    _onTouchEnd() {
        if (this.props.swipeDisabled) return;
        this._onMouseLeaveAutoPlayHandler();
        this._allowAnimation();

        const { itemWidth, items} = this.state;
        const swipePosition = Math.abs(this.swipePosition.position);
        const currentIndex = this.swipePosition.direction === 'LEFT'
            ? Math.floor(swipePosition / itemWidth) + 1
            : Math.floor(swipePosition / itemWidth);

        const position = currentIndex * itemWidth;

        setTransformAnimation(this.stageComponent, -position, this._getDuration());
        this._slideToItem(currentIndex / items, position);
    }

    _onMouseEnterAutoPlayHandler() { this.isHovered = true; }

    _onMouseLeaveAutoPlayHandler() { this.isHovered = false; }

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
                        <ul className="alice-carousel__stage" ref={this._getStageComponentNode} style={style} >
                            {
                                slides.map((item, i) => (
                                    <li
                                        className="alice-carousel__stage-item" key={i}
                                        style={{width: `${this.state.itemWidth}px`}}
                                    >
                                        { item }
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
    keysControlDisabled: PropTypes.bool,
    playButtonDisabled: PropTypes.bool,
    buttonsDisabled: PropTypes.bool,
    dotsDisabled: PropTypes.bool,
    swipeDisabled: PropTypes.bool,
    responsive: PropTypes.object,
    duration: PropTypes.number,
    startIndex: PropTypes.number,
    autoPlay: PropTypes.bool,
    autoPlayInterval: PropTypes.number,
    autoPlayDirection: PropTypes.string,
    autoPlayActionDisabled: PropTypes.bool
};

export default AliceCarousel;
