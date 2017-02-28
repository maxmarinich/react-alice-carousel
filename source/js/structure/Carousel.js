import React from 'react';


class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 1,
            slides: props.children || [],
            duration: props.duration || 250,
            style: { transition: 'transform 0ms' }
        };

        this._getStageComponent = this._getStageComponent.bind(this);
    }

    componentDidMount() {
        this._allowAnimation();
    }

    _getStageComponent(node) {
        this.stageComponent = node;
        this._setTotalItemsInSlide();
    }

    _setInitialState(el, items) {
        const slides = this.state.slides;
        const itemWidth = el.getBoundingClientRect().width / items;


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

    _isCircle() {
        const step = this.state.itemWidth;
        const totalItems = this.state.items;
        const len = this.state.slides.length;
        const currentIndex = this.state.currentIndex;
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

        const step = this.state.itemWidth;
        const duration = this.state.duration;
        const currentIndex = this.state.currentIndex;

        let nextIndex = currentIndex - 1;
        let delta = step * -nextIndex;

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

        const step = this.state.itemWidth;
        const duration = this.state.duration;
        const currentIndex = this.state.currentIndex;

        let nextIndex = currentIndex + 1;
        let delta = step * -nextIndex;

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

    _slideToItem(index) {

        const totalItems = this.state.items; // 1
        const step = this.state.itemWidth;
        let currentIndex = (index + 1) * totalItems;

        let translate = step * (index + 1) * totalItems;

        // console.log('ind: ', index , ' curr: ', currentIndex, ' next: ', ind);

        // const slidesLength = this.state.slides.length; // 5
        // const maxStep = slidesLength * step;
        // //
        // if (translate > maxStep) {
        //     translate = maxStep;
        //     currentIndex = slidesLength;
        // }

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


        const activeDot = (index) => {
            const len = slides.length;
            const dotsLength = Math.floor(len / totalItems); // real length - 1
            const dotIndex = Math.floor((currentIndex - totalItems) / totalItems); // total dots
            console.log('ind: ', index, ' dotIndex: ', dotIndex, ' dotLength: ', dotsLength, 'slides: ', len);

            if (totalItems === 1) {
                if (index === dotIndex) {
                    return ' __active';
                }
                if (index === 0 && currentIndex > len) {
                    return ' __active';
                }
                if (index === (len - 1) && currentIndex < totalItems) {
                    return ' __active';
                }
                else {
                    return '';
                }
            }
            if (totalItems > 1) {
                if (index === dotIndex && currentIndex !== len + totalItems) { // array length
                    return ' __active';
                }
                else if (index === 0 && currentIndex === len + totalItems) {
                    return ' __active';
                }
                else if (index === dotsLength && dotIndex < 0)  {
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
                                className={`carousel-dots__item${ activeDot(i) }`}
                            />;
                        }
                    })
                }
            </ul>
        );
    }
    // set total items in slide
    _setTotalItemsInSlide() {
        new Promise(resolve => {
            let items = 2;
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
            .then(items => { this._setInitialState(this.stageComponent, items); })
            .catch((err) => console.error(`Error: ${err}`));
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
                <div className="carousel-wrapper">
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
