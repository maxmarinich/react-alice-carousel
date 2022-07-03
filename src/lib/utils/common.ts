import { Props, State } from '../types';
import {
	createAutowidthTransformationSet, createClones,
	createDefaultTransformationSet, getElementDimensions,
	getItemsCount, getItemsOffset, getTransitionProperty,
	getTranslate3dProperty,
} from './elements';
import {
	getActiveIndex,
	getItemCoords,
	getStartIndex,
	getSwipeLimitMax,
	getSwipeLimitMin,
	getSwipeShiftValue,
} from './math';

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

export const getPadding  = (props: Props) => {
	const { responsive, innerWidth, paddingLeft, paddingRight } = props;

	const result = {paddingLeft: paddingLeft, paddingRight: paddingRight};

	if(responsive) {
		const configKeys = Object.keys(responsive);

		if (configKeys.length) {
			if (innerWidth || canUseDOM()) {
				const value = innerWidth || window.innerWidth;
				configKeys.forEach((key) => {
					if (Number(key) < value) {
						if(responsive[key].paddingLeft != undefined) {
							result.paddingLeft = responsive[key].paddingLeft;
						}
						if(responsive[key].paddingRight != undefined) {
							result.paddingRight = responsive[key].paddingRight;
						}
					}
				});
			}
		}
	}
	return result;
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

				window.console.log(responsive, props);
			}
		}
	}
	return itemsInSlide;
};

export const calculateInitialState = (props: Partial<Props>, el: null | HTMLElement, canUseDom = false): State => {
	let isStageContentPartial;
	let stageContentWidth;
	let transformationSet;
	const { animationDuration = 0, infinite = false, autoPlay = false, autoWidth = false } = props;
	const clones = createClones(props);
	const transition = getTransitionProperty();
	const itemsCount = getItemsCount(props);
	const {paddingLeft, paddingRight} = getPadding(props);

	const itemsOffset = getItemsOffset(props);
	const itemsInSlide = getItemsInSlide(itemsCount, props);
	const startIndex = getStartIndex(props.activeIndex, itemsCount);
	const activeIndex = getActiveIndex({ startIndex, itemsCount, /*itemsInSlide,*/ infinite });
	const { width: stageWidth } = getElementDimensions(el);

	window.console.log({paddingLeft, paddingRight});

	if (autoWidth) {
		// TODO: refactoring
		const { coords, content, partial } = createAutowidthTransformationSet(el, stageWidth, infinite);

		isStageContentPartial = partial;
		stageContentWidth = content;
		transformationSet = coords;
	} else {
		const { coords, content, partial } = createDefaultTransformationSet(
			clones,
			stageWidth,
			itemsInSlide,
			infinite,
		);

		isStageContentPartial = partial;
		stageContentWidth = content;
		transformationSet = coords;
	}

	const { position: swipeAllowedPositionMax } = getItemCoords(-itemsInSlide, transformationSet);

	const swipeLimitMin = getSwipeLimitMin({ itemsOffset, transformationSet }, props);
	const swipeLimitMax = getSwipeLimitMax({ itemsCount, itemsOffset, itemsInSlide, transformationSet }, props);
	const swipeShiftValue = getSwipeShiftValue(itemsCount, transformationSet);

	const translate3d = getTranslate3dProperty(activeIndex, {
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
		canUseDom: canUseDom || canUseDOM(),
		paddingLeft,
		paddingRight,
	};
};
