```javascript
import React, { useRef } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const items = [
	<div className="item" data-value="1">1</div>,
	<div className="item" data-value="2">2</div>,
	<div className="item" data-value="3">3</div>,
	<div className="item" data-value="4">4</div>,
	<div className="item" data-value="5">5</div>,
];

const Carousel = () => {
  const carousel = useRef<AliceCarousel>(null);
  
  return [
    <AliceCarousel
      key="carousel"
      mouseTracking
      disableDotsControls
      disableButtonsControls
      items={items}
      ref={carousel}
    />,
    <nav key="nav" className="b-refs-navs">
      {items.map((item, i) => {
        return <span key={i} onClick={() => carousel?.current?.slideTo(i)} />;
      })}
    </nav>,
    <div key="btns" className="b-refs-buttons">
      <button onClick={(e) => carousel?.current?.slidePrev(e)}>Prev</button>
      <button onClick={(e) => carousel?.current?.slideNext(e)}>Next</button>
    </div>
  ]
};
```
