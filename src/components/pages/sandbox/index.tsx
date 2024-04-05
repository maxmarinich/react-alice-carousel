import React from 'react';
import RouletteExample from './roulette/Roulette';
import Anchor, { genAnchorProps } from '../../the-anchor';

export default function SandboxPage() {
	return (
		<section className="p-basic p-sandbox">
			<h2 className="title">
				<Anchor {...genAnchorProps('sandbox-roulette')} />
				&nbsp; Roulette Animation
			</h2>
			<RouletteExample />
			<br />
			<br />
			<br />
		</section>
	);
}
