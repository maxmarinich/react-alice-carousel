import React from 'react';

export const PlayPauseButton = ({ isPlaying, onClick, renderPlayPauseButton }: Props) => {
	if (typeof renderPlayPauseButton === 'function') {
		return (
			<div className="alice-carousel__play-btn" onClick={onClick}>
				{renderPlayPauseButton({ isPlaying })}
			</div>
		);
	}

	return (
		<div className="alice-carousel__play-btn">
			<div className="alice-carousel__play-btn-wrapper">
				<div onClick={onClick} className={`alice-carousel__play-btn-item${isPlaying ? ' __pause' : ''}`} />
			</div>
		</div>
	);
};

type Props = {
	isPlaying: boolean;
	onClick: (e) => void;
	renderPlayPauseButton?: ({ isPlaying }) => any;
};
