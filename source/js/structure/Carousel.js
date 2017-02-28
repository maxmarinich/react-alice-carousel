import React from 'react';
import Swipeable from 'react-swipeable';


class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 1,
            slides: props.children || [],
            duration: props.duration || 250,
            style: { transition: 'transform 0ms' }
        };

        this._slideNext = this._slideNext.bind(this);
        this._slidePrev = this._slidePrev.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._resizeHandler = this._resizeHandler.bind(this);
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

    // TODO add style prefixes
    // TODO Add prop types
    // TODO Add thumbnails
    // TODO Add infinite: false
    // TODO Disable mod
    // TODO Add touch handler

    _resizeHandler() { this._setInitialState(); }

    _getStageComponent(node) { this.stageComponent = node; }

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


    _allowAnimation() { this.allowAnimation = true; }

    _getCurrentIndex() { return this.state.currentIndex; }

    _getCurrentTranslatePosition() { return +this.state.translate3d; }

    _isCircle() {
        const step = this.state.itemWidth;
        const totalItems = this.state.items;
        const len = this.state.slides.length;
        const currentIndex = this._getCurrentIndex();
        const circle = (currentIndex === 0 || currentIndex === len + totalItems);

        if ( circle ) {
            this.setState({
                currentIndex: (currentIndex === 0) ?  len: totalItems,
                translate3d: - step * ((currentIndex === 0) ?  len: totalItems),
                style: { transition: 'transform 0ms' }
            }, this._allowAnimation() );
        } else {
            this._allowAnimation();
        }
    }

    _slidePrev() {
        if (!this.allowAnimation) return;
        this.allowAnimation = false;

        const duration = this.state.duration;
        const nextIndex = this._getCurrentIndex() - 1;
        const delta = this.state.itemWidth * -nextIndex;

        this.setState({
            translate3d: +delta,
            currentIndex: nextIndex,
            style: { transition: `transform ${duration}ms ease-in-out` }
        });

        setTimeout(() => { this._isCircle(); }, duration);
    }

    _slideNext() {
        if (!this.allowAnimation) return;
        this.allowAnimation = false;

        const duration = this.state.duration;
        const nextIndex = this._getCurrentIndex() + 1;
        const delta = this.state.itemWidth * -nextIndex;

        this.setState({
            translate3d: +delta,
            currentIndex: nextIndex,
            style: { transition: `transform ${duration}ms ease-in-out` }
        });

        setTimeout(() => { this._isCircle(); }, duration);
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
            style: { transition: `transform ${this.state.duration}ms ease-in-out` }
        });
    }

    _renderDotsNavigation() {
        const slides = this.state.slides;
        const totalItems = this.state.items;
        const currentIndex = this._getCurrentIndex();

        const setActiveDot = (index) => {
            const len = slides.length;
            const dotIndex = Math.floor((currentIndex - totalItems) / totalItems);

            if (totalItems === 1) {
                if (index === dotIndex) {
                    return ' __active';
                }
                else if (index === 0 && currentIndex > len) {
                    return ' __active';
                }
                else if (index === (len - 1) && currentIndex < totalItems) {
                    return ' __active';
                }
                else {
                    return '';
                }
            }
            if (totalItems > 1) {
                if (index === dotIndex && currentIndex !== len + totalItems) {
                    return ' __active';
                }
                else if (index === 0 && currentIndex === len + totalItems) {
                    return ' __active';
                }
                else if (index === Math.floor(len / totalItems) && dotIndex < 0)  {
                    return ' __active';
                }
                else {
                    return '';
                }
            }
        };

        return(
            <ul className="carousel-dots">
                {
                    slides.map((item, i) => {
                        if (i < slides.length / totalItems) {
                            return <li
                                key={i}
                                onClick={() => this._slideToItem(i)}
                                className={`carousel-dots__item${ setActiveDot(i) }`}
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

    _onTouchMove() { // Swipeable arguments: deltaX - arguments[1], absX - arguments[3]
        const position = this._getCurrentTranslatePosition() - arguments[1];

        if (arguments[3] > (this.state.itemWidth * this.state.items)) return; 
        
        this.swipePosition = position;
        this.stageComponent.style.transition = 'transform 0ms';
        this.stageComponent.style.transform = `translate3d(${position}px, 0, 0)`;
    }

    _onTouchEnd() {

        // TODO Check if items = 1
        const position = this.swipePosition;

        const { items, itemWidth, clones } = this.state;
        console.log('swiped: ', position, items, itemWidth, clones.length);

        // this.setState({
        //     items,
        //     clones,
        //     itemWidth,
        //     showDots: true,
        //     showButtons: true,
        //     translate3d: - itemWidth * items,
        //     currentIndex: items || this.state.currentIndex
        // });

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
            <div className="carousel">
                <Swipeable onSwiping={this._onTouchMove} onSwiped={this._onTouchEnd}>
                    <div className="carousel-wrapper"   >
                        <GalleryStage stage={ this._getStageComponent } style={ style } >
                            {
                                slides.map((item, i) => (
                                    <li style={{width: `${this.state.itemWidth}px`}}
                                        className="carousel-stage__item" key={i}
                                    >
                                        { item }
                                    </li>
                                ))
                            }
                        </GalleryStage>
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

const GalleryStage = ({ stage, style, children }) => {
    return(
        <ul className="carousel-stage" ref={ stage } style={ style } >
            { children }
        </ul>
    );
};
