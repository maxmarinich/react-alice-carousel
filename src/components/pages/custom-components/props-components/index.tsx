import React, { useState } from 'react';

import markdown from './code.md';
import TheCode from '../../../the-code';
import AliceCarousel from '../../../../lib/react-alice-carousel';

const responsive = {
	0: { items: 1 },
	568: { items: 2 },
	1024: { items: 3 },
};

const createItems = (length = 0, [handleClick]: [(i:number) => void]) => {
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

const PropsComponent = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [items] = useState(createItems(5, [setActiveIndex]));

	const slidePrev = () => setActiveIndex(activeIndex - 1);
	const slideNext = () => setActiveIndex(activeIndex + 1);
	const syncActiveIndex = ({ item = 0 }) => setActiveIndex(item);

	return (
		<section className="p-basic">
			<AliceCarousel
				mouseTracking
				disableDotsControls
				disableButtonsControls
				items={items}
				activeIndex={activeIndex}
				responsive={responsive}
				onSlideChanged={syncActiveIndex}
			/>
			<div className="b-refs-buttons">
				<button onClick={slidePrev}>Prev</button>
				<button onClick={slideNext}>Next</button>
			</div>
			<TheCode html={markdown} />
		</section>
	);
};

export default PropsComponent;
