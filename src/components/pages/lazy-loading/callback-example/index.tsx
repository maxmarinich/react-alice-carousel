import React, { useState } from 'react';

import markdown from './code.md';
import TheCode from '../../../the-code';
import TheLazyLoader from '../../../the-lazy-loader';
import AliceCarousel from '../../../../lib/react-alice-carousel';

const LazyLoadingPage = () => {
	const [, setTimestamp] = useState(0);
	const [activeIndex, setActiveIndex] = useState(0);

	const onLoad = () => setTimestamp(Date.now());
	const onSlideChanged = ({ item }) => setActiveIndex(item);
	const src = (name = '') => `//github.com/maxmarinich/react-alice-carousel/raw/master/src/assets/img/${name}`;

	const items = [
		<TheLazyLoader onLoad={onLoad} src={src('1200x200.jpg')} delay={1000} />,
		<TheLazyLoader onLoad={onLoad} src={src('1200x250.jpg')} delay={5000} />,
		<TheLazyLoader onLoad={onLoad} src={src('1200x300.jpg')} delay={10000} />,
	];

	return (
		<section className="p-basic">
			<div>
				<AliceCarousel autoHeight activeIndex={activeIndex} onSlideChanged={onSlideChanged} items={items} />
			</div>
			<TheCode html={markdown} />
		</section>
	);
};

export default LazyLoadingPage;
