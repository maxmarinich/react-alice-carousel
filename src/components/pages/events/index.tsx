import React from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';

const responsive = {
	0: { items: 1 },
	568: { items: 2 },
	1024: { items: 3 },
};

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

const onInitialized = (e) => {
	console.debug(`Start position(activeIndex) on init: ${e.item}. Event:`, e);
};

const onSlideChange = (e) => {
	console.debug(`Item's position before a change: ${e.item}. Event:`, e);
};

const onSlideChanged = (e) => {
	console.debug(`Item's position after changes: ${e.item}. Event:`, e);
};

function Events() {
	return (
		<section className="p-basic p-events">
			<AliceCarousel
				mouseTracking
				items={items}
				responsive={responsive}
				onInitialized={onInitialized}
				onSlideChange={onSlideChange}
				onSlideChanged={onSlideChanged}
			/>
			<TheCode html={markdown} />
		</section>
	);
}

export default Events;
