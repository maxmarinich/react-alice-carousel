import React from 'react';

export const PrevNextButton = ({ name, disabled, onClick }: Props) => {
	const className = `alice-carousel__${name}-btn-item${disabled ? ' __inactive' : ''}`;

	return (
		<div className={`alice-carousel__${name}-btn`}>
			<div className={`alice-carousel__${name}-btn-wrapper`}>
				<p className={className} onClick={onClick}>
					<span data-area={name === 'prev' ? '<' : '>'} />
				</p>
			</div>
		</div>
	);
};

type Props = {
	name: 'prev' | 'next';
	disabled: boolean;
	onClick: (e) => void;
};
