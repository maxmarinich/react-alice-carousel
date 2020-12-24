import React, { useEffect, useState } from 'react';

export default function TheLazyLoader(props) {
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

	return isLoading ? (
		<div style={{ textAlign: 'center', lineHeight: '200px', color: '#435794', height: 200 }}>Loading...</div>
	) : (
		<img width="100%" src={src} />
	);
}
