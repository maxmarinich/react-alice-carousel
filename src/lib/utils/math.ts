import { State, Props, ItemCoords } from '../types';

export const getShiftIndex = (itemsInSlide = 0, itemsOffset = 0) => {
	return itemsInSlide + itemsOffset;
};

export const getStartIndex = (index = 0, itemsCount = 0) => {
	if (itemsCount) {
		// TODO: refactoring
		if (index >= itemsCount) {
			return itemsCount - 1;
		}
		if (index > 0) {
			return index;
		}
	}
	return 0;
};

export const getActiveIndex = ({ startIndex = 0, itemsCount = 0, /*itemsInSlide = 1,*/ infinite = false }) => {
	// TODO: refactoring
	// if (itemsCount && itemsInSlide > 1) {
	// 	return Math.min(startIndex, itemsCount - itemsInSlide);
	// }

	if (infinite) {
		return startIndex;
	}

	return getStartIndex(startIndex, itemsCount);
};

export const getUpdateSlidePositionIndex = (activeIndex: number, itemsCount: number) => {
	if (activeIndex < 0) return itemsCount - 1;
	if (activeIndex >= itemsCount) return 0;

	return activeIndex;
};

export const shouldRecalculateSlideIndex = (activeIndex, itemsCount) => {
	return activeIndex < 0 || activeIndex >= itemsCount;
};

export const shouldCancelSlideAnimation = (activeIndex, itemsCount) => {
	return activeIndex < 0 || activeIndex >= itemsCount;
};

export const getSwipeLimitMin = (state: Partial<State>, props: Partial<Props>) => {
	const { itemsOffset = 0, transformationSet = [] } = state;
	const { infinite, swipeExtraPadding = 0 } = props;

	if (infinite) {
		const { position } = transformationSet[itemsOffset] || {};
		return position;
	}

	const { width = 0 } = transformationSet[0] || {};
	return Math.min(swipeExtraPadding, width);
};

export const getSwipeLimitMax = (state: Partial<State>, props: Partial<Props>) => {
	const { infinite, swipeExtraPadding = 0 } = props;
	const { itemsCount = 1, itemsOffset = 0, itemsInSlide = 1, transformationSet = [] } = state;

	if (infinite) {
		const cursor = itemsCount + getShiftIndex(itemsInSlide, itemsOffset);
		return (transformationSet[cursor] || {}).position || 0;
	}

	const { position } = getItemCoords(-itemsInSlide, transformationSet);
	return position + swipeExtraPadding;
};

export const shouldRecalculateSwipePosition = (currentPosition, minPosition, maxPosition) => {
	return currentPosition >= -minPosition || Math.abs(currentPosition) >= maxPosition;
};

export const getIsLeftDirection = (deltaX = 0) => deltaX < 0;

export const getItemCoords = (cursor = 0, transformationSet: ItemCoords[] = []) => {
	const [item] = transformationSet.slice(cursor);
	return item || { position: 0, width: 0 };
};

export const getSwipeShiftValue = (cursor = 0, transformationSet: ItemCoords[] = []) => {
	const { position } = getItemCoords(cursor, transformationSet);
	return position;
};

export const getTransformationItemIndex = (transformationSet: ItemCoords[] = [], position = 0) => {
	return transformationSet.findIndex((item) => item.position >= Math.abs(position));
};

export const getSwipeTransformationCursor = (transformationSet: ItemCoords[] = [], position = 0, deltaX = 0) => {
	const cursor = getTransformationItemIndex(transformationSet, position);
	return getIsLeftDirection(deltaX) ? cursor : cursor - 1;
};

export const getSwipeTouchendPosition = (state: State, deltaX: number, swipePosition = 0) => {
	const { infinite, autoWidth, isStageContentPartial, swipeAllowedPositionMax, transformationSet } = state;
	const cursor = getSwipeTransformationCursor(transformationSet, swipePosition, deltaX);
	const { position } = getItemCoords(cursor, transformationSet);

	if (!infinite) {
		if (autoWidth && isStageContentPartial) {
			return 0;
		}

		if (position > swipeAllowedPositionMax) {
			return -swipeAllowedPositionMax;
		}
	}

	return -position;
};

export const getSwipeTouchendIndex = (position, state: State) => {
	const {
		transformationSet,
		itemsInSlide,
		itemsOffset,
		itemsCount,
		infinite,
		isStageContentPartial,
		activeIndex,
		translate3d,
	} = state;

	if (!infinite) {
		if (isStageContentPartial || translate3d === Math.abs(position)) {
			return activeIndex;
		}
	}

	const index = getTransformationItemIndex(transformationSet, position);

	if (infinite) {
		const shiftIndex = getShiftIndex(itemsInSlide, itemsOffset);

		if (index < shiftIndex) {
			return itemsCount - itemsInSlide - itemsOffset + index;
		} else if (index >= shiftIndex + itemsCount) {
			return index - (shiftIndex + itemsCount);
		} else {
			return index - shiftIndex;
		}
	}

	return index;
};

export const getFadeoutAnimationIndex = (state: State) => {
	const { infinite, activeIndex, itemsInSlide } = state;
	return infinite ? activeIndex + itemsInSlide : activeIndex;
};

export const getFadeoutAnimationPosition = (nextIndex, state: State) => {
	const { activeIndex, stageWidth } = state;

	if (nextIndex < activeIndex) {
		return (activeIndex - nextIndex) * -stageWidth || 0;
	} else {
		return (nextIndex - activeIndex) * stageWidth || 0;
	}
};

export const isVerticalTouchmoveDetected = (absX: number, absY: number, swipeDelta = 0) => {
	return absX < swipeDelta || absY * 0.1 > absX;
};
