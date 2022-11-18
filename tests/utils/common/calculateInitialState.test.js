"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = require("../../../src/lib/utils");
var defaultProps_1 = require("../../../src/lib/defaultProps");
describe('Utils.calculateInitialState', function () {
    it('should return correct value', function () {
        expect(Utils.calculateInitialState(defaultProps_1.defaultProps, null, true)).toEqual({
            activeIndex: 0,
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
            canUseDom: true,
        });
    });
});
