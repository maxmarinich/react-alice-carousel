import React from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';
import '../../../lib/scss/alice-carousel.scss';
import './styles..scss';

const itemsLength = Array.from({ length: 5 });

const items = itemsLength.map((item, index) => (
	<div className="item" style={{ height: 200 + index * 10 }}>
		<h1>{index + 1}</h1>
	</div>
));

const AutoheightPage = () => {
	return (
		<section className="p-basic autoheight">
			<AliceCarousel mouseTracking autoHeight infinite items={items} />
			<TheCode html={markdown} />
		</section>
	);
};

export default AutoheightPage;
