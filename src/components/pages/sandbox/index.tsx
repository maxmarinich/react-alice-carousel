import React, { useState } from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';

const responsive = {
	0: { items: 5 },
	// 568: { items: 2 },
	//1024: { items: 4 },
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

const thumbItems = (items, onClick) => {
	return items.map((item, i) => (
		<div onClick={() => onClick(i)} className="thumb" style={{ width: 80, height: 100 }}>
			{item}
		</div>
	));
};

const SandboxPage = () => {
	const [activeIndex, setIndex] = useState(2);
	const [thumbs] = useState(thumbItems(items, setIndex));

	const sync = ({ item }) => {
		setIndex(item);
		console.debug('after:', item);
	};

	return (
		<section className="p-basic p-padding">
			{/*<AliceCarousel*/}
			{/*	infinite*/}
			{/*	mouseTracking*/}
			{/*	items={items}*/}
			{/*	responsive={responsive}*/}
			{/*	activeIndex={activeIndex}*/}
			{/*	disableDotsControls*/}
			{/*	disableButtonsControls*/}
			{/*	name="main-carousel"*/}
			{/*	onSlideChanged={sync}*/}
			{/*/>*/}
			<div className="thumbs">
				<AliceCarousel
					// autoWidth
					// infinite
					mouseTracking
					// disableDotsControls
					// disableButtonsControls
					// animationType="fadeout"
					items={thumbs}
					responsive={responsive}
					activeIndex={activeIndex}
					onSlideChanged={sync}
				/>
				<div
					className="btm-prev"
					onClick={() => {
						setIndex(activeIndex - 1);
					}}
				>
					&lang;
				</div>
				<div
					className="btm-next"
					onClick={() => {
						setIndex(activeIndex + 1);
					}}
				>
					&rang;
				</div>
			</div>
			<TheCode html={markdown} />
		</section>
	);
};

export default SandboxPage;
