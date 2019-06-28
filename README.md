# React Alice Carousel
[![npm version](https://badge.fury.io/js/react-alice-carousel.svg)](https://badge.fury.io/js/react-alice-carousel)
[![Build Status](https://travis-ci.com/maxmarinich/react-alice-carousel.svg?branch=master)](https://travis-ci.com/maxmarinich/react-alice-carousel)

React Alice Carousel is a React component for building content galleries, content rotators and any React carousels.

![demo gif](https://github.com/maxmarinich/react-alice-carousel/raw/master/src/assets/img/react-alice-carousel.gif)

![demo gif](https://github.com/maxmarinich/react-alice-carousel/raw/master/src/assets/img/react-alice-carousel-demo.gif)

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
* Auto Height
* Keyboard navigation
* Touch and Drag support
* Custom rendered slides
* Custom animation duration
* Multiple items in the slide
* Show / hide anything (indicators, arrows, slides indexes)
* TypeScript type definitions

## How to use

```apacheconfig
npm install react-alice-carousel --save-dev
```

### Style import

```
# SCSS
@import "react-alice-carousel/lib/scss/alice-carousel.scss";
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

* `autoHeight` : Boolean, default `false` - Set auto height mode

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

  _Event object example_
  ```js
    {
        item: index,   // index of the current item`s position
        slide: index,   // index of the current slide`s position
        itemsInSlide: number   // number of elements in the slide
    }
  ```
  
 * `shouldHandleResizeEvent` : Function - Fired during resize event to determine whether the event handler should be called / returns boolean


### Examples

```javascript
import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import "react-alice-carousel/lib/alice-carousel.css"

class Gallery extends React.Component {
  state = {
    galleryItems: [1, 2, 3].map((i) => (<h2 key={i}>{i}</h2>)),
  }

  responsive = {
    0: { items: 1 },
    1024: { items: 2 },
  }

  onSlideChange(e) {
    console.debug('Item`s position during a change: ', e.item)
    console.debug('Slide`s position during a change: ', e.slide)
  }

  onSlideChanged(e) {
    console.debug('Item`s position after changes: ', e.item)
    console.debug('Slide`s position after changes: ', e.slide)
  }

  render() {
    return (
      <AliceCarousel
        items={this.state.galleryItems}
        responsive={this.responsive}
        autoPlayInterval={2000}
        autoPlayDirection="rtl"
        autoPlay={true}
        fadeOutAnimation={true}
        mouseDragEnabled={true}
        playButtonEnabled={true}
        disableAutoPlayOnAction={true}
        onSlideChange={this.onSlideChange}
        onSlideChanged={this.onSlideChanged}
      />
    )
  }
}
```

#### Custom `Prev / Next` buttons, `dots / thumbs` navigation:
* Using -  [_refs_](https://facebook.github.io/react/docs/refs-and-the-dom.html).

```javascript
import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import "react-alice-carousel/lib/alice-carousel.css"

class Gallery extends React.Component {  
  items = [1, 2, 3, 4, 5]

  state = {
    galleryItems: this.items.map((i) => (<h2 key={i}>{i}</h2>))
  }

  thumbItem = (item, i) => (
    <span key={item} onClick={() => this.Carousel._onDotClick(i)}>* </span>
  )

  render() {
    return (
      <div>
        <AliceCarousel
          dotsDisabled={true}
          buttonsDisabled={true}
          items={this.state.galleryItems}
          ref={(el) => (this.Carousel = el)}
        />

        <nav>{this.items.map(this.thumbItem)}</nav>
        <button onClick={() => this.Carousel._slidePrev()}>Prev button</button>
        <button onClick={() => this.Carousel._slideNext()}>Next button</button>
      </div>
    )
  }
}
```
* Using [_props_](https://facebook.github.io/react/docs/components-and-props.html)

```javascript
import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import "react-alice-carousel/lib/alice-carousel.css"

class Gallery extends React.Component {
  items = [1, 2, 3, 4, 5]

  state = {
    currentIndex: 0,
    responsive: { 1024: { items: 3 } },
    galleryItems: this.galleryItems(),
  }

  slideTo = (i) => this.setState({ currentIndex: i })

  onSlideChanged = (e) => this.setState({ currentIndex: e.item })

  slideNext = () => this.setState({ currentIndex: this.state.currentIndex + 1 })

  slidePrev = () => this.setState({ currentIndex: this.state.currentIndex - 1 })

  thumbItem = (item, i) => <span onClick={() => this.slideTo(i)}>* </span>

  galleryItems() {
    return this.items.map((i) => <h2 key={i}> {i}</h2>)
  }

  render() {
    const { galleryItems, responsive, currentIndex } = this.state
    return (
      <div>
        <AliceCarousel
          dotsDisabled={true}
          buttonsDisabled={true}
          items={galleryItems}
          responsive={responsive}
          slideToIndex={currentIndex}
          onSlideChanged={this.onSlideChanged}
        />

        <ul>{this.items.map(this.thumbItem)}</ul>
        <button onClick={() => this.slidePrev()}>Prev button</button>
        <button onClick={() => this.slideNext()}>Next button</button>
      </div>
    )
  }
}
```

###### Example for _slidePrev/slideNext_ page

```javascript
import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'

class Gallery extends React.Component {
  state = {
    currentIndex: 0,
    itemsInSlide: 1,
    responsive: { 0: { items: 3 }},
    galleryItems: this.galleryItems(),
  }

  galleryItems() {
    return (
      Array(7).fill().map((item, i) => <h2 className="item">{i + 1}</h2>)
    )
  }

  slidePrevPage = () => {
    const currentIndex = this.state.currentIndex - this.state.itemsInSlide
    this.setState({ currentIndex })
  }

  slideNextPage = () => {
    const { itemsInSlide, galleryItems: { length }} = this.state
    let currentIndex = this.state.currentIndex + itemsInSlide
    if (currentIndex > length) currentIndex = length

    this.setState({ currentIndex })
  }

  handleOnSlideChange = (event) => {
    const { itemsInSlide, item } = event
    this.setState({ itemsInSlide, currentIndex: item })
  }

  render() {
    const { currentIndex, galleryItems, responsive } = this.state

    return (
      <div>
        <AliceCarousel
          items={galleryItems}
          slideToIndex={currentIndex}
          responsive={responsive}
          onInitialized={this.handleOnSlideChange}
          onSlideChanged={this.handleOnSlideChange}
          onResized={this.handleOnSlideChange}
        />
        <button onClick={this.slidePrevPage}>Prev Page</button>
        <button onClick={this.slideNextPage}>Next Page</button>
      </div>
    )
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
