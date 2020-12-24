import React, { useState } from 'react';

import markdown from './code.md';
import TheCode from '../../../the-code';
import TheLazyLoader from '../../../the-lazy-loader';
import AliceCarousel from '../../../../lib/react-alice-carousel';

const RenderKeyExample = () => {
	const [key, setKey] = useState(0);
	const [items] = useState([
		<TheLazyLoader onLoad={onLoad} src="https://placehold.it/1200x200/C7CDDE/FFFFFF" delay={1000} />,
		<TheLazyLoader onLoad={onLoad} src="https://placehold.it/1200x250/C7CDDE/FFFFFF" delay={5000} />,
		<TheLazyLoader onLoad={onLoad} src="https://placehold.it/1200x300/C7CDDE/FFFFFF" delay={10000} />,
	]);

	function onLoad() {
		setKey(Date.now());
	}

	return (
		<section className="p-basic">
			<div>
				<AliceCarousel autoHeight renderKey={key} items={items} />
			</div>
			<TheCode html={markdown} />
		</section>
	);
};

export default RenderKeyExample;
