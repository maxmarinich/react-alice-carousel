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

### Quick start


##### Style import

```
# SCSS
@import "node_modules/react-alice-carousel/styles/scss/alice-carousel.scss";

# CSS
@import "node_modules/react-alice-carousel/styles/css/alice-carousel.css";

# Webpack
import "react-alice-carousel/styles/css/alice-carousel";

```

##### Example

```javascript

import React from 'react';
import AliceCarousel from 'react-alice-carousel';


class App extends React.Component {
    render() {
        return (
            <AliceCarousel>
                <div className="yours-custom-class"><h1>1</h1></div>
                <div className="yours-custom-class"><h1>2</h1></div>
                <div className="yours-custom-class"><h1>3</h1></div>
                <div className="yours-custom-class"><h1>4</h1></div>
                <div className="yours-custom-class"><h1>5</h1></div>
                <div className="yours-custom-class"><h1>6</h1></div>
                <div className="yours-custom-class"><h1>7</h1></div>
            </AliceCarousel>
        );
    }
}

```


