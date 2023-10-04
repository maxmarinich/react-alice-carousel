import React from 'react';

import markdown from './code.md';
import TheCode from '../../../the-code';
import AliceCarousel, { EventObject } from '../../../../lib/react-alice-carousel';

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

const onSlideChange = (e: EventObject) => {
	console.debug(`onSlideChange => Item's position before a change: ${e.item}. Event:`, e);
};

const onSlideChanged = (e: EventObject) => {
	console.debug(`onSlideChanged => Item's position after changes: ${e.item}. Event:`, e);
};

export default function ChangeEvents() {
	return (
		<section className="p-basic p-events">
			<AliceCarousel
				mouseTracking
				keyboardNavigation
				items={items}
				responsive={responsive}
				onSlideChange={onSlideChange}
				onSlideChanged={onSlideChanged}
			/>
			<TheCode html={markdown} />
		</section>
	);
}
