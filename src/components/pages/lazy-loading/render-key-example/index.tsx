import React, { useState } from 'react';

import markdown from './code.md';
import TheCode from '../../../the-code';
import TheLazyLoader from '../../../the-lazy-loader';
import AliceCarousel from '../../../../lib/react-alice-carousel';

const RenderKeyExample = () => {
	const [key, setKey] = useState(0);
	const src = (name = '') => `//github.com/maxmarinich/react-alice-carousel/raw/master/src/assets/img/${name}`;

	const [items] = useState([
		<TheLazyLoader onLoad={onLoad} src={src('1200x200.jpg')} delay={1000} />,
		<TheLazyLoader onLoad={onLoad} src={src('1200x250.jpg')} delay={5000} />,
		<TheLazyLoader onLoad={onLoad} src={src('1200x300.jpg')} delay={10000} />,
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
