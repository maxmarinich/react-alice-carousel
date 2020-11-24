```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const items = [
	<div className="item" data-value="1">1</div>,
	<div className="item" data-value="2">2</div>,
	<div className="item" data-value="3">3</div>,
	<div className="item" data-value="4">4</div>,
	<div className="item" data-value="5">5</div>,
];

const renderSlideInfo = ({ item, itemsCount }) => {
	return `${item}\\${itemsCount}`;
};

const renderDotsItem = ({ isActive }) => {
	return isActive ? 'x' : 'o';
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

const Carousel = () => (
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
);
```
