# React Alice Carousel

React Alice Carousel is a React component for building content galleries, content rotators and any React carousels.

### Features of react-alice-carousel

* Infinite loop
* Mobile friendly
* Responsive design
* Swipe to slide
* Keyboard navigation
* Custom rendered slides
* Custom animation duration
* Multiple items in the slide
* Show / hide anything (indicators, arrows, slides indexes)

### How to use


##### Style import

```
# SCSS
@import "node_modules/react-alice-carousel/styles/scss/alice-carousel.scss";

```
```
# CSS 
@import "node_modules/react-alice-carousel/styles/css/alice-carousel.css";
```
```
# Webpack
import "react-alice-carousel/styles/css/alice-carousel";

```

##### Quick start

```javascript

import React from 'react';
import AliceCarousel from 'react-alice-carousel';


class App extends React.Component {
    render() {
        return (
            <AliceCarousel>
                <img src="/img1" className="yours-custom-class" />
                <img src="/img2" className="yours-custom-class" />
                <img src="/img3" className="yours-custom-class" />
                <img src="/img4" className="yours-custom-class" />
                <img src="/img5" className="yours-custom-class" />
            </AliceCarousel>
        );
    }
}

```

### Advanced configuration


#### Props
* `duration` : Number , default  `250` 
    - Duration of slides transition (milliseconds) |
* `responsive` : Object, default `{}`
    - Number of items in the slide 
* `keysControlDisabled` :  Boolean, default `false`
     - Disable keys controls
* `buttonsDisabled` : Boolean, `false`
    - Disable buttons control
* `dotsDisabled` : Boolean, `false`
     - Disable dots navigation
* `swipeDisabled` : Boolean, default `false`
     - Disable swipe handlers
* `onSlideChange` : Function
    - Fired when the slide position changes / returns current slide index

### Example

```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';


export class App extends React.Component {
    
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
            <div className="app">
                <h1 className="h1">React Alice Carousel</h1>
                
                <AliceCarousel
                    responsive={ responsive }
                    onSlideChange={ this.logCurrentSlideIndex }
                    >
                    <div className="yours-custom-class"><h2>1</h2></div>
                    <div className="yours-custom-class"><h2>2</h2></div>
                    <div className="yours-custom-class"><h2>3</h2></div>
                    <div className="yours-custom-class"><h2>4</h2></div>
                    <div className="yours-custom-class"><h2>5</h2></div>
                </AliceCarousel>
            </div>
        );
    }
}
```

## Build the project locally

### Clone
```apacheconfig
git clone https://github.com/maxmarinich/react-alice-carousel
cd react-alice-carousel
```
### Run

```apacheconfig
npm i
npm start
```

### License

MIT
