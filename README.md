# React Alice Carousel

![demo gif](https://github.com/maxmarinich/react-alice-carousel/raw/master/source/i/react-alice-carousel.gif)

![demo gif](https://github.com/maxmarinich/react-alice-carousel/raw/master/source/i/react-alice-carousel-demo.gif)

React Alice Carousel is a React component for building content galleries, content rotators and any React carousels.

## Features of react-alice-carousel

* Infinite loop
* FadeOut animation
* AutoPlay mode
* Mobile friendly
* Responsive design
* Swipe to slide
* Start index
* Slide to index
* RTL
* Keyboard navigation
* Touch and Drag support
* Custom rendered slides
* Custom animation duration
* Multiple items in the slide
* Show / hide anything (indicators, arrows, slides indexes)

## How to use

```apacheconfig
npm install react-alice-carousel --save-dev
```

### Style import

```
# SCSS
@import "react-alice-carousel/src/alice-carousel.scss";
```
```
# CSS
@import "react-alice-carousel/lib/alice-carousel.css";
```
```
# Webpack
import "react-alice-carousel/lib/alice-carousel.css";
```

#### Quick start

```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';


const Gallery = () => (
  <AliceCarousel>
    <img src="/img1" className="yours-custom-class" />
    <img src="/img2" className="yours-custom-class" />
    <img src="/img3" className="yours-custom-class" />
    <img src="/img4" className="yours-custom-class" />
    <img src="/img5" className="yours-custom-class" />
  </AliceCarousel>
)
```

### Advanced configuration


#### Props
*  `items` : Array, default `[]` - gallery items,  preferable to use this property instead of ` children `

* `duration` : Number, default  `250` - Duration of slides transition (milliseconds)

* `responsive` : Object, default `{}` - Number of items in the slide

  ```js
    {
        0: {
            items: 1
        },
        1024: {
            items: 3
        }
    }
  ```

* `buttonsDisabled` : Boolean, `false` - Disable buttons control

* `dotsDisabled` : Boolean, `false` - Disable dots navigation

* `startIndex` : Number, `0` - The starting index of the carousel

* `slideToIndex` : Number, `0` - Sets the carousel at the specified position

* `swipeDisabled` : Boolean, default `false` - Disable swipe handlers

* `mouseDragEnabled` : Boolean, default `false` - Enable mouse drag animation

* `infinite` : Boolean, default `true` - Disable infinite mode

* `fadeOutAnimation` : Boolean, `false` - Enable fadeout animation. Fired when 1 item is in the slide

* `keysControlDisabled` :  Boolean, default `false` - Disable keys controls (left, right, space)

* `playButtonEnabled` :  Boolean, default `false` - Disable play/pause button

* `autoPlay` : Boolean, default `false` - Set auto play mode

* `autoPlayInterval` : Number, default  `250` - Interval of auto play animation (milliseconds). If specified, a larger value will be taken from comparing this property and the `duration` one

* `autoPlayDirection` : String, default `ltr` - To run auto play in the left direction specify `rtl` value

* `autoPlayActionDisabled` : Boolean, default `false` - If this property is identified as `true` auto play animation will be stopped after clicking user on any gallery button

* `stopAutoPlayOnHover` : Boolean, default `true` - If this property is identified as `false` auto play animation won't stopped on hover

* `showSlideIndex` : Boolean, default `false` - Show slide info

* `onSlideChange` : Function - Fired when the event object is changing / returns event object

* `onSlideChanged` : Function - Fired when the event object was changed / returns event object

  _Both functions return next object_
  ```js
    {
        item: index,   // index of the item`s position
        slide: index   // index of the slide`s position
    }
  ```


### Examples

```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';


class Gallery extends React.Component {
  
  onSlideChange(e) {
    console.log('Item`s position during a change: ', e.item);
    console.log('Slide`s position during a change: ', e.slide);
  };

  onSlideChanged(e) {
    console.log('Item`s position after changes: ', e.item);
    console.log('Slide`s position after changes: ', e.slide);
  };
  
  galleryItems = () => [1,2,3,4,5].map((item, i) => (
    <div key={`key-${i}`} className="yours-custom-class"><h2>{item}</h2></div>
  ));
  
  render() {
    
    // declare props in the `render` only for stateless components
    
    const responsive = {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1024: {
        items: 3
      }
    };

    return (
      <AliceCarousel
        duration={400}
        autoPlay={true}
        startIndex = {1}
        fadeOutAnimation={true}
        mouseDragEnabled={true}
        playButtonEnabled={true}
        responsive={responsive}
        autoPlayInterval={2000}
        autoPlayDirection="rtl"
        autoPlayActionDisabled={true}
        onSlideChange={this.onSlideChange}
        onSlideChanged={this.onSlideChanged}
        items={this.galleryItems()}
      />
    );
  }
}
```

#### Custom `Prev / Next` buttons, `dots / thumbs` navigation:
* Using -  [_refs_](https://facebook.github.io/react/docs/refs-and-the-dom.html).

```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';


class Gallery extends React.Component {
  
  galleryItems = () => [1,2,3,4,5].map((item, i) => (
    <div key={`key-${i}`} className="yours-custom-class"><h2>{item}</h2></div>
  ));
  
  renderThumbs = () =>
    <ul>
      {
        [1,2,3,4,5].map((item, i) => (
          <li key={i} onClick={() => this.Carousel._onDotClick(i)}>Thumb {item}</li>
        ))          
      }
    </ul>;
    
  render() {
    return (
      <div>
        <h3>Navigation</h3>
        { this.renderThumbs() }
        <button onClick={() => this.Carousel._slidePrev()}>Prev button</button>
        <button onClick={() => this.Carousel._slideNext()}>Next button</button>
        <h3>React Alice Carousel</h3>
        
        <AliceCarousel 
          dotsDisabled={true}
          buttonsDisabled={true}
          items={this.galleryItems()}
          ref={ el => this.Carousel = el }
        />
      </div>
    );
  }
}
```
* Using [_props_](https://facebook.github.io/react/docs/components-and-props.html)

```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';


class Gallery extends React.Component {
    constructor() {
      super();
      this.state = {
        currentIndex: 0,
        items: this.galleryItems(),
        responsive: { 1024: { items: 3 }},
      }
    }

    slideTo = (i) => this.setState({ currentIndex: i });

    onSlideChanged = (e) => this.setState({ currentIndex: e.item });

    slideNext = () => this.setState({ currentIndex: this.state.currentIndex + 1 });

    slidePrev = () => this.setState({ currentIndex: this.state.currentIndex - 1 });
    
    galleryItems = () => [1,2,3,4,5].map((item, i) => (
      <div key={`key-${i}`} className="yours-custom-class"><h2>{item}</h2></div>
    ));

    renderThumbs = () =>
      <ul>
        {
          [1,2,3,4,5].map((item, i) => (
            <li key={`key-${i}`} onClick={() => this.slideTo(i)}>Thumb {item}</li>
          ))
        }
      </ul>;

    render() {
      return (
        <div>
          <h3>Navigation</h3>
          { this.renderThumbs() }
          <button onClick={() => this.slidePrev()}>Prev button</button>
          <button onClick={() => this.slideNext()}>Next button</button>
          <h3>React Alice Carousel</h3>

          <AliceCarousel
            dotsDisabled={true}
            buttonsDisabled={true}
            items={this.state.items}
            responsive={this.state.responsive}
            slideToIndex={this.state.currentIndex}
            onSlideChanged={this.onSlideChanged}
          />
        </div>
      );
    }
}
```

### Build the project locally

#### Clone
```apacheconfig
git clone https://github.com/maxmarinich/react-alice-carousel
cd react-alice-carousel
```
#### Run

```apacheconfig
npm i
npm start
```

#### License

MIT
