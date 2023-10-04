import React, { useState } from 'react';

import markdown from './code.md';
import TheCode from '../../../the-code';
import AliceCarousel from '../../../../lib/react-alice-carousel';
import type { EventObject } from '../../../../lib/react-alice-carousel';

const responsive = {
	0: { items: 1 },
	568: { items: 2 },
	1024: { items: 3 },
};

const createItems = (length = 5) => {
	return Array.from({ length }).map((e, i) => (
		<div key={i} className="item" data-value={i + 1}>
			{i + 1}
		</div>
	));
};

export default function UpdateEvents() {
	const [items, setItems] = useState(createItems());

	const onInitialized = (e: EventObject) => {
		console.debug('onInitialized => ItemsLength:', items.length, 'Event:', e);
	};

	const onResized = (e: EventObject) => {
		console.debug('onResized => ItemsLength:', items.length, 'Event:', e);
	};

	const onUpdated = (e: EventObject) => {
		console.debug('onUpdated => ItemsLength:', items.length, 'Event:', e);
	};

	return (
		<section className="p-basic p-events">
			<div style={{ textAlign: 'center', margin: 20 }}>
				<button disabled={items.length <= 1} onClick={() => setItems(createItems(items.length - 1))}>
					-
				</button>
				<span className="title">
					&nbsp;<b>Items ({items.length})</b>&nbsp;
				</span>
				<button onClick={() => setItems(createItems(items.length + 1))}>+</button>
			</div>
			<AliceCarousel
				mouseTracking
				keyboardNavigation
				items={items}
				responsive={responsive}
				onInitialized={onInitialized}
				onResized={onResized}
				onUpdated={onUpdated}
			/>

			<TheCode html={markdown} />
		</section>
	);
}
