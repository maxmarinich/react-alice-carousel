import React from 'react';

export const PrevNextButton = ({ name, isDisabled, onClick, renderPrevButton, renderNextButton }: Props) => {
	const className = `alice-carousel__${name}-btn-item${isDisabled ? ' __inactive' : ''}`;

	if (typeof renderPrevButton === 'function') {
		return (
			<div className={`alice-carousel__${name}-btn`} onClick={onClick}>
				{renderPrevButton({ isDisabled })}
			</div>
		);
	}

	if (typeof renderNextButton === 'function') {
		return (
			<div className={`alice-carousel__${name}-btn`} onClick={onClick}>
				{renderNextButton({ isDisabled })}
			</div>
		);
	}

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
	isDisabled: boolean;
	onClick: (e) => void;
	renderPrevButton?: ({ isDisabled }) => any;
	renderNextButton?: ({ isDisabled }) => any;
};
