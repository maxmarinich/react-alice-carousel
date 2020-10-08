import React from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';
import { AutoPlayStrategy, AnimationType } from '../../../lib/types';
import '../../../lib/scss/alice-carousel.scss';

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
			<br />
			<br />
			<TheCode html={markdown} />
		</section>
	);
};

export default AutoplayPage;
