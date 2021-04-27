import React from 'react';
import * as Utils from '../utils';
import { Classnames, Modifiers } from '../types';

export const PrevNextButton = ({ name, isDisabled, onClick, renderPrevButton, renderNextButton, buttonControls }: Props) => {
	if (typeof renderPrevButton === 'function') {
		return (
			<div className={Classnames.BUTTON_PREV} onClick={onClick}>
				{renderPrevButton({ isDisabled })}
			</div>
		);
	}

	if (typeof renderNextButton === 'function') {
		return (
			<div className={Classnames.BUTTON_NEXT} onClick={onClick}>
				{renderNextButton({ isDisabled })}
			</div>
		);
	}

	const isPreviews = name === 'prev';
	const ariaValue = isPreviews ? '<' : '>';
	const buttonClasses = isPreviews ? Classnames.BUTTON_PREV : Classnames.BUTTON_NEXT;
	const buttonWrapperClasses = isPreviews ? Classnames.BUTTON_PREV_WRAPPER : Classnames.BUTTON_NEXT_WRAPPER;
	const buttonItemClasses = isPreviews ? Classnames.BUTTON_PREV_ITEM : Classnames.BUTTON_NEXT_ITEM;
	const buttonItemModifierClasses = isDisabled ? Modifiers.INACTIVE : '';
	const classnames = Utils.concatClassnames(buttonItemClasses, buttonItemModifierClasses);

	const renderRegularControls = () => (
		<div className={buttonClasses}>
			<div className={buttonWrapperClasses}>
				<p className={classnames} 
					onClick={onClick}
				>
					<span data-area={ariaValue} />
				</p>
			</div>
		</div>
	);

	const renderAriaControls = () => (
		<div className={buttonClasses}>
			<div className={buttonWrapperClasses} aria-controls="alice-carousel">
				<button className={classnames} 
					onClick={onClick} 
					aria-label={`${name} slide`}
				>
					<span data-area={ariaValue} />
				</button>
			</div>
		</div>
	);

	return buttonControls ? renderAriaControls() : renderRegularControls();
};

type Props = {
	name: 'prev' | 'next';
	isDisabled: boolean;
	buttonControls?: boolean;
	onClick: (e) => void;
	renderPrevButton?: ({ isDisabled }) => any;
	renderNextButton?: ({ isDisabled }) => any;
};
