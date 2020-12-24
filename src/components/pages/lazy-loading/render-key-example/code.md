```javascript
import React, { useState, useEffect } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const Carousel = () => {
	const [key, setKey] = useState(0);
	const [items] = useState([
		<LazyLoader onLoad={onLoad} src="https://placehold.it/1200x200/C7CDDE/FFFFFF" delay={1000} />,
		<LazyLoader onLoad={onLoad} src="https://placehold.it/1200x250/C7CDDE/FFFFFF" delay={5000} />,
		<LazyLoader onLoad={onLoad} src="https://placehold.it/1200x300/C7CDDE/FFFFFF" delay={10000} />,
	]);

	function onLoad() {
		setKey(Date.now());
	}

	return (
      <AliceCarousel autoHeight renderKey={key} items={items} />
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

	return isLoading ? <div>Loading...</div> : <img width="100%" src={src} />;
}
```
