import React from 'react';
import GithubIcon from './icons/github';
import './styles.scss';

const Header = () => {
	return (
		<header className="header">
			<div className="header-row">
				<h2 className="logo">
					React Alice Carousel <span className="logo-badge">Demo</span>
				</h2>
				<a
					href="https://github.com/maxmarinich/react-alice-carousel"
					target="_blank"
					rel="noopener noreferrer"
					className="repo-link"
				>
					GitHub&nbsp;
					<GithubIcon />
				</a>
			</div>
		</header>
	);
};

export default Header;
