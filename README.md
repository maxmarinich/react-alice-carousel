# React Alice Carousel

![demo gif](https://github.com/maxmarinich/react-alice-carousel/raw/master/source/i/react-alice-carousel.gif)


React Alice Carousel is a React component for building content galleries, content rotators and any React carousels.

## Features of react-alice-carousel

* Infinite loop
* AutoPlay mode
* Mobile friendly
* Responsive design
* Swipe to slide
* RTL
* Keyboard navigation
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
@import "node_modules/react-alice-carousel/src/alice-carousel.scss";
```
```
# CSS 
@import "node_modules/react-alice-carousel/lib/alice-carousel.css";
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
* `duration` : Number, default  `250` 
    - Duration of slides transition (milliseconds)
* `responsive` : Object, default `{}`
    - Number of items in the slide 
* `buttonsDisabled` : Boolean, `false`
    - Disable buttons control
* `dotsDisabled` : Boolean, `false`
     - Disable dots navigation
* `swipeDisabled` : Boolean, default `false`
     - Disable swipe handlers    
* `keysControlDisabled` :  Boolean, default `false`
     - Disable keys controls (left, right, space)
* `playButtonDisabled` :  Boolean, default `false`
     - Disable play/pause button
* `autoPlay` : Boolean, default `false` 
     - Set auto play mode
* `autoPlayInterval` : Number, default  `250`
     - Interval of auto play animation (milliseconds). If specified, a larger value will be taken from comparing this property and the `duration` one
* `autoPlayDirection` : String, default `ltr`
     - To run auto play in the left direction specify `rtl` value 
* `autoPlayActionDisabled` : Boolean, default `false`
     - If this property is identified as `true` auto play animation will be stopped after clicking user on any gallery button
* `onSlideChange` : Function
    - Fired when the slide position changes / returns current slide index


#### Example

```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';

class Gallery extends React.Component {    
    
  logCurrentSlideIndex(currentSlideIndex) { 
      console.log('currentSlideIndex: ', currentSlideIndex); 
  }

  render() {
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
        duration={650}
        autoPlay={true}
        responsive={responsive}
        autoPlayInterval={2000}
        autoPlayDirection="rtl"
        autoPlayActionDisabled={true}
        onSlideChange={this.logCurrentSlideIndex}
        >
        <div className="yours-custom-class"><h2>1</h2></div>
        <div className="yours-custom-class"><h2>2</h2></div>
        <div className="yours-custom-class"><h2>3</h2></div>
        <div className="yours-custom-class"><h2>4</h2></div>
        <div className="yours-custom-class"><h2>5</h2></div>
      </AliceCarousel>
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
