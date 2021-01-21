import React from 'react';
import CallbackExample from './callback-example';
import RenderKeyExample from './render-key-example';
import Anchor, { genAnchorProps } from '../../the-anchor';

const LazyLoadingPage = () => {
	return (
		<section className="p-basic p-lazy">
			<h2 className="title">
				<Anchor {...genAnchorProps('lazy-loading-callback-function')} />
				&nbsp; Callback function
			</h2>
			<CallbackExample />
			<br />
			<br />
			<br />
			<h2 className="title">
				<Anchor {...genAnchorProps('lazy-loading-render-key')} />
				&nbsp; Render key
			</h2>
			<RenderKeyExample />
		</section>
	);
};

export default LazyLoadingPage;
