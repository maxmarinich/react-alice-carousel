import React from 'react';
import AliceCarousel from './structure/react-alice-carousel';


export class App extends React.Component {
  onSlideChange = (e) => {
    console.log('Item`s position during a change: ', e.item);
    console.log('Slide`s position during a change: ', e.slide);
  }

  onSlideChanged = (e) => {
    console.log('Item`s position after changes: ', e.item);
    console.log('Slide`s position after changes: ', e.slide);
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
        items: 1
      }
    };

    return (
      <div className="app">
        <h1 className="h1">React Alice Carousel</h1>
        <AliceCarousel
          duration={1000.001}
          autoPlay={false}
          playButtonEnabled={true}
          responsive={responsive}
          autoPlayInterval={100}
          autoPlayDirection="rtl"
          autoPlayActionDisabled={true}
          startIndex={5}
          fadeOut={true}
          //onSlideChange={this.onSlideChange}
          //onSlideChanged={this.onSlideChanged}
        >
          <div className="item"><h1><a href="#1"> 1</a></h1></div>
          <div className="item"><h1><a href="#2">2</a></h1></div>
          <div className="item"><h1><a href="#3"> 3</a></h1></div>
          <div className="item"><h1><a href="#4">4</a></h1></div>
          <div className="item"><h1><a href="#5"> 5</a></h1></div>
          <div className="item"><h1><a href="#6">6</a></h1></div>
          <div className="item"><h1>7</h1></div>
          <div className="item"><h1>8</h1></div>
          <div className="item"><h1>9</h1></div>
          <div className="item"><h1>10</h1></div>
        </AliceCarousel>
      </div>
    );
  }
}
