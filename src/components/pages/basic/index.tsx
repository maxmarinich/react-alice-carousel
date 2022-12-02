import React from 'react';

import markdown from './code.md';
import markdown2 from './code-responsive.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';
import Anchor, { genAnchorProps } from '../../the-anchor';

const responsive = {
	0: { items: 1 },
	568: { items: 2 },
	1024: {
		items: 3,
		itemsFit: 'contain',
	},
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
			<AliceCarousel mouseTracking items={items} responsive={responsive} controlsStrategy="alternate" />
			<TheCode html={markdown} />

			<h2 className="title" style={{ paddingTop: 80 }}>
				<Anchor {...genAnchorProps('responsive')} />
				&nbsp; Responsive
			</h2>
			<AliceCarousel mouseTracking items={items.slice(0, 2)} responsive={responsive} />
			<TheCode html={markdown2} />
		</section>
	);
};

export default BasicPage;
