import React from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';
import { AutoPlayStrategy, AnimationType } from '../../../lib/types';
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

const AutoplayPage = () => {
	return (
		<section className="p-basic">
			<AliceCarousel
				autoPlay
				autoPlayControls
				autoPlayStrategy={AutoPlayStrategy.NONE}
				autoPlayInterval={1000}
				animationDuration={1000}
				animationType={AnimationType.FADEOUT}
				infinite
				touchTracking={false}
				disableDotsControls
				disableButtonsControls
				items={items}
			/>
			<br />
			<br />
			<TheCode html={markdown} />
		</section>
	);
};

export default AutoplayPage;
