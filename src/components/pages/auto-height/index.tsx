import React from 'react';

import markdown from './code.md';
import TheCode from '../../the-code';
import AliceCarousel from '../../../lib/react-alice-carousel';
import './styles..scss';

const itemsLength = Array.from({ length: 5 });

const items = itemsLength.map((item, index) => {
	const style = { height: 200 + index * 10 };
	return <div className="item" style={style} data-value={index + 1} />;
});

const AutoheightPage = () => {
	return (
		<section className="p-basic p-autoheight">
			<AliceCarousel autoHeight infinite mouseTracking items={items} />
			<TheCode html={markdown} />
		</section>
	);
};

export default AutoheightPage;
