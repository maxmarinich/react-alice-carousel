import React from 'react';
import AliceCarousel from './structure/react-alice-carousel';


export class App extends React.Component {

  onSlideChange(e) {
    console.log('Item`s position during a change: ', e.item);
    console.log('Slide`s position during a change: ', e.slide);
  }

  onSlideChanged(e) {
    console.log('Item`s position after changes: ', e.item);
    console.log('Slide`s position after changes: ', e.slide);
  }

  renderThumbs() {
    const thumbs = [1,2,3,4,5];
    return (
      <ul>{thumbs.map((item, i) => <li key={i}
                                       onClick={() => this.Carousel._slideToItem(i)}>Thumb {item}</li>)}
      </ul>
    );
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
          duration={100}
          autoPlay={false}

          responsive={responsive}
          autoPlayInterval={100}
          autoPlayDirection="rtl"
          autoPlayActionDisabled={true}
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
          <div className="item"><h1>9</h1></div>
          <div className="item"><h1>10</h1></div>
        </AliceCarousel>

        <div>
          <h3>Navigation</h3>
          {this.renderThumbs()}
          <button onClick={() => this.Carousel._slidePrev()}>Prev button</button>
          <button onClick={() => this.Carousel._slideNext()}>Next button</button>
          <h3>React Alice Carousel</h3>
          <AliceCarousel
            duration={200}
            dotsDisabled={true}
            buttonsDisabled={true}
            ref={ el => this.Carousel = el }
          >
            <div className="item"><h2>1</h2></div>
            <div className="item"><h2>2</h2></div>
            <div className="item"><h2>3</h2></div>
            <div className="item"><h2>4</h2></div>
            <div className="item"><h2>5</h2></div>
          </AliceCarousel>
        </div>
      </div>
    );
  }
}
