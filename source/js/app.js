import React from 'react';
import Carousel from './structure/Carousel';


export class App extends React.Component {
    _logCurrentSlideIndex(currentSlideIndex){ console.log('currentSlide: ',currentSlideIndex); }

    render() {
        return (
            <div className="app">
                <h1 className="h1">React Carousel Gallery</h1>
                <Carousel responsive={ {0: {items: 1}, 600: {items: 1}, 1024: {items: 2}} }>
                    <div className="item"><h1>1</h1></div>
                    <div className="item"><h1>2</h1></div>
                    <div className="item"><h1>3</h1></div>
                    <div className="item"><h1>4</h1></div>
                    <div className="item"><h1>5</h1></div>
                    <div className="item"><h1>7</h1></div>
                    <div className="item"><h1>8</h1></div>
                </Carousel>;
            </div>
        );
    }
}

