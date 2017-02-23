import React from 'react';
import Swipeable from 'react-swipeable';


class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {},
            responsive: {},
            duration: 400,
            currentIndex: 0,
            showDots: true,
            showButtons: true,
            slides: this.props.children || []
        };

        this._resizeHandler = this._resizeHandler.bind(this);
        this._getGalleryStageItem = this._getGalleryStageItem.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this._resizeHandler, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resizeHandler, false);
    }

    // set total items in slide
    _setTotalItemsInSlide() {
        new Promise(resolve => {
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
            resolve(items);
        })
        .then(items => { this._getContainerWidth(this.stageElement, items); })
        .catch((err) => console.error(`Error: ${err}`));
    }

    _resizeHandler() { this._setTotalItemsInSlide(); }

    _getContainerWidth(element, totalItems) {
        const duration = `transform ${this.state.duration}ms ease-out`;
        const itemWidth = element.getBoundingClientRect().width / totalItems;

        this.setState({
            translate3d: 0,
            currentIndex: 0,
            items: totalItems,
            itemWidth: itemWidth,
            style: {
                transition: duration,
                OTransition: duration,
                MozTransition: duration,
                WebkitTransition: duration
            }
        });
    }

    _getGalleryStageItem(el) {
        this.stageElement = el;
        this._setTotalItemsInSlide();
    }

    _allowAnimation() { this.allowAnimation = false; }

    _getCurrentIndex() { return this.state.currentIndex; }

    _slideToItem(index) {
        const items = this.state.items;
        const step = this.state.itemWidth;
        let currentIndex = index * items;
        let translate = step * index * items;
        const slidesLength = this.state.slides.length;
        const maxStep = (slidesLength - items) * step;

        if (translate > maxStep) {
            translate = maxStep;
            currentIndex = slidesLength - items;
        }
        this.setState({
            currentIndex: 0 - currentIndex,
            translate3d: 0 - translate
        });
    }

    _slidePrev(e) {
        if (this.allowAnimation) return;
        this.allowAnimation = true;

        const items = this.state.items;
        const step = this.state.itemWidth;
        const currentIndex = this.state.currentIndex;
        let nextIndex = currentIndex - 1;
        let translate = step * nextIndex;
        const slidesLength = this.state.slides.length;

        const scrollToPosition = slidesLength - items + currentIndex;

        if(e) {
            // if (Math.abs(this.state.currentIndex) === slidesLength - items) {
            //     nextIndex = currentIndex;
            //     translate = currentIndex * step;
            // }
        } else {
            if (!scrollToPosition) {
                translate = 0;
                nextIndex = 0;
            }
        }
        this.setState({
            translate3d: translate,
            currentIndex: nextIndex
        });

        setTimeout(() => this._allowAnimation(), this.state.duration);
    }

    _slideNext(e) {
        if (this.allowAnimation) return;
        this.allowAnimation = true;

        const step  = this.state.itemWidth;
        let nextIndex = this.state.currentIndex + 1;
        const slidesLength = this.state.slides.length;

        if(e) {
            // if (nextIndex > 0) { nextIndex = 0; }
        } else {
            if (nextIndex > 0) {
                nextIndex = this.state.items - slidesLength;
            }
        }
        this.setState({
            translate3d: step * nextIndex,
            currentIndex: nextIndex

        });
        setTimeout(() => this._allowAnimation(), this.state.duration);
    }

    _prevButton() {
        return(
            <div className="carousel-prev">
                <div className="carousel-prev__btn" onClick={() => this._slidePrev()}/>
            </div>
        );
    }

    _nextButton() {
        return(
            <div className="carousel-next">
                <div className="carousel-next__btn" onClick={() => this._slideNext()}/>
            </div>
        );
    }

    _renderDotsNavigation() {
        const slides = this.state.slides;
        const totalItems = this.state.items;
        const activeDot = (index) => {
            const number = Math.floor(Math.abs(this._getCurrentIndex()) / totalItems);
            return index === number ? ' __active': '';
        };

        return(
            <ul className="carousel-dots">
                {
                    slides.map((item, i) => {
                        if (i < slides.length / totalItems) {
                            return <li
                                key={i}
                                onClick={() => this._slideToItem(i)}
                                className={`carousel-dots__item${ activeDot(i) }`}
                            />;
                        }
                    })
                }
            </ul>
        );
    }

    _swipeLeft() { }
    _swiped() { }

    render() {
        const style = Object.assign(
            {},
            this.state.style,
            { transform: `translate3d(${this.state.translate3d}px, 0, 0)` }
        );

        return(
            <div className="carousel">
                <div className="carousel-wrapper">
                    <Swipeable
                        onSwiped={this._swiped}
                        onSwiping={this._swipeLeft}
                    >
                        <GalleryStage stage={ this._getGalleryStageItem } style={ style } >
                            {
                                this.state.slides.map((item, i) => (
                                    <li style={{width: `${this.state.itemWidth}px`}}
                                        className="carousel-stage__item" key={i} >
                                        { item }
                                    </li>
                                ))
                            }
                        </GalleryStage>
                    </Swipeable>
                </div>

                { this.state.showButtons ? this._prevButton() : null }
                { this.state.showButtons ? this._nextButton() : null }
                { this.state.showDots ? this._renderDotsNavigation() : null }
            </div>
        );
    }
}

export default Carousel;

const GalleryStage = ({ stage, style, children }) => {
    return(
        <ul className="carousel-stage" ref={ stage } style={ style } >
            { children }
        </ul>
    );
};
