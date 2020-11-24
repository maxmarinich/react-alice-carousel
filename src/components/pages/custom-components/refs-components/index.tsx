import React from 'react';

import markdown from './code.md';
import TheCode from '../../../the-code';
import AliceCarousel from '../../../../lib/react-alice-carousel';
import '../../../../lib/scss/alice-carousel.scss';

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

const navItem = (item, i) => {
	return <i key={i} onClick={() => this.Carousel.slideTo(i)} />;
};

const RefsComponent = () => {
	return (
		<section className="p-basic">
			<AliceCarousel
				key="carousel"
				mouseTracking
				disableDotsControls
				disableButtonsControls
				items={items}
				ref={(el) => (this.Carousel = el)}
			/>
			<nav key="nav" className="b-refs-navs">
				{items.map(navItem)}
			</nav>
			<div key="btns" className="b-refs-buttons">
				<button onClick={() => this.Carousel.slidePrev()}>Prev</button>
				<button onClick={() => this.Carousel.slideNext()}>Next</button>
			</div>
			<TheCode key="code" html={markdown} />
		</section>
	);
};

export default RefsComponent;
