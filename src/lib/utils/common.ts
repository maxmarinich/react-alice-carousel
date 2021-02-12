import * as Utils from '.';
import { Props, State } from '../types';

export const canUseDOM = () => {
	try {
		return Boolean(window?.document?.createElement);
	} catch (e) {
		return false;
	}
};

export const concatClassnames = (...classes) => {
	return classes.filter(Boolean).join(' ');
};

export const getIsStageContentPartial = (infinite = false, stageWidth = 0, contentWidth = 0) => {
	if (infinite) {
		return false;
	}

	return stageWidth >= contentWidth;
};

export const getItemsInSlide = (itemsCount: number, props: Props) => {
	let itemsInSlide = 1;
	const { responsive, autoWidth = false, infinite = false, innerWidth } = props;

	// TODO: refactoring
	if (autoWidth) {
		return infinite ? itemsCount : itemsInSlide;
	}

	if (responsive) {
		const configKeys = Object.keys(responsive);

		if (configKeys.length) {
			if (innerWidth || canUseDOM()) {
				const value = innerWidth || window.innerWidth;

				configKeys.forEach((key) => {
					if (Number(key) < value) {
						itemsInSlide = Math.min(responsive[key].items, itemsCount) || itemsInSlide;
					}
				});
			}
		}
	}
	return itemsInSlide;
};

export const calculateInitialState = (props: Partial<Props>, el: null | HTMLElement, isClient = false): State => {
	let transformationSet;
	let isStageContentPartial;
	let stageContentWidth;
	const { animationDuration = 0, infinite = false, autoPlay = false, autoWidth = false } = props;
	const clones = Utils.createClones(props);
	const transition = Utils.getTransitionProperty();
	const itemsCount = Utils.getItemsCount(props);
	const itemsOffset = Utils.getItemsOffset(props);
	const itemsInSlide = getItemsInSlide(itemsCount, props);
	const startIndex = Utils.getStartIndex(props.activeIndex, itemsCount);
	const activeIndex = Utils.getActiveIndex({ startIndex, itemsCount, /*itemsInSlide,*/ infinite });
	const { width: stageWidth } = Utils.getElementDimensions(el);

	if (autoWidth) {
		// TODO: refactoring
		const { coords, content, partial } = Utils.createAutowidthTransformationSet(el, stageWidth, infinite);

		isStageContentPartial = partial;
		stageContentWidth = content;
		transformationSet = coords;
	} else {
		const { coords, content, partial } = Utils.createDefaultTransformationSet(
			clones,
			stageWidth,
			itemsInSlide,
			infinite,
		);

		isStageContentPartial = partial;
		stageContentWidth = content;
		transformationSet = coords;
	}

	const { position: swipeAllowedPositionMax } = Utils.getItemCoords(-itemsInSlide, transformationSet);

	const swipeLimitMin = Utils.getSwipeLimitMin({ itemsOffset, transformationSet }, props);
	const swipeLimitMax = Utils.getSwipeLimitMax({ itemsCount, itemsOffset, itemsInSlide, transformationSet }, props);
	const swipeShiftValue = Utils.getSwipeShiftValue(itemsCount, transformationSet);

	const translate3d = Utils.getTranslate3dProperty(activeIndex, {
		itemsInSlide,
		itemsOffset,
		transformationSet,
		autoWidth,
		infinite,
	});

	return {
		activeIndex,
		autoWidth,
		animationDuration,
		clones,
		infinite,
		itemsCount,
		itemsInSlide,
		itemsOffset,
		translate3d,
		stageWidth,
		stageContentWidth,
		initialStageHeight: 0,
		isStageContentPartial,
		isAutoPlaying: Boolean(autoPlay),
		isAutoPlayCanceledOnAction: false,
		transformationSet,
		transition,
		fadeoutAnimationIndex: null,
		fadeoutAnimationPosition: null,
		fadeoutAnimationProcessing: false,
		swipeLimitMin,
		swipeLimitMax,
		swipeAllowedPositionMax,
		swipeShiftValue,
		canUseDom: isClient || canUseDOM(),
	};
};
