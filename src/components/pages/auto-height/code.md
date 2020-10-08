```javascript
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const itemsLength = Array.from({ length: 5 });

const items = itemsLength.map((item, index) => {
    const style = { height: 200 + index * 10 };
	return (<div className="item" style={style}>{index + 1}</div>);
});

const Carousel = () => (
    <AliceCarousel
        autoHeight  
        infinite
        mouseTracking
        items={items}
    />
);
```
