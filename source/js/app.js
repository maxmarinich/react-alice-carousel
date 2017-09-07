import React from 'react';
import AliceCarousel from './structure/react-alice-carousel';


export class App extends React.Component {
    constructor() {
        super();
        this.state = {
            slide: 0,
            startIndex: 2,
            currentIndex: 0,
            duration: 400
        };

        this.onSlideChanged = this.onSlideChanged.bind(this);
    }

    onSlideChange(e) {
        console.log('before change: ', e);
    }

    onSlideChanged(e) {
        console.log('onSlideChanged: ', e);
        this.setState({
            currentIndex: e.currentIndex
        });
    }
    slideNext() {
        this.setState({
            currentIndex: this.state.currentIndex + 1
        });
    }

    slidePrev() {
        this.setState({
            currentIndex: this.state.currentIndex - 1
        });
    }

    slideTo(i) {
        console.log('i: ', i);
        this.setState({
            currentIndex: i,
            startIndex: i,
            duration: this.state.duration + 10
        });
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

        const { startIndex, duration, currentIndex } = this.state;
        const thumbs = [1,2,3,4,5,6,7,8];
        return (
            <div className="app">
                <button onClick={() => this.Carousel._slidePrev()}>Prev throw refs</button>
                <button onClick={() => this.Carousel._slideNext()}>Next throw refs</button>
                <button onClick={() => this.slideNext()}>Next throw state</button>
                <button onClick={() => this.slidePrev()}>Prev throw state</button>
                <h1 className="h1">React Alice Carousel</h1>

                <h3>Dots throw refs</h3>
                <ul>
                  {thumbs.map((item, i) => <li
                    key={i}
                    onClick={() => this.Carousel._slideToItem(i)}
                    className="alice-carousel__dots-item" />)
                  }
                </ul>
                <h3>Dots throw state</h3>
                <ul>
                    {thumbs.map((item, i) => <li
                      key={i}
                      onClick={() => this.slideTo(i)}
                      className="alice-carousel__dots-item" />)
                    }
                </ul>
                <AliceCarousel
                    ref={ el => this.Carousel = el }
                    duration={duration}
                    autoPlay={false}
                    startIndex={startIndex}
                    slideToIndex={currentIndex}
                    responsive={responsive}
                    autoPlayInterval={100}
                    autoPlayDirection="rtl"
                    autoPlayActionDisabled={false}
                    onSlideChange={this.onSlideChange}
                    onSlideChanged={this.onSlideChanged}
                >
                    <div className="item"><h1>1</h1></div>
                    <div className="item"><h1>2</h1></div>
                    <div className="item"><h1>3</h1></div>
                    <div className="item"><h1>4</h1></div>
                    <div className="item"><h1>5</h1></div>
                    <div className="item"><h1>6</h1></div>
                    <div className="item"><h1>7</h1></div>
                    <div className="item"><h1>8</h1></div>
                </AliceCarousel>
            </div>
        );
    }
}
