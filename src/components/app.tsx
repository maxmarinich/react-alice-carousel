import React, { useEffect, useState } from 'react';
import Header from './header';
import Navigation from './navigation';
import getPageComponent from './pages';
import scheme from './scheme';
import { scrollTo } from '../hooks/useScroll';
import '../main.scss';
import '../lib/scss/alice-carousel.scss';

export default function App() {
	const [defaultPage] = scheme;
	const [page, setPage] = useState(defaultPage);

	useEffect(() => {
		const { hash = '#' } = window.location;
		const hashId = hash.slice(1);
		const page = scheme.find(({ id }) => id === hashId || hashId.includes(id));

		if (page) setPage(page);

		requestAnimationFrame(() => {
			if (hash.length > 1) {
				scrollTo(hash);
			}
		});
	}, [page]);

	return (
		<div className="app">
			<Header />
			<Navigation onclick={setPage} scheme={scheme} />
			<main className="s-main">
				<h2 className="title">
					<span>{page.title} example</span>
				</h2>
				{getPageComponent(page.id)}
			</main>
		</div>
	);
}
