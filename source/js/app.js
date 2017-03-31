import React from 'react';
import AliceCarousel from './structure/react-alice-carousel';


export class App extends React.Component {

    logCurrentSlideIndex(currentSlideIndex) {
        console.log('currentSlide: ', currentSlideIndex);
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

        return (
            <div className="app">
                <h1 className="h1">React Alice Carousel</h1>
                <AliceCarousel
                    duration={400}
                    autoPlay={true}
                    responsive={responsive}
                    autoPlayInterval={2000}
                    autoPlayDirection="rtl"
                    autoPlayActionDisabled={true}
                    onSlideChange={this.logCurrentSlideIndex}
                >
                    <div className="item"><h1>1</h1></div>
                    <div className="item"><h1>2</h1></div>
                    <div className="item"><h1>3</h1></div>
                    <div className="item"><h1>4</h1></div>
                </AliceCarousel>
            </div>
        );
    }
}
