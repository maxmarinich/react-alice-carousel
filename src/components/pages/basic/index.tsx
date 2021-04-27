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

const BasicPage = () => {
	return (
		<section className="p-basic">
			<AliceCarousel 
				mouseTracking 
				items={items} 
				responsive={responsive} 
				controlsStrategy="alternate" 
				ariaLabel="My Carousels best"
				ariaRoledescription="carousel" 
				ariaRoledescriptionSlide="slide"
				addGroupRole = {true}
				buttonControls = {false}
			/>
			<TheCode html={markdown} />
		</section>
	);
};

export default BasicPage;
