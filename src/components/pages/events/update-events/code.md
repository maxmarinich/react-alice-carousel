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

const createItems = (length = 5) => {
	return Array.from({ length }).map((e, i) => <div key={i}>{i + 1}</div>);
};

const onInitialized = (e: EventObject) => {
	console.debug('onInitialized => ItemsLength:', items.length, 'Event:', e);
};

const onResized = (e: EventObject) => {
	console.debug('onResized => ItemsLength:', items.length, 'Event:', e);
};

const onUpdated = (e: EventObject) => {
	console.debug('onUpdated => ItemsLength:', items.length, 'Event:', e);
};

const Carousel = () => {
	const [items, setItems] = useState(createItems());
	const isDisabled = items.length <= 1;

	return (
		<section>
			<div>
				<button disabled={isDisabled} onClick={() => setItems(createItems(items.length - 1))}>-</button>
				<span>Items ({items.length})</span>
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
		</section>
	);
};
```
