import React from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';
import '../../../lib/scss/alice-carousel.scss';

const renderSlideInfo = ({ item, itemsCount }) => {
	return `${item}\\${itemsCount}`;
};

const renderPrevButton = ({ isDisabled }) => {
	return <span style={{ opacity: isDisabled ? '0.5' : 1 }}>prev</span>;
};

const renderNextButton = ({ isDisabled }) => {
	return <span style={{ opacity: isDisabled ? '0.5' : 1 }}>next</span>;
};

const renderPlayPauseButton = ({ isPlaying }) => {
	return isPlaying ? 'PAUSE' : 'PLAY';
};

const renderDotsItem = ({ isActive }) => {
	return isActive ? 'X' : '*';
};

const StagePaddingPage = () => {
	return (
		<section className="p-basic">
			<AliceCarousel
				mouseTracking
				autoPlayControls
				disableSlideInfo={false}
				renderSlideInfo={renderSlideInfo}
				renderDotsItem={renderDotsItem}
				renderPrevButton={renderPrevButton}
				renderNextButton={renderNextButton}
				renderPlayPauseButton={renderPlayPauseButton}
			>
				<div className="item">
					<h1>1</h1>
				</div>
				<div className="item">
					<h1>2</h1>
				</div>
				<div className="item">
					<h1>3</h1>
				</div>
				<div className="item">
					<h1>4</h1>
				</div>
				<div className="item">
					<h1>5</h1>
				</div>
			</AliceCarousel>
			<TheCode html={markdown} />
		</section>
	);
};

export default StagePaddingPage;
