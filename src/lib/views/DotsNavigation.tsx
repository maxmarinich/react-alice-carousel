import React, { MouseEventHandler } from 'react';

import { State, Classnames, Modifiers } from '../types';
import {
	checkIsTheLastDotIndex,
	concatClassnames,
	getActiveSlideIndex, getDotsNavigationLength,
	getItemIndexForDotNavigation,
	getSlideItemInfo,
} from '../utils';

export const DotsNavigation = ({
	state,
	onClick,
	onMouseEnter,
	onMouseLeave,
	controlsStrategy,
	renderDotsItem,
}: Props) => {
	const { itemsCount, itemsInSlide, infinite, autoWidth, activeIndex } = state;
	const { isNextSlideDisabled } = getSlideItemInfo(state);
	const hasDotForEachSlide = hasDotForEachSlide(autoWidth, controlsStrategy);
	const dotsLength = getDotsNavigationLength(itemsCount, itemsInSlide, hasDotForEachSlide);

	return (
		<ul className={Classnames.DOTS}>
			{Array.from({ length: itemsCount }).map((item, i) => {
				if (i < dotsLength) {
					// TODO check, refactoring

					const isTheLastDotIndex = checkIsTheLastDotIndex(i, Boolean(infinite), dotsLength);
					let nextIndex = getItemIndexForDotNavigation(i, isTheLastDotIndex, itemsCount, itemsInSlide);
					let currentIndex = getActiveSlideIndex(isNextSlideDisabled, state);

					if (hasDotForEachSlide) {
						currentIndex = activeIndex;

						if (activeIndex < 0) {
							currentIndex = itemsCount - 1;
						} else if (activeIndex >= itemsCount) {
							currentIndex = 0;
						}
						nextIndex = i;
					}

					const isActive = currentIndex === i ? Modifiers.ACTIVE : '';
					const isCustom = renderDotsItem ? Modifiers.CUSTOM : '';
					const classname = concatClassnames(Classnames.DOTS_ITEM, isActive, isCustom);

					return (
						<li
							key={`dot-item-${i}`}
							onMouseEnter={onMouseEnter}
							onMouseLeave={onMouseLeave}
							onClick={() => onClick(nextIndex)}
							className={classname}
						>
							{renderDotsItem && renderDotsItem({ isActive, activeIndex: i })}
						</li>
					);
				}
			})}
		</ul>
	);
};

type Props = {
	state: State;
	controlsStrategy?: string;
	onClick: (index: number) => void;
	onMouseEnter?: MouseEventHandler;
	onMouseLeave?: MouseEventHandler;
	renderDotsItem?: ({ isActive, activeIndex }) => any;
};
