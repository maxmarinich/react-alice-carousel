import React, { useEffect, useState } from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';
import '../../../lib/scss/alice-carousel.scss';

const LazyLoadingPage = () => {
	const [, setTimestamp] = useState(0);
	const [activeIndex, setActiveIndex] = useState(0);

	const onLoad = () => setTimestamp(Date.now());
	const onSlideChanged = ({ item }) => setActiveIndex(item);

	const items = [
		<LazyLoader onLoad={onLoad} src="https://placehold.it/1200x200/C7CDDE/FFFFFF" delay={1000} />,
		<LazyLoader onLoad={onLoad} src="https://placehold.it/1200x250/C7CDDE/FFFFFF" delay={5000} />,
		<LazyLoader onLoad={onLoad} src="https://placehold.it/1200x300/C7CDDE/FFFFFF" delay={10000} />,
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

function LazyLoader(props) {
	let timerId;
	const { src = '', delay = 0, onLoad } = props;
	const [isMounted, setMounted] = useState(false);
	const [isLoading, setLoading] = useState(true);

	function loadImage() {
		const image = new Image();

		image.src = src;
		image.onload = () => {
			setLoading(false);
			onLoad();
		};
	}

	useEffect(() => {
		if (!isMounted) {
			setMounted(true);
			delay ? (timerId = setTimeout(loadImage, delay)) : loadImage();
		}
		return () => clearTimeout(timerId);
	}, []);

	return isLoading ? <div style={{ color: '#435794', height: 150 }}>Loading...</div> : <img width="100%" src={src} />;
}

export default LazyLoadingPage;
