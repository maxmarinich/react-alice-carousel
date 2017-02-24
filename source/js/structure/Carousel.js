import React from 'react';


class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                transition: 'transform 0ms'
            },
            items: 1,
            currentIndex: 0,
            slides: this.props.children || []
        };

        this._getGalleryStageItem = this._getGalleryStageItem.bind(this);
    }

    componentDidMount() {
        this._allowAnimation();

    }

    _getGalleryStageItem(el) {

        const totalItems = this.state.items;
        const itemWidth = el.getBoundingClientRect().width / totalItems;
        const slides = this.state.slides;

        const first = slides.slice(0, totalItems);
        const last = slides.slice(slides.length - totalItems);
        const clones = last.concat(slides, first);

        this.setState({
            clones,
            translate3d: - itemWidth * totalItems,
            currentIndex: totalItems,
            items: totalItems,
            itemWidth: itemWidth
        });
    }

    _allowAnimation() {
        this.allowAnimation = true;
    }

    _isCircle() {
        const totalItems = this.state.items;
        const step = this.state.itemWidth;
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
        const currentIndex = this.state.currentIndex;


        let nextIndex = currentIndex - 1;
        let delta = step * -nextIndex;

        this.setState({
            translate3d: +delta,
            currentIndex: nextIndex,
            style: { transition: 'transform 400ms ease-in-out' }
        });

        setTimeout(() => { this._isCircle(); }, 400);
    }

    _slideNext() {
        if (!this.allowAnimation) return;
        this.allowAnimation = false;

        const step = this.state.itemWidth;
        const currentIndex = this.state.currentIndex;

        let nextIndex = currentIndex + 1;
        let delta = step * -nextIndex;


        this.setState({
            translate3d: +delta,
            currentIndex: nextIndex,
            style: { transition: 'transform 400ms ease-in-out' }
        });

        setTimeout(() => { this._isCircle(); }, 400);
    }


    render() {
        const style = Object.assign(
            {},
            this.state.style,
            { transform: `translate3d(${this.state.translate3d}px, 0, 0)` }
        );
        const slides = this.state.clones || this.state.slides;

        return(
            <div className="carousel">
                <div className="carousel-wrapper">
                    <GalleryStage stage={ this._getGalleryStageItem } style={ style } >
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

                <div className="carousel-prev">
                    <div className="carousel-prev__btn" onClick={() => this._slidePrev()}/>
                </div>
                <div className="carousel-next">
                    <div className="carousel-next__btn" onClick={() => this._slideNext()}/>
                </div>

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
