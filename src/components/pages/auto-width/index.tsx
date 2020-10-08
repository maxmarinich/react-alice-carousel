import React from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';
import '../../../lib/scss/alice-carousel.scss';

const itemsLength = Array.from({ length: 5 });

const items = itemsLength.map((item, index) => (
	<div className="item" style={{ width: 150 + index * 100 }}>
		<h1>{index + 1}</h1>
	</div>
));

const AutowidthPage = () => {
	return (
		<section className="p-basic">
			<AliceCarousel mouseTracking autoWidth infinite items={items} />
			<TheCode html={markdown} />
		</section>
	);
};

export default AutowidthPage;
