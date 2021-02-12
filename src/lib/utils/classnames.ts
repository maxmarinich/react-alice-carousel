import * as Utils from '.';
import { State, Classnames, Modifiers } from '../types';

export const getRenderStageItemClasses = (i = 0, state: State) => {
	const { fadeoutAnimationIndex } = state;
	const isActive = isActiveItem(i, state) ? Modifiers.ACTIVE : '';
	const isCloned = isClonedItem(i, state) ? Modifiers.CLONED : '';
	const isTarget = isTargetItem(i, state) ? Modifiers.TARGET : '';
	const isAnimated = i === fadeoutAnimationIndex ? Classnames.ANIMATED : '';

	return Utils.concatClassnames(Classnames.STAGE_ITEM, isActive, isCloned, isTarget, isAnimated);
};

export const isActiveItem = (i = 0, state: State) => {
	const { activeIndex, itemsInSlide, itemsOffset, infinite, autoWidth } = state;
	const shiftIndex = Utils.getShiftIndex(itemsInSlide, itemsOffset);

	if (autoWidth && infinite) {
		return i - shiftIndex === activeIndex + itemsOffset;
	}

	const index = activeIndex + shiftIndex;

	// TODO !infinite
	if (!infinite) {
		return i >= activeIndex && i < index;
	}

	return i >= index && i < index + itemsInSlide;
};

export const isTargetItem = (i = 0, state: State) => {
	const { activeIndex, itemsInSlide, itemsOffset, infinite, autoWidth } = state;
	const shiftIndex = Utils.getShiftIndex(itemsInSlide, itemsOffset);

	if (!infinite) {
		return i === activeIndex;
	}

	if (autoWidth && infinite) {
		return i - shiftIndex === activeIndex + itemsOffset;
	}

	return i === activeIndex + shiftIndex;
};

export const isClonedItem = (i = 0, state: State) => {
	const { itemsInSlide, itemsOffset, itemsCount, infinite, autoWidth } = state;

	if (!infinite) {
		return false;
	}

	if (autoWidth && infinite) {
		return i < itemsInSlide || i > itemsCount - 1 + itemsInSlide;
	}

	const shiftIndex = Utils.getShiftIndex(itemsInSlide, itemsOffset);
	return i < shiftIndex || i > itemsCount - 1 + shiftIndex;
};
