```javascript
import React, { useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const items = [
	<div className="item" data-value="1">1</div>,
	<div className="item" data-value="2">2</div>,
	<div className="item" data-value="3">3</div>,
	<div className="item" data-value="4">4</div>,
	<div className="item" data-value="5">5</div>,
];

const thumbItems = (items, [setThumbIndex, setThumbAnimation]) => {
	return items.map((item, i) => (
		<div className="thumb" onClick={() => (setThumbIndex(i), setThumbAnimation(true))}>
			{item}
		</div>
	));
};

const Carousel = () => {
	const [mainIndex, setMainIndex] = useState(0);
	const [mainAnimation, setMainAnimation] = useState(false);
	const [thumbIndex, setThumbIndex] = useState(0);
	const [thumbAnimation, setThumbAnimation] = useState(false);
	const [thumbs] = useState(thumbItems(items, [setThumbIndex, setThumbAnimation]));

	const slideNext = () => {
		if (!thumbAnimation && thumbIndex < thumbs.length - 1) {
			setThumbAnimation(true);
			setThumbIndex(thumbIndex + 1);
		}
	};

	const slidePrev = () => {
		if (!thumbAnimation && thumbIndex > 0) {
			setThumbAnimation(true);
			setThumbIndex(thumbIndex - 1);
		}
	};

	const syncMainBeforeChange = (e) => {
		setMainAnimation(true);
		if (e.type === 'action') {
			setThumbAnimation(true);
		}
	};

	const syncMainAfterChange = (e) => {
		setMainAnimation(false);

		if (e.type === 'action') {
			setThumbIndex(e.item);
			setThumbAnimation(false);
		} else {
			setMainIndex(thumbIndex);
		}
	};

	const syncThumbs = (e) => {
		setThumbIndex(e.item);
		setThumbAnimation(false);

		if (!mainAnimation) {
			setMainIndex(e.item);
		}
	};

    return [
       <AliceCarousel
            activeIndex={mainIndex}
            animationType="fadeout"
            animationDuration={800}
            disableDotsControls
            disableButtonsControls
            infinite
            items={items}
            mouseTracking={!thumbAnimation}
            onSlideChange={syncMainBeforeChange}
            onSlideChanged={syncMainAfterChange}
            touchTracking={!thumbAnimation}
       />,
       <div className="thumbs">
           <AliceCarousel
                activeIndex={thumbIndex}
                autoWidth
                disableDotsControls
                disableButtonsControls
                items={thumbs}
                mouseTracking={false}
                onSlideChanged={syncThumbs}
                touchTracking={!mainAnimation}
           />
           <div className="btn-prev" onClick={slidePrev}>&lang;</div>
           <div className="btn-next" onClick={slideNext}>&rang;</div>
       </div>
    ]
};
```
