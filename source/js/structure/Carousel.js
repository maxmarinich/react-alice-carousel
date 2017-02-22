import React from 'react';


class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {},
            showDots: true,
            showButtons: true,
            children: this.props.children || []
        };
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

    render() {
        return(
            <div className="carousel">
                <div className="carousel-stage">Stage</div>

                { this.state.showButtons ? this._prevButton() : null }
                { this.state.showButtons ? this._nextButton() : null }
                { this.state.showDots ? this._renderDotsNavigation() : null }
            </div>
        );
    }
}

export default Carousel;
