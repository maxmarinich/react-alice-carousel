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

    _renderDots() {

    }

    _renderButtons() {
        return(
            <div className="carousel-nav">
                <div className="carousel-nav__left" />
                <div className="carousel-nav__right" />
            </div>
        );
    }
    render() {
        return(
            <div className="carousel">
                { this.state.showDots ? this._renderDots() : null }
                { this.state.showButtons ? this._renderButtons() : null }
            </div>
        );
    }
}

export default Carousel;
