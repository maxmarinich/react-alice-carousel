import React from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';
import '../../../lib/scss/alice-carousel.scss';

const items = [
	<div className="item">1</div>,
	<div className="item">2</div>,
	<div className="item">3</div>,
	<div className="item">4</div>,
	<div className="item">5</div>,
];

const onInitialized = (e) => {
	console.debug('Start position(activeIndex) on init: ', e.item);
};

const onSlideChange = (e) => {
	console.debug('Item`s position before a change: ', e.item);
};

const onSlideChanged = (e) => {
	console.debug('Item`s position after changes: ', e.item);
};

function Events() {
	return (
		<section className="p-basic">
			<AliceCarousel
				mouseTracking
				items={items}
				onInitialized={onInitialized}
				onSlideChange={onSlideChange}
				onSlideChanged={onSlideChanged}
			>
				<div className="item">
					<h1>1</h1>
				</div>
				<div className="item">
					<h1>2</h1>
				</div>
				<div className="item">
					<h1>3</h1>
				</div>
				<div className="item">
					<h1>4</h1>
				</div>
				<div className="item">
					<h1>5</h1>
				</div>
			</AliceCarousel>
			<TheCode html={markdown} />
		</section>
	);
}

export default Events;
