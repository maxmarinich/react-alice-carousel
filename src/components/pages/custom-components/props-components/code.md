```javascript
import React, { useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const items = [
	<div className="item" data-value="1">1</div>,
	<div className="item" data-value="2">2</div>,
	<div className="item" data-value="3">3</div>,
	<div className="item" data-value="4">4</div>,
	<div className="item" data-value="5">5</div>,
];

const Carousel = () => {
	const [activeIndex, setActiveIndex] = useState(0);

	const slidePrev = () => setActiveIndex(activeIndex - 1);
	const slideNext = () => setActiveIndex(activeIndex + 1);
	const onSlideChanged = ({ item }) => setActiveIndex(item);

	return [
		<AliceCarousel
			mouseTracking
			disableDotsControls
			disableButtonsControls
			infinite
			items={items}
			activeIndex={activeIndex}
			onSlideChanged={onSlideChanged}
		/>,
		<div className="b-refs-buttons">
			<button onClick={slidePrev}>Prev</button>
			<button onClick={slideNext}>Next</button>
		</div>,
	];
};
```
