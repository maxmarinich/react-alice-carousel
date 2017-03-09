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
        this._getCurrentIndex = this._getCurrentIndex.bind(this);
        this._getStageComponent = this._getStageComponent.bind(this);

    }

    componentDidMount() {
        this._allowAnimation();
        this._setInitialState();
        window.addEventListener('resize', this._resizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resizeHandler);
    }

    // TODO add keys handlers
    // TODO Add prop types
    // TODO Add infinite: false
    // TODO Disable mod
    // TODO return current index of slide


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

    _resizeHandler() { this._setInitialState(); }

    _getStageComponent(node) { this.stageComponent = node; }

    _allowAnimation() { this.allowAnimation = true; }

    _getCurrentIndex() { return this.state.currentIndex; }

    _isCircle() {
        const step = this.state.itemWidth;
        const totalItems = this.state.items;
        const len = this.state.slides.length;
        const currentIndex = this.state.currentIndex;
        const circle = (currentIndex === 0 || currentIndex === len + totalItems);

        if (circle) {
            this.setState({
                currentIndex: (currentIndex === 0) ?  len: totalItems,
                translate3d: - step * ((currentIndex === 0) ?  len: totalItems),
                style: { transition: 'transform 0ms ease-out' }
            });
        }
        this.props.onSlideChange(this._getActiveSlideIndex());
        this._allowAnimation();
    }

    _slidePrev() {
        if (!this.allowAnimation) return;
        this.allowAnimation = false;
        const duration = this.state.duration;
        const nextIndex = this.state.currentIndex - 1;
        const delta = this.state.itemWidth * -nextIndex;

        this.setState({
            translate3d: +delta,
            currentIndex: nextIndex,
            style: { transition: `transform ${duration}ms ease-out` }
        });
        setTimeout(() => this._isCircle(), duration);
    }

    _slideNext() {
        if (!this.allowAnimation) return;
        this.allowAnimation = false;

        const duration = this.state.duration;
        const nextIndex = this.state.currentIndex + 1;
        const delta = this.state.itemWidth * -nextIndex;

        this.setState({
            translate3d: +delta,
            currentIndex: nextIndex,
            style: { transition: `transform ${duration}ms ease-out` }
        });
        setTimeout(() => this._isCircle(), duration);
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

    _slideToItem(index) {
        const totalItems = this.state.items;
        const currentIndex = (index + 1) * totalItems;
        const translate = this.state.itemWidth * (index + 1) * totalItems;

        this.setState({
            currentIndex,
            translate3d: - translate,
            style: { transition: `transform ${this.state.duration}ms ease-out` }
        });

    }

    _getActiveSlideIndex() {
        const { slides, items, currentIndex } = this.state;
        const slidesLength = slides.length;
        const dotIndex = Math.floor(currentIndex / items) -1;
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
                return dotIndex;
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
                                onClick={() => this._slideToItem(i)}
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

        if (this.props.conf) {
            const responsive = this.props.conf.responsive || {};

            if (Object.keys(responsive).length) {
                Object.keys(responsive).forEach((key) => {
                    if (key < width) items = responsive[key].items || items;
                });
            }
        }
        return items;
    }

    _onTouchMove() {
        if (this.props.dis) return;
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
        if (!this.allowAnimation) return;
        this.allowAnimation = false;

        const { itemWidth, duration } = this.state;
        let nextIndex = Math.floor(Math.abs(this.swipePosition.position) / itemWidth);
        nextIndex = (this.swipePosition.direction === 'LEFT') ? nextIndex + 1  : nextIndex;
        const position = -nextIndex * itemWidth;

        setTransformAnimation(this.stageComponent, position, duration);

        this.setState({
            translate3d: position,
            currentIndex: nextIndex,
            style: {
                transition: `transform ${duration}ms ease-out`,
                transform: `translate3d(${position}px, 0, 0)`
            }
        });
        setTimeout(() => { this._isCircle(); }, duration);
    }

    render() {
        const style = Object.assign(
            {},
            this.state.style,
            { transform: `translate3d(${this.state.translate3d}px, 0, 0)` }
        );
        const slides = this.state.clones || this.state.slides;
        console.log('render');

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
