import React, { useState } from 'react';
import TheEye from '../the-eye';
import './styles.scss';

export default function TheCode({ html = '', hidden = true }) {
	const [isHidden, toggle] = useState(hidden);
	const switchVisibility = () => toggle(!isHidden);

	return (
		<section className="s-code">
			<h3 className="title">The Code</h3>
			<div className="s-code__item">
				<div className={`b-code${isHidden ? ' __hidden' : ''}`} dangerouslySetInnerHTML={{ __html: html }} />
				{isHidden && <div className="s-code__layer" />}
				<div className="s-code__button" onClick={switchVisibility}>
					<TheEye isActive={!isHidden} />
				</div>
			</div>
		</section>
	);
}
