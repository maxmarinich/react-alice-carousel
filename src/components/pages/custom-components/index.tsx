import React from 'react';
import RenderExample from './render-components';
import RefsExample from './refs-components';
import PropsExample from './props-components';
import Anchor, { genAnchorProps } from '../../the-anchor';

const StagePaddingPage = () => {
	return (
		<section className="p-basic">
			<h2 className="title">
				<Anchor {...genAnchorProps('custom-components-render')} />
				&nbsp; Render functions
			</h2>
			<RenderExample />
			<br />
			<br />
			<br />
			<h2 className="title">
				<Anchor {...genAnchorProps('custom-components-refs')} />
				&nbsp; Refs
			</h2>
			<RefsExample />
			<br />
			<br />
			<br />
			<h2 className="title">
				<Anchor {...genAnchorProps('custom-components-props')} />
				&nbsp; Props
			</h2>
			<PropsExample />
		</section>
	);
};

export default StagePaddingPage;
