import * as Utils from '../../../src/lib/utils';
import { defaultProps } from '../../../src/lib/defaultProps';

describe('Utils.calculateInitialState', function () {
	it('should return correct value', function () {
		expect(Utils.calculateInitialState(defaultProps, null)).toEqual({
			activeIndex: -1,
			animationDuration: 400,
			autoWidth: false,
			clones: [],
			fadeoutAnimationIndex: null,
			fadeoutAnimationPosition: null,
			fadeoutAnimationProcessing: false,
			infinite: false,
			initialStageHeight: 0,
			isAutoPlayCanceledOnAction: false,
			isAutoPlaying: false,
			isStageContentPartial: true,
			itemsCount: 0,
			itemsInSlide: 1,
			itemsOffset: 0,
			stageContentWidth: 0,
			stageWidth: 0,
			swipeAllowedPositionMax: 0,
			swipeLimitMax: 200,
			swipeLimitMin: 0,
			swipeShiftValue: 0,
			transformationSet: [],
			transition: 'transform 0ms ease 0ms',
			translate3d: 0,
		});
	});
});
