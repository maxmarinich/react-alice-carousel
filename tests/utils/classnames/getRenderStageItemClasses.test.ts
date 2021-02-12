import * as Utils from '../../../src/lib/utils';
import { Classnames, Modifiers } from '../../../src/lib/types';

describe('Utils.getRenderStageItemClasses', function () {
	const root = Utils.concatClassnames(Classnames.STAGE_ITEM);
	const active = Utils.concatClassnames(Classnames.STAGE_ITEM, Modifiers.ACTIVE);
	const cloned = Utils.concatClassnames(Classnames.STAGE_ITEM, Modifiers.CLONED);
	const complex = Utils.concatClassnames(Classnames.STAGE_ITEM, Modifiers.ACTIVE, Modifiers.CLONED);
	const target = Utils.concatClassnames(Classnames.STAGE_ITEM, Modifiers.ACTIVE, Modifiers.TARGET);
	const animated = Utils.concatClassnames(target, Classnames.ANIMATED);

	it('should return default classnames', function () {
		const initialState = Utils.calculateInitialState({}, null);
		const classnames = Utils.getRenderStageItemClasses(0, initialState);

		expect(classnames).toEqual(target);
	});

	it('should return correct classnames if infinite', function () {
		const initialState = Utils.calculateInitialState({ children: [1] }, null);
		const classnames = Utils.getRenderStageItemClasses(0, { ...initialState, infinite: true });

		expect(classnames).toEqual(cloned);
	});

	it('should return correct classnames if responsive', function () {
		const props = { children: [1, 2, 3], responsive: { 0: { items: 2 } } };
		const initialState = Utils.calculateInitialState(props, null);
		const classnames = Utils.getRenderStageItemClasses(0, initialState);
		const classnames1 = Utils.getRenderStageItemClasses(1, initialState);
		const classnames2 = Utils.getRenderStageItemClasses(2, initialState);

		expect(classnames).toEqual(target);
		expect(classnames1).toEqual(active);
		expect(classnames2).toEqual(root);
	});

	it('should return correct classnames if responsive && infinite', function () {
		const props = { children: [1, 2, 3], responsive: { 0: { items: 2 } }, infinite: true };
		const initialState = Utils.calculateInitialState(props, null);
		const classnames = Utils.getRenderStageItemClasses(0, initialState);
		const classnames1 = Utils.getRenderStageItemClasses(1, initialState);
		const classnames2 = Utils.getRenderStageItemClasses(2, initialState);
		const classnames3 = Utils.getRenderStageItemClasses(3, initialState);
		const classnames4 = Utils.getRenderStageItemClasses(4, initialState);
		const classnames5 = Utils.getRenderStageItemClasses(5, initialState);
		const classnames6 = Utils.getRenderStageItemClasses(6, initialState);

		expect(classnames).toEqual(cloned);
		expect(classnames1).toEqual(cloned);
		expect(classnames2).toEqual(target);
		expect(classnames3).toEqual(active);
		expect(classnames4).toEqual(root);
		expect(classnames5).toEqual(cloned);
		expect(classnames6).toEqual(cloned);
	});

	it('should return correct classnames if responsive && infinite && activeIndex', function () {
		const props = { children: [1, 2, 3], responsive: { 0: { items: 2 } }, infinite: true, activeIndex: 2 };
		const initialState = Utils.calculateInitialState(props, null);
		const classnames = Utils.getRenderStageItemClasses(0, initialState);
		const classnames1 = Utils.getRenderStageItemClasses(1, initialState);
		const classnames2 = Utils.getRenderStageItemClasses(2, initialState);
		const classnames3 = Utils.getRenderStageItemClasses(3, initialState);
		const classnames4 = Utils.getRenderStageItemClasses(4, initialState);
		const classnames5 = Utils.getRenderStageItemClasses(5, initialState);
		const classnames6 = Utils.getRenderStageItemClasses(6, initialState);

		expect(classnames).toEqual(cloned);
		expect(classnames1).toEqual(cloned);
		expect(classnames2).toEqual(root);
		expect(classnames3).toEqual(root);
		expect(classnames4).toEqual(target);
		expect(classnames5).toEqual(complex);
		expect(classnames6).toEqual(cloned);
	});

	it('should return correct classnames if fadeout animation', function () {
		const initialState = Utils.calculateInitialState({ children: [1] }, null);
		const classnames = Utils.getRenderStageItemClasses(0, { ...initialState, fadeoutAnimationIndex: 0 });

		expect(classnames).toEqual(animated);
	});

	it('should return correct classnames if autowidth', function () {
		const props = { children: [1, 2, 3], responsive: { 0: { items: 4 } }, autoWidth: true };
		const initialState = Utils.calculateInitialState(props, null);
		const classnames = Utils.getRenderStageItemClasses(0, initialState);
		const classnames1 = Utils.getRenderStageItemClasses(1, initialState);
		const classnames2 = Utils.getRenderStageItemClasses(2, initialState);

		expect(classnames).toEqual(target);
		expect(classnames1).toEqual(root);
		expect(classnames2).toEqual(root);
	});

	it('should return correct classnames if autowidth && infinite', function () {
		const props = { children: [1, 2, 3], responsive: { 0: { items: 2 } }, autoWidth: true, infinite: true };
		const initialState = Utils.calculateInitialState(props, null);
		const classnames = Utils.getRenderStageItemClasses(0, initialState);
		const classnames1 = Utils.getRenderStageItemClasses(1, initialState);
		const classnames2 = Utils.getRenderStageItemClasses(2, initialState);
		const classnames3 = Utils.getRenderStageItemClasses(3, initialState);
		const classnames4 = Utils.getRenderStageItemClasses(4, initialState);
		const classnames5 = Utils.getRenderStageItemClasses(5, initialState);
		const classnames6 = Utils.getRenderStageItemClasses(6, initialState);
		const classnames7 = Utils.getRenderStageItemClasses(7, initialState);
		const classnames8 = Utils.getRenderStageItemClasses(8, initialState);

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
