import React, { useEffect, useState } from 'react';

export default function TheLazyLoader(props: any) {
	let timerId: ReturnType<typeof setTimeout>;
	const minHeight = 200;
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

	return isLoading ? (
		<div style={{ textAlign: 'center', lineHeight: '200px', color: '#435794', height: minHeight }}>Loading...</div>
	) : (
		<img width="100%" style={{ minHeight }} src={src} />
	);
}
