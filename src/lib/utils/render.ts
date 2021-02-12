import { State } from '../types';

export const getActiveSlideIndex = (isNextSlideDisabled, state: State) => {
	const { activeIndex: index, itemsInSlide, itemsCount } = state || {};
	const activeIndex = index + itemsInSlide;

	return itemsInSlide === 1
		? getSlideIndexForNonMultipleItems(activeIndex, itemsInSlide, itemsCount)
		: getSlideIndexForMultipleItems(activeIndex, itemsInSlide, itemsCount, isNextSlideDisabled);
};

export const getActiveSlideDotsLength = (slidesLength = 0, itemsInSlide = 1) => {
	if (slidesLength && itemsInSlide) {
		const dots = Math.floor(slidesLength / itemsInSlide);
		return slidesLength % itemsInSlide === 0 ? dots - 1 : dots;
	}
	return 0;
};

export const getSlideIndexForNonMultipleItems = (activeIndex, itemsInSlide, slidesLength) => {
	if (activeIndex < itemsInSlide) return slidesLength - itemsInSlide;
	if (activeIndex > slidesLength) return 0;
	return activeIndex - 1;
};

export const getSlideIndexForMultipleItems = (activeIndex, itemsInSlide, slidesLength, isNextSlideDisabled) => {
	const dotsLength = getActiveSlideDotsLength(slidesLength, itemsInSlide);

	if (activeIndex === slidesLength + itemsInSlide) return 0;
	if (isNextSlideDisabled || (activeIndex < itemsInSlide && activeIndex !== 0)) return dotsLength;
	if (activeIndex === 0) {
		return slidesLength % itemsInSlide === 0 ? dotsLength : dotsLength - 1;
	}

	return itemsInSlide > 0 ? Math.floor(activeIndex / itemsInSlide) - 1 : 0;
};

export const getSlideInfo = (activeIndex = 0, itemsCount = 0) => {
	let item = activeIndex + 1;

	if (item < 1) {
		item = itemsCount;
	} else if (item > itemsCount) {
		item = 1;
	}

	return { item, itemsCount };
};

export const getSlideItemInfo = (state: State) => {
	const { itemsInSlide, activeIndex, infinite, itemsCount, isStageContentPartial } = state || {};

	if (isStageContentPartial) {
		return { isPrevSlideDisabled: true, isNextSlideDisabled: true };
	}

	const isPrevSlideDisabled = infinite === false && activeIndex === 0;
	const isNextSlideDisabled = infinite === false && itemsCount - itemsInSlide <= activeIndex;

	return { isPrevSlideDisabled, isNextSlideDisabled };
};
