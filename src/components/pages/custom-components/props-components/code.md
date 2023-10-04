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

const createItems = (length, [handleClick]) => {
	let deltaX = 0;
	let difference = 0;
	const swipeDelta = 20;

	return Array.from({ length }).map((item, i) => (
		<div
			data-value={i + 1}
			className="item"
			onMouseDown={(e) => (deltaX = e.pageX)}
			onMouseUp={(e) => (difference = Math.abs(e.pageX - deltaX))}
			onClick={() => difference < swipeDelta && handleClick(i)}
		>
			<span className="item-inner" />
		</div>
	));
};

const Carousel = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [items] = useState(createItems(5, [setActiveIndex]));

	const slidePrev = () => setActiveIndex(activeIndex - 1);
	const slideNext = () => setActiveIndex(activeIndex + 1);
	const syncActiveIndexForSwipeGestures = (e: EventObject) => setActiveIndex(e.item);

	const onSlideChanged = (e: EventObject) => {
		syncActiveIndexForSwipeGestures(e);
		console.debug(`onSlideChanged => Item's position after changes: ${e.item}. Event:`, e);
	};

	const onUpdated = (e: EventObject) => {
		console.debug(`onUpdated => Item's position after update: ${e.item}. Event:`, e);
	};

	return [
		<AliceCarousel
			mouseTracking
			disableDotsControls
			disableButtonsControls
			items={items}
			activeIndex={activeIndex}
			responsive={responsive}
			onSlideChanged={onSlideChanged}
			onUpdated={onUpdated}
		/>,
		<div className="b-refs-buttons">
			<button onClick={slidePrev}>Prev</button>
			<button onClick={slideNext}>Next</button>
		</div>,
	];
};
```
