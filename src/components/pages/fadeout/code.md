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

const Carousel = () => (
    <AliceCarousel
        animationType="fadeout" 
        animationDuration={800}
        disableButtonsControls
        infinite
        items={items}
        mouseTracking
    />
);
```
