import { State } from '../types';
import * as Utils from '.';

export const getRenderStageItemClasses = (i = 0, state: State) => {
	const { fadeoutAnimationIndex } = state;
	const isActive = isActiveItem(i, state) ? ' __active' : '';
	const isCloned = isClonedItem(i, state) ? ' __cloned' : '';
	const isAnimated = i === fadeoutAnimationIndex ? ' animated animated-out fadeOut' : '';

	return 'alice-carousel__stage-item' + isActive + isCloned + isAnimated;
};

export const isActiveItem = (i = 0, state: State) => {
	const { activeIndex, itemsInSlide, itemsOffset, infinite, autoWidth } = state;
	const shiftIndex = Utils.getShiftIndex(itemsInSlide, itemsOffset);

	if (infinite && autoWidth) {
		return i - shiftIndex === activeIndex + itemsOffset;
	}

	const index = activeIndex + shiftIndex;

	// TODO !infinite
	if (!infinite) {
		return i >= activeIndex && i < index;
	}

	return i >= index && i < index + itemsInSlide;
};

export const isClonedItem = (i = 0, state: State) => {
	const { itemsInSlide, itemsOffset, itemsCount, infinite, autoWidth } = state;

	if (!infinite) {
		return false;
	}

	if (infinite && autoWidth) {
		return i < itemsInSlide || i > itemsCount - 1 + itemsInSlide;
	}

	const shiftIndex = Utils.getShiftIndex(itemsInSlide, itemsOffset);
	return i < shiftIndex || i > itemsCount - 1 + shiftIndex;
};
