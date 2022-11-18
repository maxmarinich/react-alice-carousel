"use strict";
/**
 *  @jest-environment jsdom
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = require("../../../src/lib/utils");
var types_1 = require("../../../src/lib/types");
describe('Utils.getRenderStageItemClasses', function () {
    var root = Utils.concatClassnames(types_1.Classnames.STAGE_ITEM);
    var active = Utils.concatClassnames(types_1.Classnames.STAGE_ITEM, types_1.Modifiers.ACTIVE);
    var cloned = Utils.concatClassnames(types_1.Classnames.STAGE_ITEM, types_1.Modifiers.CLONED);
    var complex = Utils.concatClassnames(types_1.Classnames.STAGE_ITEM, types_1.Modifiers.ACTIVE, types_1.Modifiers.CLONED);
    var target = Utils.concatClassnames(types_1.Classnames.STAGE_ITEM, types_1.Modifiers.ACTIVE, types_1.Modifiers.TARGET);
    var animated = Utils.concatClassnames(target, types_1.Classnames.ANIMATED);
    it('should return default classnames', function () {
        var initialState = Utils.calculateInitialState({}, null);
        var classnames = Utils.getRenderStageItemClasses(0, initialState);
        expect(classnames).toEqual(target);
    });
    it('should return correct classnames if infinite', function () {
        var initialState = Utils.calculateInitialState({ children: [1] }, null);
        var classnames = Utils.getRenderStageItemClasses(0, __assign(__assign({}, initialState), { infinite: true }));
        expect(classnames).toEqual(cloned);
    });
    it('should return correct classnames if responsive', function () {
        var props = { children: [1, 2, 3], responsive: { 0: { items: 2 } } };
        var initialState = Utils.calculateInitialState(props, null);
        var classnames = Utils.getRenderStageItemClasses(0, initialState);
        var classnames1 = Utils.getRenderStageItemClasses(1, initialState);
        var classnames2 = Utils.getRenderStageItemClasses(2, initialState);
        expect(classnames).toEqual(target);
        expect(classnames1).toEqual(active);
        expect(classnames2).toEqual(root);
    });
    it('should return correct classnames if responsive && infinite', function () {
        var props = { children: [1, 2, 3], responsive: { 0: { items: 2 } }, infinite: true };
        var initialState = Utils.calculateInitialState(props, null);
        var classnames = Utils.getRenderStageItemClasses(0, initialState);
        var classnames1 = Utils.getRenderStageItemClasses(1, initialState);
        var classnames2 = Utils.getRenderStageItemClasses(2, initialState);
        var classnames3 = Utils.getRenderStageItemClasses(3, initialState);
        var classnames4 = Utils.getRenderStageItemClasses(4, initialState);
        var classnames5 = Utils.getRenderStageItemClasses(5, initialState);
        var classnames6 = Utils.getRenderStageItemClasses(6, initialState);
        expect(classnames).toEqual(cloned);
        expect(classnames1).toEqual(cloned);
        expect(classnames2).toEqual(target);
        expect(classnames3).toEqual(active);
        expect(classnames4).toEqual(root);
        expect(classnames5).toEqual(cloned);
        expect(classnames6).toEqual(cloned);
    });
    it('should return correct classnames if responsive && infinite && activeIndex', function () {
        var props = { children: [1, 2, 3], responsive: { 0: { items: 2 } }, infinite: true, activeIndex: 2 };
        var initialState = Utils.calculateInitialState(props, null);
        var classnames = Utils.getRenderStageItemClasses(0, initialState);
        var classnames1 = Utils.getRenderStageItemClasses(1, initialState);
        var classnames2 = Utils.getRenderStageItemClasses(2, initialState);
        var classnames3 = Utils.getRenderStageItemClasses(3, initialState);
        var classnames4 = Utils.getRenderStageItemClasses(4, initialState);
        var classnames5 = Utils.getRenderStageItemClasses(5, initialState);
        var classnames6 = Utils.getRenderStageItemClasses(6, initialState);
        expect(classnames).toEqual(cloned);
        expect(classnames1).toEqual(cloned);
        expect(classnames2).toEqual(root);
        expect(classnames3).toEqual(root);
        expect(classnames4).toEqual(target);
        expect(classnames5).toEqual(complex);
        expect(classnames6).toEqual(cloned);
    });
    it('should return correct classnames if fadeout animation', function () {
        var initialState = Utils.calculateInitialState({ children: [1] }, null);
        var classnames = Utils.getRenderStageItemClasses(0, __assign(__assign({}, initialState), { fadeoutAnimationIndex: 0 }));
        expect(classnames).toEqual(animated);
    });
    it('should return correct classnames if autowidth', function () {
        var props = { children: [1, 2, 3], responsive: { 0: { items: 4 } }, autoWidth: true };
        var initialState = Utils.calculateInitialState(props, null);
        var classnames = Utils.getRenderStageItemClasses(0, initialState);
        var classnames1 = Utils.getRenderStageItemClasses(1, initialState);
        var classnames2 = Utils.getRenderStageItemClasses(2, initialState);
        expect(classnames).toEqual(target);
        expect(classnames1).toEqual(root);
        expect(classnames2).toEqual(root);
    });
    it('should return correct classnames if autowidth && infinite', function () {
        var props = { children: [1, 2, 3], responsive: { 0: { items: 2 } }, autoWidth: true, infinite: true };
        var initialState = Utils.calculateInitialState(props, null);
        var classnames = Utils.getRenderStageItemClasses(0, initialState);
        var classnames1 = Utils.getRenderStageItemClasses(1, initialState);
        var classnames2 = Utils.getRenderStageItemClasses(2, initialState);
        var classnames3 = Utils.getRenderStageItemClasses(3, initialState);
        var classnames4 = Utils.getRenderStageItemClasses(4, initialState);
        var classnames5 = Utils.getRenderStageItemClasses(5, initialState);
        var classnames6 = Utils.getRenderStageItemClasses(6, initialState);
        var classnames7 = Utils.getRenderStageItemClasses(7, initialState);
        var classnames8 = Utils.getRenderStageItemClasses(8, initialState);
        expect(classnames).toEqual(cloned);
        expect(classnames1).toEqual(cloned);
        expect(classnames2).toEqual(cloned);
        expect(classnames3).toEqual(target);
        expect(classnames4).toEqual(root);
        expect(classnames5).toEqual(root);
        expect(classnames6).toEqual(cloned);
        expect(classnames7).toEqual(cloned);
        expect(classnames8).toEqual(cloned);
    });
});
