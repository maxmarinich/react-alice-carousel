import React from 'react';
import * as Utils from '../utils';

export const SlideInfo = ({ activeIndex, itemsCount, renderSlideInfo }) => {
	const { item } = Utils.getSlideInfo(activeIndex, itemsCount);

	if (typeof renderSlideInfo === 'function') {
		return <div className="alice-carousel__slide-info">{renderSlideInfo({ item, itemsCount })}</div>;
	}

	return (
		<div className="alice-carousel__slide-info">
			<span className="alice-carousel__slide-info-item">{item}</span>
			<span className="alice-carousel__slide-info-item alice-carousel__slide-info-item--separator">/</span>
			<span className="alice-carousel__slide-info-item">{itemsCount}</span>
		</div>
	);
};
