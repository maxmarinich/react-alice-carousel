import React from 'react';
import AliceCarousel from './structure/react-alice-carousel';


export class App extends React.Component {
    constructor() {
        super();

        this.state = {
            slide: 0,
            startIndex: 1,
            activeIndex: 1

        };

        this.nextSlide = this.nextSlide.bind(this);
    }

    onSlide(currentSlideIndex) {
        console.log('currentSlide: ', currentSlideIndex);
    }

    nextSlide() {
        console.log();
        // this.setState({
        //     index: this.state.index + 1
        // });
    }

    render() {
        const responsive = {
            0: {
                items: 1
            },
            700: {
                items: 2
            },
            960: {
                items: 3
            }
        };

        const { activeIndex } = this.state;
        return (
            <div className="app">
                <button onClick={() => this.Carousel._slidePrev()}>Prev</button>
                <button onClick={() => this.Carousel._slideNext()}>Next</button>
                <h1 className="h1">React Alice Carousel</h1>
                <AliceCarousel
                    ref={ el => this.Carousel = el }
                    duration={400}
                    autoPlay={false}
                    startIndex={1}
                    slideToIndex={activeIndex}
                    responsive={responsive}
                    autoPlayInterval={100}
                    autoPlayDirection="rtl"
                    autoPlayActionDisabled={true}
                    onSlideChange={this.onSlide}
                >
                    <div className="item"><h1>1</h1></div>
                    <div className="item"><h1>2</h1></div>
                    <div className="item"><h1>3</h1></div>
                    <div className="item"><h1>4</h1></div>
                    <div className="item"><h1>5</h1></div>
                    <div className="item"><h1>6</h1></div>
                    <div className="item"><h1>7</h1></div>
                    <div className="item"><h1>8</h1></div>
                    <div className="item"><h1>9</h1></div>
                    <div className="item"><h1>10</h1></div>
                </AliceCarousel>
            </div>
        );
    }
}
