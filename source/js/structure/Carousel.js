import React from 'react';
import isEqual from 'lodash.isequal';
import Swipeable from 'react-swipeable';


class Carousel extends React.Component {
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
        this._keyDownHandler = this._keyDownHandler.bind(this);
        this._getStageComponentNode = this._getStageComponentNode.bind(this);
    }

    componentDidMount() {
        this._allowAnimation();
        this._setInitialState();
        window.addEventListener('resize', this._resizeHandler);

        if (!this.props.keysControlDisabled) {
            window.addEventListener('keydown', this._keyDownHandler);
        }
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
                ? window.removeEventListener('keydown', this._keyDownHandler)
                : window.addEventListener('keydown', this._keyDownHandler);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resizeHandler);

        if (!this.props.keysControlDisabled) {
            window.removeEventListener('keydown', this._keyDownHandler);
        }
    }

    // TODO Add prop types
    // TODO REFACTOR
    // TODO ADD README

    _cloneSlides(children) {
        const slides = children || this.props.children;
        const items = this._setTotalItemsInSlide();
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
            clones: this._cloneSlides(),
            slides: this.props.children || [],
            translate3d: -itemWidth * items
        };
    }

    _setInitialState() {
        this.setState(this._calculateInitialProps());
    }

    _getStageComponentNode(node) { this.stageComponent = node; }

    _getDuration() { return this.props.duration || 1000; }

    _allowAnimation() { this.allowAnimation = true; }

    _resizeHandler() { this._setInitialState(); }

    _isInfinite() {
        const { items, itemWidth, slides, currentIndex } = this.state;
        const slidesLength = slides.length;
        const circle = (currentIndex === 0 || currentIndex === slidesLength + items);

        if (circle) {
            this.setState({
                currentIndex: (currentIndex === 0) ?  slidesLength : items,
                translate3d: -itemWidth * (currentIndex === 0 ?  slidesLength : items),
                style: { transition: 'transform 0ms ease-out' }
            });
        }

        if (this.props.onSlideChange) {
            this.props.onSlideChange(this._getActiveSlideIndex());
        }
        this._allowAnimation();
    }

    _prevButton() {
        return(
            <div className="carousel-prev">
                <div className="carousel-prev__btn" onClick={this._slidePrev}/>
            </div>
        );
    }

    _nextButton() {
        return(
            <div className="carousel-next">
                <div className="carousel-next__btn" onClick={this._slideNext}/>
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
            <ul className="carousel-dots">
                {
                    slides.map((item, i) => {
                        if (i < slides.length / items) {
                            return <li
                                key={i}
                                onClick={() => this._slideToItem(i + 1)}
                                className={`carousel-dots__item${ this._getActiveSlideIndex() === i ? ' __active' : '' }`}
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

    _keyDownHandler(e) {
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

    _slidePrev() {
        const { currentIndex, items }  = this.state;
        this._slideToItem((currentIndex - 1) / items);
    }

    _slideNext() {
        const { currentIndex, items }  = this.state;
        this._slideToItem((currentIndex + 1) / items);
    }

    _slideToItem(index, position) {
        if (!this.allowAnimation) return;
        this.allowAnimation = false;

        const { items, itemWidth } = this.state;
        const duration = this._getDuration();
        const translate = position || index * items * itemWidth;
        const currentIndex = index * items;

        this.setState({
            currentIndex,
            translate3d: -translate,
            style: { transition: `transform ${duration}ms ease-out` }
        });

        setTimeout(() => this._isInfinite(), duration);
    }

    _onTouchMove() {
        if (this.props.swipeDisabled) return;

        const { slides, items, itemWidth, translate3d } = this.state;
        const maxPosition = (slides.length + items) * itemWidth;
        const direction = arguments[1] > 0 ? 'LEFT' : 'RIGHT';
        let position = translate3d - arguments[1];

        if (position >= 0 || Math.abs(position) >= maxPosition) {
            recalculatePosition();
        }

        this._setTransformAnimation(this.stageComponent, position, 0);
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

        this._setTransformAnimation(this.stageComponent, -position, this._getDuration());
        this._slideToItem(currentIndex / items, position);
    }

    _setTransformAnimation(element, position, durationMs) {
        const prefixes = ['Webkit', 'Moz', 'ms', 'O', ''];

        for (let value of prefixes) {
            element.style[value + 'Transform'] = `translate3d(${position}px, 0, 0)`;
            element.style[value + 'Transition'] = `transform ${durationMs}ms ease-out`;
        }
    }

    render() {
        const style = Object.assign(
            {},
            this.state.style,
            { transform: `translate3d(${this.state.translate3d}px, 0, 0)` }
        );
        const slides = this.state.clones || this.state.slides;

        return(
            <div
                className="carousel"
            >
                <Swipeable onSwiping={this._onTouchMove} onSwiped={this._onTouchEnd}>
                    <div className="carousel-wrapper"   >
                        <ul className="carousel-stage" ref={this._getStageComponentNode} style={style} >
                            {
                                slides.map((item, i) => (
                                    <li
                                        className="carousel-stage__item" key={i}
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

export default Carousel;
