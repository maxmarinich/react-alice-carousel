```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';


const items = [
	<div className="item">1</div>,
	<div className="item">2</div>,
	<div className="item">3</div>,
	<div className="item">4</div>,
	<div className="item">5</div>,
];

const renderSlideInfo = ({ item, itemsCount }) => {
	return `${item}\\${itemsCount}`;
};

const renderDotsItem = ({ isActive }) => {
	return isActive ? 'X' : '*';
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
