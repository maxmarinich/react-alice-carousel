import { useEffect } from 'react';

export const scrollTo = (selector = '', behavior: ScrollBehavior = 'smooth') => {
	const section = document.querySelector(selector);
	if (section) {
		section.scrollIntoView({ behavior, block: 'start' });
	}
};

export default function UseScroll() {
	useEffect(() => {
		scrollTo('#root');
	}, []);

	return null;
}
