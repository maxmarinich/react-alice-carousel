import React from 'react';
import Anchor from '../../the-anchor';
import RenderExample from './render-components';
import RefsExample from './refs-components';
import PropsExample from './props-components';

const genAnchor = (str = '') => {
	const anchorString = `custom-components${str}`;
	return {
		anchor: `#${anchorString}`,
		id: anchorString,
	};
};

const StagePaddingPage = () => {
	return (
		<section className="p-basic">
			<h2 className="title">
				<Anchor {...genAnchor('-render')} />
				&nbsp; Render functions
			</h2>
			<RenderExample />
			<br />
			<br />
			<br />
			<h2 className="title">
				<Anchor {...genAnchor('-refs')} />
				&nbsp; Refs
			</h2>
			<RefsExample />
			<br />
			<br />
			<br />
			<h2 className="title">
				<Anchor {...genAnchor('-props')} />
				&nbsp; Props
			</h2>
			<PropsExample />
		</section>
	);
};

export default StagePaddingPage;
