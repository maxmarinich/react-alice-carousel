import React, { useState } from 'react';

import markdown from './code.md';
import TheCode from '../../../the-code';
import AliceCarousel from '../../../../lib/react-alice-carousel';
import '../../../../lib/scss/alice-carousel.scss';

const items = [
	<div className="item" data-value="1">
		1
	</div>,
	<div className="item" data-value="2">
		2
	</div>,
	<div className="item" data-value="3">
		3
	</div>,
	<div className="item" data-value="4">
		4
	</div>,
	<div className="item" data-value="5">
		5
	</div>,
];

const PropsComponent = () => {
	const [activeIndex, setActiveIndex] = useState(0);

	const slidePrev = () => setActiveIndex(activeIndex - 1);
	const slideNext = () => setActiveIndex(activeIndex + 1);
	const onSlideChanged = ({ item }) => setActiveIndex(item);

	console.debug('render');

	return (
		<section className="p-basic">
			<AliceCarousel
				mouseTracking
				disableDotsControls
				disableButtonsControls
				infinite
				items={items}
				activeIndex={activeIndex}
				onSlideChanged={onSlideChanged}
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
