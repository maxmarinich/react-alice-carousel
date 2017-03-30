import React from 'react';
import isEqual from 'lodash.isequal';
import Swipeable from 'react-swipeable';
import { setTransformAnimation } from './common';

// TODO autoPlay : add button
// TODO limit items in the slide

class AliceCarousel extends React.Component {
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
        if (!isEqual(this.props.children, nextProps.children)) {
            this.setState({
                slides: nextProps.children,
                clones: this._cloneSlides(nextProps.children)
            });
        }

        if (!isEqual(this.props.responsive, nextProps.responsive)) {
            this.setState(this._calculateInitialProps(nextProps.responsive));
        }

        if (this.props.keysControlDisabled !== nextProps.keysControlDisabled) {
            nextProps.keysControlDisabled === true
                ? window.removeEventListener('keyup', this._keyUpHandler)
                : window.addEventListener('keyup', this._keyUpHandler);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.autoPlayActionDisabled !== prevProps.autoPlayActionDisabled ||
            this.props.autoPlayDirection !== prevProps.autoPlayDirection ||
            this.props.autoPlayInterval !== prevProps.autoPlayInterval ||
            this.props.autoPlay !== prevProps.autoPlay) {
            this._pause();
            this._resizeHandler();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resizeHandler);

        if (!this.props.keysControlDisabled) {
            window.removeEventListener('keyup', this._keyUpHandler);
        }
    }

    _play() {
        const { autoPlayDirection, autoPlayInterval } = this.props;
        const playInterval = typeof autoPlayInterval === 'number'
            ? Math.max(autoPlayInterval, this._getDuration())
            : this._getDuration();

        if (!this._autoPlayIntervalId) {
            this._autoPlayIntervalId = window.setInterval(() => {

                if (this.autoPlayActionDisabled) { // disabled autoPlay
                    this._pause();
                }

                if (!this._isHovered()) {
                    if (!this.allowAnimation) return;
                    autoPlayDirection === 'ltr' ? this._slidePrev(false) : this._slideNext(false);
                }
            }, playInterval);
        }
    }

    _pause() {
        if (this._autoPlayIntervalId) {
            window.clearInterval(this._autoPlayIntervalId);
            this._autoPlayIntervalId = null;
        }
    }

    _isHovered() { return this.isHovered; }

    _cloneSlides(children, itemsInSlide) {
        const slides = children || this.props.children;
        const items = itemsInSlide || this._setTotalItemsInSlide();
        const first = slides.slice(0, items);
        const last = slides.slice(slides.length - items);

        return last.concat(slides, first);
    }

    _calculateInitialProps(totalItems) {
        const items = this._setTotalItemsInSlide(totalItems);
        const itemWidth = this.stageComponent.getBoundingClientRect().width / items;

        return {
            items,
            itemWidth,
            currentIndex: items,
            clones: this._cloneSlides(null, items),
            slides: this.props.children || [],
            translate3d: -itemWidth * items
        };
    }

    _setInitialState() {
        this.setState(this._calculateInitialProps());
    }

    _getStageComponentNode(node) { this.stageComponent = node; }

    _getDuration() { return this.props.duration || 250; }

    _allowAnimation() { this.allowAnimation = true; }

    _disableAnimation() { this.allowAnimation = false; }

    _resizeHandler() {
        this._setInitialState();

        if (this.props.onSlideChange) {
            this.props.onSlideChange(this._getActiveSlideIndex());
        }

        if (this.props.autoPlay){ // reset autoPlay
            this.autoPlayActionDisabled = false;
            this._play();
        }
    }

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
            <div className="alice-carousel-prev">
                <div className="alice-carousel-prev__btn-wrapper">
                    <div className="alice-carousel-prev__btn"
                         onClick={this._slidePrev}
                         onMouseEnter={this._onMouseEnterAutoPlayHandler}
                         onMouseLeave={this._onMouseLeaveAutoPlayHandler}
                    />
                </div>
            </div>
        );
    }

    _nextButton() {
        return(
            <div className="alice-carousel-next">
                <div className="alice-carousel-next__btn-wrapper"
                     onClick={this._slideNext}
                     onMouseEnter={this._onMouseEnterAutoPlayHandler}
                     onMouseLeave={this._onMouseLeaveAutoPlayHandler}
                >
                    <div className="alice-carousel-next__btn" />
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
                return Math.floor(currentIndex / items) -1;
            }
        }
    }

    _renderDotsNavigation() {
        const { slides, items } = this.state;

        return(
            <ul className="alice-carousel-dots">
                {
                    slides.map((item, i) => {
                        if (i < slides.length / items) {
                            return <li
                                key={i}
                                onClick={() => this._slideToItem(i + 1)}
                                onMouseEnter={this._onMouseEnterAutoPlayHandler}
                                onMouseLeave={this._onMouseLeaveAutoPlayHandler}
                                className={`alice-carousel-dots__item${ this._getActiveSlideIndex() === i ? ' __active' : '' }`}
                            />;
                        }
                    })
                }
            </ul>
        );
    }

    _setTotalItemsInSlide(totalItems) {
        let items = 1;
        const width = window.innerWidth;

        if (this.props.responsive) {
            const responsive = totalItems || this.props.responsive || {};

            if (Object.keys(responsive).length) {
                Object.keys(responsive).forEach((key) => {
                    if (key < width) items = Math.abs(responsive[key].items) || items;
                });
            }
        }
        return items;
    }

    _keyUpHandler(e) {
        if (!this.allowAnimation) return;

        switch(e.keyCode) {
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
            this.autoPlayActionDisabled = true;
        }

        const { currentIndex, items }  = this.state;
        this._slideToItem((currentIndex - 1) / items);
    }

    _slideNext(action = true) {
        if (action && this.props.autoPlayActionDisabled) {
            this.autoPlayActionDisabled = true;
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
        this.isHovered = true;
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

    _onMouseEnterAutoPlayHandler() {
        this.isHovered = true;
    }

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
                    <div className="alice-carousel-wrapper"
                         onMouseEnter={this._onMouseEnterAutoPlayHandler}
                         onMouseLeave={this._onMouseLeaveAutoPlayHandler}
                    >
                        <ul className="alice-carousel-stage" ref={this._getStageComponentNode} style={style} >
                            {
                                slides.map((item, i) => (
                                    <li
                                        className="alice-carousel-stage__item" key={i}
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

            </div>
        );
    }
}

AliceCarousel.propTypes = {
    children: React.PropTypes.array.isRequired,
    onSlideChange: React.PropTypes.func,
    keysControlDisabled: React.PropTypes.bool,
    buttonsDisabled: React.PropTypes.bool,
    dotsDisabled: React.PropTypes.bool,
    swipeDisabled: React.PropTypes.bool,
    responsive: React.PropTypes.object,
    duration: React.PropTypes.number,
    autoPlay: React.PropTypes.bool,
    autoPlayInterval: React.PropTypes.number,
    autoPlayDirection: React.PropTypes.string,
    autoPlayActionDisabled: React.PropTypes.bool
};

export default AliceCarousel;
