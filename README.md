# React Alice Carousel

![demo gif](https://github.com/maxmarinich/react-alice-carousel/raw/master/app/assets/img/react-alice-carousel.gif)

![demo gif](https://github.com/maxmarinich/react-alice-carousel/raw/master/app/assets/img/react-alice-carousel-demo.gif)

React Alice Carousel is a React component for building content galleries, content rotators and any React carousels.

## Features of react-alice-carousel

* Infinite loop
* FadeOut animation
* AutoPlay mode
* Mobile friendly
* Responsive design
* Stage padding
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
import "react-alice-carousel/lib/alice-carousel.css";

const Gallery = () => {
  const handleOnDragStart = e => e.preventDefault()
  return (
    <AliceCarousel mouseDragEnabled >
      <img src="/img1" onDragStart={handleOnDragStart} className="yours-custom-class" />
      <img src="/img2" onDragStart={handleOnDragStart} className="yours-custom-class" />
      <img src="/img3" onDragStart={handleOnDragStart} className="yours-custom-class" />
      <img src="/img4" onDragStart={handleOnDragStart} className="yours-custom-class" />
      <img src="/img5" onDragStart={handleOnDragStart} className="yours-custom-class" />
    </AliceCarousel>
  )
}
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
* `stagePadding` : Object, default `{}` - Padding left and right on the stage

  ```js
    {
        paddingLeft: 0,     // in pixels
        paddingRight: 0
    }
  ```

* `buttonsDisabled` : Boolean, `false` - Disable buttons control

* `dotsDisabled` : Boolean, `false` - Disable dots navigation

* `startIndex` : Number, `0` - The starting index of the carousel

* `slideToIndex` : Number, `0` - Sets the carousel at the specified position

* `swipeDisabled` : Boolean, default `false` - Disable swipe handlers

* `mouseDragEnabled` : Boolean, default `false` - Enable mouse drag animation

  _To Avoid unexpected behavior you should handle `drag` event independently, something like in an [example](#quick-start)_   

* `infinite` : Boolean, default `true` - Disable infinite mode

* `fadeOutAnimation` : Boolean, `false` - Enable fadeout animation. Fired when 1 item is in the slide

* `keysControlDisabled` :  Boolean, default `false` - Disable keys controls (left, right, space)

* `playButtonEnabled` :  Boolean, default `false` - Disable play/pause button

* `autoPlay` : Boolean, default `false` - Set auto play mode

* `autoPlayInterval` : Number, default  `250` - Interval of auto play animation (milliseconds). If specified, a larger value will be taken from comparing this property and the `duration` one

* `autoPlayDirection` : String, default `ltr` - To run auto play in the left direction specify `rtl` value

* `disableAutoPlayOnAction` : Boolean, default `false` - If this property is identified as `true` auto play animation will be stopped after clicking user on any gallery button

* `stopAutoPlayOnHover` : Boolean, default `true` - If this property is identified as `false` auto play animation won't stopped on hover

* `showSlideInfo` : Boolean, default `false` - Show slide info

* `preventEventOnTouchMove` : Boolean, default `false` - Prevent the browser's touchmove event when carousel is swiping

* `onSlideChange` : Function - Fired when the event object is changing / returns event object

* `onSlideChanged` : Function - Fired when the event object was changed / returns event object

* `onInitialized` : Function - Fired when the gallery was initialized / returns event object

* `onResized` : Function - Fired when the gallery was resized / returns event object

  _All functions return an next object_
  ```js
    {
        item: index,   // index of the current item`s position
        slide: index   // index of the current slide`s position
        itemsInSlide: number   // number of elements in the slide
    }
  ```


### Examples

```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

class Gallery extends React.Component {
  items = this.galleryItems();

  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    1024: { items: 3 },
  };
  
  onSlideChange(e) {
    console.log('Item`s position during a change: ', e.item);
    console.log('Slide`s position during a change: ', e.slide);
  };

  onSlideChanged(e) {
    console.log('Item`s position after changes: ', e.item);
    console.log('Slide`s position after changes: ', e.slide);
  };
  
  galleryItems() {
    return (
      [1, 2, 3, 4, 5].map((item, i) => (
        <div key={`key-${i}`} className="yours-custom-class"><h2>{item}</h2></div>
      ))
    )
  };
  
  render() {
    return (
      <AliceCarousel
        items={this.items}
        duration={400}
        autoPlay={true}
        startIndex = {1}
        fadeOutAnimation={true}
        mouseDragEnabled={true}
        playButtonEnabled={true}
        autoPlayInterval={2000}
        autoPlayDirection="rtl"
        responsive={this.responsive}
        disableAutoPlayOnAction={true}
        onSlideChange={this.onSlideChange}
        onSlideChanged={this.onSlideChanged}
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
import "react-alice-carousel/lib/alice-carousel.css";

class Gallery extends React.Component {  
  items = [1, 2, 3, 4, 5];
  state = {
    items: this.items.map(this.galleryItem),
  };

  galleryItem = (item, i) => (
    <div key={`key-${i}`} className="yours-custom-class"><h2>{item}</h2></div>
  )
  
  thumbItem = (item, i) => (
    <li key={i} onClick={() => this.Carousel._onDotClick(i)}>Thumb {item}</li>
  )
                                   
  render() {
    return (
      <div>
        <h3>Navigation</h3>
        <ul>{this.items.map(this.thumbItem)}</ul>
        <button onClick={() => this.Carousel._slidePrev()}>Prev button</button>
        <button onClick={() => this.Carousel._slideNext()}>Next button</button>
        <h3>React Alice Carousel</h3>
        
        <AliceCarousel
          items={this.state.items}
          dotsDisabled={true}
          buttonsDisabled={true}
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
import "react-alice-carousel/lib/alice-carousel.css";

class Gallery extends React.Component {
  items = [1, 2, 3, 4, 5];
  state = {
    currentIndex: 0,
    responsive: { 1024: { items: 3 }},
    items: this.items.map(this.galleryItem),
  };

  slideTo = (i) => this.setState({ currentIndex: i });

  onSlideChanged = (e) => this.setState({ currentIndex: e.item });

  slideNext = () => this.setState({ currentIndex: this.state.currentIndex + 1 });

  slidePrev = () => this.setState({ currentIndex: this.state.currentIndex - 1 });
    
  thumbItem = (item, i) => (
    <li key={`key-${i}`} onClick={() => this.slideTo(i)}>Thumb {item}</li>
  );
    
  galleryItem = (item, i) => (
    <div key={`key-${i}`} className="yours-custom-class"><h2>{item}</h2></div>
  );

  render() {
    const { items, responsive, currentIndex } = this.state;
    return (
      <div>
        <h3>Navigation</h3>
        <ul>{this.items.map(this.thumbItem)}</ul>
        <button onClick={() => this.slidePrev()}>Prev button</button>
        <button onClick={() => this.slideNext()}>Next button</button>
        <h3>React Alice Carousel</h3>

        <AliceCarousel
          items={items}
          dotsDisabled={true}
          buttonsDisabled={true}
          responsive={responsive}
          slideToIndex={currentIndex}
          onSlideChanged={this.onSlideChanged}
        />
      </div>
    );
  }
}
```

###### Example for _slidePrev/slideNext_ page

```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

class Gallery extends React.Component {
  state = {
    currentIndex: 0,
    itemsInSlide: 1,
    galleryItems: this.galleryItems(),
  };

  responsive = {
    0: { items: 3 },
  };

  galleryItems() {
    return Array(7).fill().map((item, i) => (
      <div className="item"><h1>{i + 1}</h1></div>
    ))
  };

  slidePrevPage = () => {
    let currentIndex = this.state.currentIndex - this.state.itemsInSlide
    if (currentIndex < 0) currentIndex = -1

    this.setState({ currentIndex })
  };

  slideNextPage = () => {
    const { itemsInSlide, galleryItems: { length }} = this.state
    let currentIndex = this.state.currentIndex + itemsInSlide
    if (currentIndex > length) currentIndex = length

    this.setState({ currentIndex })
  };

  handleOnSlideChange = (event) => {
    const { itemsInSlide, item } = event
    this.setState({ itemsInSlide, currentIndex: item })
  };

  render() {
    const { currentIndex, galleryItems } = this.state;

    return (
      <div className="app" id="app">
        <AliceCarousel
          items={galleryItems}
          slideToIndex={currentIndex}
          responsive={this.responsive}
          onSlideChanged={this.handleOnSlideChange}
          onResized={this.handleOnSlideChange}
          onInitialized={this.handleOnSlideChange}
        />
        <button onClick={this.slidePrevPage}>Prev Page</button>
        <button onClick={this.slideNextPage}>Next Page</button>
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

#### Test
```apacheconfig
npm test
```

#### License

MIT
