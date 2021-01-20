# React Alice Carousel

[![npm version](https://badge.fury.io/js/react-alice-carousel.svg)](https://badge.fury.io/js/react-alice-carousel)
[![Build Status](https://travis-ci.com/maxmarinich/react-alice-carousel.svg?branch=master)](https://travis-ci.com/maxmarinich/react-alice-carousel)

React Alice Carousel is a React component for building content galleries, content rotators and any React carousels.

#### 👉 &nbsp;Live demo (API): [v2.x.x](https://maxmarinich.github.io/react-alice-carousel/)

#### 👉 &nbsp;Previous version (API): [v1.x.x](https://github.com/maxmarinich/react-alice-carousel/tree/v1)

![demo gif](https://github.com/maxmarinich/react-alice-carousel/raw/master/src/assets/img/react-alice-carousel.gif)

![demo gif](https://github.com/maxmarinich/react-alice-carousel/raw/master/src/assets/img/react-alice-carousel-demo.gif)

## Features

- Auto Height
- Auto Play
- Auto Width
- Custom animation modes
- Custom rendered slides
- Infinite loop
- Mobile friendly
- Multiple items in the slide
- Responsive design
- Stage padding
- Show / hide anything (indicators, arrows, slides indexes)
- Swipe to slide
- Touch and Drag support
- TypeScript

## Installation
```apacheconfig
npm i react-alice-carousel
```
#### Style import
```
# CSS
@import "react-alice-carousel/lib/alice-carousel.css";
```
```
# SCSS
@import "react-alice-carousel/lib/scss/alice-carousel.scss";
```
## Usage
```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';


const handleDragStart = (e) => e.preventDefault();

const items = [
  <img src="path-to-img" onDragStart={handleDragStart} className="yours-custom-class" />,
  <img src="path-to-img" onDragStart={handleDragStart} className="yours-custom-class" />,
  <img src="path-to-img" onDragStart={handleDragStart} className="yours-custom-class" />,
];

const Gallery = () => {
  return (
    <AliceCarousel mouseTracking items={items} />
  );
}
```
#### Options
- `activeIndex` : Number, default `0` - Set carousel at the specified position.
- `animationDuration`: Number, default `400` - Set duration of animation.
- `animationEasingFunction`: String or [Function](https://developer.mozilla.org/ru/docs/Web/CSS/animation-timing-function), default `ease` - Property sets how an animation progresses through the duration of each cycle.
- `animationType`: String(`slide`, `fadeout`), default `slide` - Set type of animation.
- `autoHeight`: Boolean, default `false` - Set auto height mode.
- `autoWidth`: Boolean, default `false` - Set auto width mode.
- `autoPlay`: Boolean, default `false` - Set autoplay mode.
- `autoPlayControls`: Boolean, default `false` - Show/hide `play/pause` buttons.
- `autoPlayDirection`: String(`ltr`, `rtl`), default `ltr` - Set autoplay direction value.
- `autoPlayInterval`: Number, default `400` - Set autoplay interval value.
- `autoPlayStrategy`: String(`default`, `action`, `all`, `none`) - Set a strategy for autoplay mode
    * `default` - pause automatic playback on the hover
    * `action` - stop automatic playback if user action was detected
    * `all` - merge `default` && `action` strategies
    * `none` - ignore any user actions when the `autoPlay` property was specified
- `controlsStrategy`: String (`default`, `responsive`) - Set a strategy for gallery controls. Dots navigation will be hidden if _responsive_ property is set and the number of gallery elements is equal to the number of items in the slide.
- `disableButtonsControls`: Boolean, default `false` - Disable buttons controls.
- `disableDotsControls`: Boolean, default `false` - Disable dots controls.
- `disableSlideInfo`: Boolean, default `true` - Disable information about current slide.
- `infinite`: Boolean, default `false` - Set infinite mode.
- `items`: Array, default `undefined`  - Set gallery items, preferable to use this property instead of children.
- `mouseTracking`: Boolean, default `false`  - Enable mouse drag animation.
- `paddingLeft`: Number, default `0`  - Set the gallery offset from the left.
- `paddingRight`: Number, default `0`  - Set the gallery offset from the right.
- `renderKey`: Number, default `undefined`  - Auxiliary property, allows call the render method without changing the state inside the gallery instance.
- `responsive`: Object, default `undefined` - Set number of items in the slide. The key is the breakpoint (default is the result of: () => window.innerWidth).
    ```js
        {
          0: {
              items: 1,
          },
          1024: {
              items: 3
          }
        }
    ```

- `swipeDelta`: Number, default `20`  - Set minimum distance to the start of the swiping (px).
- `swipeExtraPadding`: Number, default `200`  - Set maximum distance from initial place before swipe action will be stopped (px).
- `touchTracking`: Boolean, default `true`  - Enable touch move animation.
- `touchMoveDefaultEvents`: Boolean, default `true`  - Enable touch move default events on swiping. If `false` was specified, this prevents vertical scrolling of the parent elements during the swipe. 
- `onInitialized(e: EventObject)`: Function - Fired as callback after the gallery was created.
- `onResizeEvent(e: Event)`: Function - Fired during `resize` event to determine whether the event handler should be called.
- `onResized(e: EventObject)`: Function - Fired as callback after the gallery was resized.
- `onSlideChange(e: EventObject)`: Function - Fired before the event object changes.
- `onSlideChanged(e: EventObject)`: Function - Fired after the event object was changed.
- `renderSlideInfo(e: SlideInfo)`: Rendering function - create a custom component.
- `renderDotsItem(e: DotsItem)`: Rendering function - create a custom component.
- `renderPrevButton({ isDisabled })`: Rendering function - create a custom component.
- `renderNextButton({ isDisabled })`: Rendering function - create a custom component.
- `renderPlayPauseButton({ isPlaying })`: Rendering function - create a custom component.

#### Methods
- `slidePrev(e: Event) => void` : Go to the prev slide.
- `slideNext(e: Event) => void` : Go to the next slide.
- `slideTo(activeIndex?: number) => void` : Go to the specified slide.

#### Types
```typescript
type EventObject = {
  item: number;
  slide: number;
  itemsInSlide: number;
  isPrevSlideDisabled: boolean;
  isNextSlideDisabled: boolean;
};

type SlideInfo = {
  item: number;
  itemsCount: number;
};

type DotsItem = {
  isActive: boolean;
  activeIndex: number;
};
```

#### CSS class names
```css
.alice-carousel__stage
.alice-carousel__stage-item

.alice-carousel__prev-btn
.alice-carousel__next-btn
.alice-carousel__play-btn

.alice-carousel__dots
.alice-carousel__dots-item

.alice-carousel__slide-info
```

## Build the project locally
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
## License
MIT
