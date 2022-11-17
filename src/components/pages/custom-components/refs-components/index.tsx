import React, { useRef } from 'react';

import markdown from './code.md';
import TheCode from '../../../the-code';
import AliceCarousel from '../../../../lib/react-alice-carousel';

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

const RefsComponent = () => {
	const carousel = useRef<AliceCarousel>(null);

	return (
		<section className="p-basic">
			<AliceCarousel
				key="carousel"
				mouseTracking
				disableDotsControls
				disableButtonsControls
				items={items}
				ref={carousel}
			/>
			<nav key="nav" className="b-refs-navs">
				{items.map((item, i) => {
					return <span key={i} onClick={() => carousel?.current?.slideTo(i)} />;
				})}
			</nav>
			<div key="btns" className="b-refs-buttons">
				<button onClick={(e) => carousel?.current?.slidePrev(e)}>Prev</button>
				<button onClick={(e) => carousel?.current?.slideNext(e)}>Next</button>
			</div>
			<TheCode key="code" html={markdown} />
		</section>
	);
};

export default RefsComponent;
