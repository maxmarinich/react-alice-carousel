import React from 'react';

import markdown from './code.md';
import TheCode from '../../../the-code';
import AliceCarousel, { Link } from '../../../../lib/react-alice-carousel';

const Links = () => {
	const href = '//github.com/maxmarinich/react-alice-carousel';
	const src = '//github.com/maxmarinich/react-alice-carousel/raw/master/src/assets/img/1200x200.jpg';

	return (
		<section className="p-basic">
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
			<TheCode html={markdown} />
		</section>
	);
};

export default Links;
