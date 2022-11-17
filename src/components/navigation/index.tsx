import React from 'react';
import './styles.scss';

const setHash = (hash = '') => {
	try {
		history.pushState ? history.pushState(null, '', hash) : (location.hash = hash);
	} catch (e) {
		//
	}
};

type Scheme = { id: string; title: string };
type Props = { onclick: (i: Scheme) => void; scheme: Scheme[] };
const Navigation = ({ onclick, scheme }: Props) => {
	return scheme.length > 1 ? (
		<nav className="navigation">
			{scheme.map(({ id, title }) => {
				return (
					<a
						href={`/#${id}`}
						key={id}
						className="navigation-item"
						onClick={(e) => {
							e.preventDefault();
							setHash(`#${id}`);
							onclick({ id, title });
						}}
					>
						{title}
					</a>
				);
			})}
		</nav>
	) : null;
};

export default Navigation;
