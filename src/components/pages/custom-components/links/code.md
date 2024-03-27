```javascript
import React from 'react';
import AliceCarousel, { Link } from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const href = '//github.com/maxmarinich/react-alice-carousel';
const src = '//github.com/maxmarinich/react-alice-carousel/raw/master/src/assets/img/1200x200.jpg';

const Carousel = () => (
	<AliceCarousel mouseTracking>
		<Link href={href} target="_blank" className="link">
			<img src={src} alt="" />
		</Link>
		<Link href={href} target="_blank" className="link">
			<img src={src} alt="" />
		</Link>
		<Link href={href} target="_blank" className="link">
			<img src={src} alt="" />
		</Link>
	</AliceCarousel>
);
```
