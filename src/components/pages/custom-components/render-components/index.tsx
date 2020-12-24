import React from 'react';

import markdown from './code.md';
import TheCode from '../../../the-code';
import AliceCarousel from '../../../../lib/react-alice-carousel';

const items = [
	<div className="item" data-value="1">
		1
	</div>,
	<div className="item" data-value="2">
		2
	</div>,
	<div className="item" data-value="3">
		3
	</div>,
	<div className="item" data-value="4">
		4
	</div>,
	<div className="item" data-value="5">
		5
	</div>,
];

const renderSlideInfo = ({ item, itemsCount }) => {
	return `${item}\\${itemsCount}`;
};

const renderPrevButton = ({ isDisabled }) => {
	return <span style={{ opacity: isDisabled ? '0.5' : 1 }}>&lt;</span>;
};

const renderNextButton = ({ isDisabled }) => {
	return <span style={{ opacity: isDisabled ? '0.5' : 1 }}>&gt;</span>;
};

const renderPlayPauseButton = ({ isPlaying }) => {
	return isPlaying ? 'PAUSE' : 'PLAY';
};

const renderDotsItem = ({ isActive }) => {
	return isActive ? 'x' : 'o';
};

const RenderComponent = () => {
	return (
		<section className="p-basic s-render-components">
			<AliceCarousel
				mouseTracking
				items={items}
				autoPlayControls
				disableSlideInfo={false}
				renderSlideInfo={renderSlideInfo}
				renderDotsItem={renderDotsItem}
				renderPrevButton={renderPrevButton}
				renderNextButton={renderNextButton}
				renderPlayPauseButton={renderPlayPauseButton}
			/>
			<TheCode html={markdown} />
		</section>
	);
};

export default RenderComponent;
