import React from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';
import '../../../lib/scss/alice-carousel.scss';

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

const FadeoutPage = () => {
	return (
		<section className="p-basic">
			<AliceCarousel
				animationType="fadeout"
				animationDuration={800}
				disableButtonsControls
				infinite
				items={items}
				mouseTracking
			/>
			<TheCode html={markdown} />
		</section>
	);
};

export default FadeoutPage;
