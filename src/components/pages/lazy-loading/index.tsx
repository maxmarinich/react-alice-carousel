import React, { useState } from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import TheLazyLoader from '../../the-lazy-loader';
import AliceCarousel from '../../../lib/react-alice-carousel';
import '../../../lib/scss/alice-carousel.scss';

const LazyLoadingPage = () => {
	const [, setTimestamp] = useState(0);
	const [activeIndex, setActiveIndex] = useState(0);

	const onLoad = () => setTimestamp(Date.now());
	const onSlideChanged = ({ item }) => setActiveIndex(item);

	const items = [
		<TheLazyLoader onLoad={onLoad} src="https://placehold.it/1200x200/C7CDDE/FFFFFF" delay={1000} />,
		<TheLazyLoader onLoad={onLoad} src="https://placehold.it/1200x250/C7CDDE/FFFFFF" delay={5000} />,
		<TheLazyLoader onLoad={onLoad} src="https://placehold.it/1200x300/C7CDDE/FFFFFF" delay={10000} />,
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
