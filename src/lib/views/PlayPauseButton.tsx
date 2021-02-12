import React from 'react';
import * as Utils from '../utils';
import { Classnames, Modifiers } from '../types';

export const PlayPauseButton = ({ isPlaying, onClick, renderPlayPauseButton }: Props) => {
	if (typeof renderPlayPauseButton === 'function') {
		return (
			<div className={Classnames.PLAY_BTN} onClick={onClick}>
				{renderPlayPauseButton({ isPlaying })}
			</div>
		);
	}

	const classModifier = isPlaying ? Modifiers.PAUSE : '';
	const classnames = Utils.concatClassnames(Classnames.PLAY_BTN_ITEM, classModifier);

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
