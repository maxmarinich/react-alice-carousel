import React from 'react';
import BaseExample from './base';
import InfiniteExample from './infinite';
import Anchor, { genAnchorProps } from '../../the-anchor';

const CustomComponentsPage = () => {
	return (
		<section className="p-basic p-custom">
			<h2 className="title">
				<Anchor {...genAnchorProps('auto-width')} />
				&nbsp; Base
			</h2>
			<BaseExample />
			<br />
			<br />
			<br />
			<h2 className="title">
				<Anchor {...genAnchorProps('auto-width-infinite')} />
				&nbsp; Infinite
			</h2>
			<InfiniteExample />
		</section>
	);
};

export default CustomComponentsPage;
