```typescript jsx
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import type { EventObject } from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const responsive = {
	0: { items: 1 },
	568: { items: 2 },
	1024: { items: 3 },
};

const items = [
	<div className="item" data-value="1">1</div>,
	<div className="item" data-value="2">2</div>,
	<div className="item" data-value="3">3</div>,
	<div className="item" data-value="4">4</div>,
	<div className="item" data-value="5">5</div>,
];

const onSlideChange = (e: EventObject) => {
	console.debug(`onSlideChange => Item's position before a change: ${e.item}. Event:`, e);
};

const onSlideChanged = (e: EventObject) => {
	console.debug(`onSlideChanged => Item's position after changes: ${e.item}. Event:`, e);
};

const Carousel = () => (
    <AliceCarousel
        mouseTracking
	    keyboardNavigation
        items={items}
        responsive={responsive}
        onSlideChange={onSlideChange}
        onSlideChanged={onSlideChanged}
    />
);
```
