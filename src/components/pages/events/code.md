```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';


const items = [
	<div className="item">1</div>,
	<div className="item">2</div>,
	<div className="item">3</div>,
	<div className="item">4</div>,
	<div className="item">5</div>,
];

const onInitialized = (e) => {
	console.debug('Start position(activeIndex) on init: ', e.item);
};

const onSlideChange = (e) => {
	console.debug('Item`s position before a change: ', e.item);
};

const onSlideChanged = (e) => {
	console.debug('Item`s position after changes: ', e.item);
};

const Carousel = () => (
    <AliceCarousel
        mouseTracking
        items={items}
        onInitialized={onInitialized}
        onSlideChange={onSlideChange}
        onSlideChanged={onSlideChanged}
    />
);
```
