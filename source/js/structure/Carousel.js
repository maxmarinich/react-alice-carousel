import React from 'react';


class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {},
            responsive: {},
            duration: 400,
            translate3d: 0,
            currentIndex: 0,
            showDots: true,
            showButtons: true,
            slides: this.props.children || []
        };
        this._resizeHandler = this._resizeHandler.bind(this);
        this._getGalleryStageItem = this._getGalleryStageItem.bind(this);
    }

    // set total items in slide
    _setTotalItemsInSlide(cb) {
        let items = 1;
        const width = window.innerWidth;

        if (this.props.conf) {
            const responsive = this.props.conf.responsive || {};

            if (Object.keys(responsive).length) {
                Object.keys(responsive).forEach((key) => {
                    if (key < width)
                        items = responsive[key].items || items;
                });
            }
        }
        this.setState({ items }, cb);
    }

    _resizeHandler() {
        this._setTotalItemsInSlide(() => this._getContainerWidth(this.stageElement));
    }

    _getContainerWidth(el) {
        const duration = `transform ${this.state.duration}ms ease-out`;
        const itemWidth = el.getBoundingClientRect().width / this.state.items;

        this.setState({
            translate3d: 0,
            currentIndex: 0,
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
        this._setTotalItemsInSlide(() => this._getContainerWidth(el));
    }

    _allowAnimation() { this.allowAnimation = false; }

    _getCurrentIndex() { return this.state.currentIndex; }

    _prevButton() {
        return(
            <div className="carousel-prev">
                <div className="carousel-prev__btn" />
            </div>
        );
    }

    _nextButton() {
        return(
            <div className="carousel-next">
                <div className="carousel-next__btn" />
            </div>
        );
    }

    _renderDotsNavigation() {
        return(
            <ul className="carousel-dots">
                <li className="carousel-dots__item __active" />
                <li className="carousel-dots__item" />
                <li className="carousel-dots__item" />
            </ul>
        );
    }

    render() {
        const style = Object.assign(
            {},
            this.state.style,
            { transform: `translate3d(${this.state.translate3d}px, 0, 0)` }
        );

        return(
            <div className="carousel">
                <div className="carousel-wrapper">
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
