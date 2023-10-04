import React from 'react';

import Anchor, { genAnchorProps } from '../../the-anchor';
import ChangeEventsExample from './change-events';
import UpdateEventsExample from './update-events';

const EventsComponentsPage = () => {
	return (
		<section className="p-basic p-custom">
			<h2 className="title">
				<Anchor {...genAnchorProps('events')} />
				&nbsp; Base Events
			</h2>
			<UpdateEventsExample />
			<br />
			<br />
			<br />
			<h2 className="title">
				<Anchor {...genAnchorProps('events-change')} />
				&nbsp; Change Events
			</h2>
			<ChangeEventsExample />
		</section>
	);
};

export default EventsComponentsPage;
