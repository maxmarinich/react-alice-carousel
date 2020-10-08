import React from 'react';
import * as Utils from '../utils';

export const SlideInfo = ({ activeIndex, slidesLength }) => {
	const info = Utils.getSlideInfo(activeIndex, slidesLength);

	return (
		<div className="alice-carousel__slide-info">
			<span className="alice-carousel__slide-info-item">{info.slideIndex}</span>
			<span className="alice-carousel__slide-info-item alice-carousel__slide-info-item--separator">/</span>
			<span className="alice-carousel__slide-info-item">{info.slidesLength}</span>
		</div>
	);
};
