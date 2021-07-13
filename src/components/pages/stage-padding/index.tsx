import React from 'react';
import PercentsExample from './percents';
import BaseExample from './base-padding';
import Anchor, { genAnchorProps } from '../../the-anchor';

const StagePaddingPage = () => {
	return (
		<section className="p-basic p-custom">
			<h2 className="title">
				<Anchor {...genAnchorProps('stage-padding')} />
				&nbsp; Base
			</h2>
			<BaseExample />
			<br />
			<br />
			<br />
			<h2 className="title">
				<Anchor {...genAnchorProps('stage-padding-percents')} />
				&nbsp; Percents
			</h2>
			<PercentsExample />
			<br />
			<br />
			<br />
		</section>
	);
};

export default StagePaddingPage;
