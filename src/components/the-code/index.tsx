import React from 'react';
import './styles.scss';

export default function theCode({ html = '' }) {
	return (
		<section className="s-code">
			<h2 className="title">The Code</h2>
			<div className="b-code" dangerouslySetInnerHTML={{ __html: html }} />
		</section>
	);
}
