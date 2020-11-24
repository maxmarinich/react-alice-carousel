```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const items = [
	<div className="item" data-value="1">1</div>,
	<div className="item" data-value="2">2</div>,
	<div className="item" data-value="3">3</div>,
	<div className="item" data-value="4">4</div>,
	<div className="item" data-value="5">5</div>,
];

const navItem = (item, i) => {
	return <i key={i} onClick={() => this.Carousel.slideTo(i)} />;
};


const Carousel = () => [
	<AliceCarousel
		mouseTracking
		disableDotsControls
		disableButtonsControls
		items={items}
		ref={(el) => (this.Carousel = el)}
	/>,
	<nav>{items.map(navItem)}</nav>,
	<div>
		<button onClick={() => this.Carousel.slidePrev()}>Prev</button>
		<button onClick={() => this.Carousel.slideNext()}>Next</button>
	</div>,
];
```
