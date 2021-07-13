import React, { useEffect, useState, useRef, Ref } from 'react';

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

const PercentsPaddingPage = () => {
	const percent = 0.3;
	const [padding, setPadding] = useState(0);
	const section: Ref<HTMLElement> = useRef(null);

	const syncState = () => {
		const { current } = section;

		if (current) {
			setPadding(current.offsetWidth * percent);
		}
	};

	useEffect(syncState, []);

	return (
		<section className="p-basic p-padding-percents" ref={section}>
			<AliceCarousel
				mouseTracking
				infinite
				items={items}
				paddingRight={padding}
				onResized={syncState}
			/>
			<TheCode html={markdown} />
		</section>
	);
};

export default PercentsPaddingPage;
