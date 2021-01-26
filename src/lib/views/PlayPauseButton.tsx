import React from 'react';
import { Classnames, Modifiers } from '../types';

export const PlayPauseButton = ({ isPlaying, onClick, renderPlayPauseButton }: Props) => {
	if (typeof renderPlayPauseButton === 'function') {
		return (
			<div className={Classnames.PLAY_BTN} onClick={onClick}>
				{renderPlayPauseButton({ isPlaying })}
			</div>
		);
	}

	const classname = `${Classnames.PLAY_BTN_ITEM}`;
	const classModifier = `${isPlaying ? ` ${Modifiers.PAUSE}` : ''}`;

	return (
		<div className={Classnames.PLAY_BTN}>
			<div className={Classnames.PLAY_BTN_WRAPPER}>
				<div onClick={onClick} className={`${classname}${classModifier}`} />
			</div>
		</div>
	);
};

type Props = {
	isPlaying: boolean;
	onClick: (e) => void;
	renderPlayPauseButton?: ({ isPlaying }) => any;
};
