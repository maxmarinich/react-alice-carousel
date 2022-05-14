import React from 'react';
import { Classnames, Modifiers } from '../types';
import { concatClassnames } from '../utils';

export const PlayPauseButton = ({ isPlaying, onClick, renderPlayPauseButton }: Props) => {
	if (typeof renderPlayPauseButton === 'function') {
		return (
			<div className={Classnames.PLAY_BTN} onClick={onClick}>
				{renderPlayPauseButton({ isPlaying })}
			</div>
		);
	}

	const classModifier = isPlaying ? Modifiers.PAUSE : '';
	const classnames = concatClassnames(Classnames.PLAY_BTN_ITEM, classModifier);

	return (
		<div className={Classnames.PLAY_BTN}>
			<div className={Classnames.PLAY_BTN_WRAPPER}>
				<div onClick={onClick} className={classnames} />
			</div>
		</div>
	);
};

type Props = {
	isPlaying: boolean;
	onClick: (e) => void;
	renderPlayPauseButton?: ({ isPlaying }) => any;
};
