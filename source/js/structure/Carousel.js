import React from 'react';
import Swipeable from 'react-swipeable';
import { setTransformAnimation } from './Common';


class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 1,
            slides: props.children || [],
            duration: props.duration || 250,
            style: {
                transition: 'transform 0ms ease-out' }
        };

        this._slideNext = this._slideNext.bind(this);
        this._slidePrev = this._slidePrev.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._resizeHandler = this._resizeHandler.bind(this);
        this._keyDownHandler = this._keyDownHandler.bind(this);
        this._getStageComponent = this._getStageComponent.bind(this);
    }

    componentDidMount() {
        this._allowAnimation();
        this._setInitialState();
        window.addEventListener('resize', this._resizeHandler);

        if (!this.props.disableArrows) {
            window.addEventListener('keydown', this._keyDownHandler);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resizeHandler);

        if (!this.props.disableArrows) {
            window.removeEventListener('keydown', this._keyDownHandler);
        }
    }


    // TODO Add prop types
    // TODO Add infinite: false and global checking
    // TODO REFACTOR
    // TODO ADD README

    _setInitialState() {
        const slides = this.state.slides;
        const items = this._setTotalItemsInSlide();
        const itemWidth = this.stageComponent.getBoundingClientRect().width / items;

        const first = slides.slice(0, items);
        const last = slides.slice(slides.length - items);
        const clones = last.concat(slides, first);

        this.setState({
            items,
            clones,
            showDots: true,
            showButtons: true,
            itemWidth: itemWidth,
            translate3d: - itemWidth * items,
            currentIndex: items || this.state.currentIndex
        });
    }

    _keyDownHandler(e) {
        if (e.keyCode === 37) {
            this._slidePrev();
        }
        if (e.keyCode === 39) {
            this._slideNext();
        }
    }

    _resizeHandler() { this._setInitialState(); }

    _getStageComponent(node) { this.stageComponent = node; }

    _allowAnimation() { this.allowAnimation = true; }

    _isCircle() {
        const { items, itemWidth, slides, currentIndex } = this.state;
        const slidesLength = slides.length;
        const circle = (currentIndex === 0 || currentIndex === slidesLength + items);

        if (circle) {
            this.setState({
                currentIndex: (currentIndex === 0) ?  slidesLength : items,
                translate3d: - itemWidth * ((currentIndex === 0) ?  slidesLength : items),
                style: { transition: 'transform 0ms ease-out' }
            });
        }

        if (this.props.onSlideChange) {
            this.props.onSlideChange(this._getActiveSlideIndex());
        }
        this._allowAnimation();
    }

    _slidePrev() {
        if (!this.allowAnimation) return;
        this.allowAnimation = false;

        const { currentIndex, items }  = this.state;

        this._slideToItem((currentIndex - 1) / items);
    }

    _slideNext() {
        if (!this.allowAnimation) return;
        this.allowAnimation = false;

        const { currentIndex, items }  = this.state;

        this._slideToItem((currentIndex + 1) / items);
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

    _setTotalItemsInSlide() {
        let items = 1;
        const width = window.innerWidth;

        if (this.props.responsive) {
            const responsive = this.props.responsive || {};

            if (Object.keys(responsive).length) {
                Object.keys(responsive).forEach((key) => {
                    if (key < width) items = responsive[key].items || items;
                });
            }
        }
        return items;
    }

    _onTouchMove() {
        if (this.props.swipeDisable) return;
        const { slides, items, itemWidth, translate3d } = this.state;
        const direction = arguments[1] > 0 ? 'LEFT' : 'RIGHT';
        let position = translate3d - arguments[1];

        if (direction === 'RIGHT' && position >= 0) {
            position = -slides.length * itemWidth;
            position -= arguments[1] + items * itemWidth;
            if (position >= 0) return;
        }

        if (direction === 'LEFT' && Math.abs(position) >= ((slides.length + items) * itemWidth)) {
            position = -items * itemWidth;
            position -= arguments[1] - items * itemWidth;
            if (Math.abs(position) >= items * itemWidth * 2 ) return;
        }

        setTransformAnimation(this.stageComponent, position, 0);
        this.swipePosition = { position, direction };
    }

    _onTouchEnd() {
        if (this.props.swipeDisable || !this.allowAnimation) return;
        this.allowAnimation = false;

        const { itemWidth, duration, items} = this.state;
        let currentIndex = Math.floor(Math.abs(this.swipePosition.position) / itemWidth);
        currentIndex = (this.swipePosition.direction === 'LEFT') ? currentIndex + 1  : currentIndex;
        const position = currentIndex * itemWidth;

        setTransformAnimation(this.stageComponent, -position, duration);
        this._slideToItem(currentIndex / items, position);
    }

    _slideToItem(index, position) {
        const { items, duration, itemWidth } = this.state;
        const translate = position || index * items * itemWidth;
        const currentIndex = index * items;

        this.setState({
            currentIndex,
            translate3d: -translate,
            style: { transition: `transform ${duration}ms ease-out` }
        });
        setTimeout(() => this._isCircle(), duration);
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
                        <ul className="carousel-stage" ref={ this._getStageComponent } style={ style } >
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

                { this.state.showButtons ? this._prevButton() : null }
                { this.state.showButtons ? this._nextButton() : null }
                { this.state.showDots ? this._renderDotsNavigation() : null }

            </div>
        );
    }
}

export default Carousel;
