```javascript
import React, { useState, useEffect } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const Carousel = () => {
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
	  <AliceCarousel 
        autoHeight 
        activeIndex={activeIndex} 
        onSlideChanged={onSlideChanged} 
        items={items}
      />
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
		image.onerror = () => {
			setLoading(false);
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
