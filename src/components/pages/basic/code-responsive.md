```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const responsive = {
	0: { 
		items: 1
    },
	568: { 
		items: 2
    },
	1024: {
		items: 3, 
        itemsFit: 'contain'
    },
};

const items = [
	<div className="item" data-value="1">1</div>,
	<div className="item" data-value="2">2</div>,
];

const Carousel = () => (
	<AliceCarousel
		mouseTracking
		items={items}
		responsive={responsive}
	/>
);
```
