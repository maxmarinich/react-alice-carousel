import React from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';
import '../../../lib/scss/alice-carousel.scss';

const StagePaddingPage = () => {
	return (
		<section className="p-basic">
			<AliceCarousel
				mouseTracking
				responsive={{
					0: { items: 1 },
					568: { items: 2 },
					1024: { items: 3 },
				}}
				paddingLeft={50}
				paddingRight={50}
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
};

export default StagePaddingPage;
