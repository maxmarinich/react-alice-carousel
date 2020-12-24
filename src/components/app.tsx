import React, { useEffect, useState } from 'react';
import Header from './header';
import Navigation from './navigation';
import getPageComponent from './pages';
import scheme from './scheme';
import '../main.scss';
import '../lib/scss/alice-carousel.scss';

export default function App() {
	const [defaultPage] = scheme;
	const [{ id, title }, setPage] = useState(defaultPage);

	useEffect(() => {
		const { hash = '#' } = window.location;
		const hashId = hash.slice(1);
		const page = scheme.find(({ id }) => id === hashId || hashId.includes(id));

		if (page) setPage(page);
	}, []);

	return (
		<div className="app">
			<Header />
			<Navigation onclick={setPage} scheme={scheme} />
			<main className="s-main">
				<h2 className="title">
					<span>{title} example</span>
				</h2>
				{getPageComponent(id)}
			</main>
		</div>
	);
}
