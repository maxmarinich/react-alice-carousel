import * as Utils from '../../../src/lib/utils';

describe('Utils.getStageContentWidth', function () {
	const transformationSet = [
		{ position: 0, width: 10 },
		{ position: 0, width: 20 },
	];

	it('should return correct value', function () {
		const state = Utils.calculateInitialState({}, null);
		expect(Utils.getStageContentWidth({ ...state, transformationSet, itemsCount: 1 })).toEqual(10);
	});

	it('should return correct value if items', function () {
		const state = Utils.calculateInitialState({}, null);
		expect(Utils.getStageContentWidth({ ...state, transformationSet, itemsCount: 1 })).toEqual(10);
	});

	it('should return correct value if infinite', function () {
		const state = Utils.calculateInitialState({}, null);
		expect(Utils.getStageContentWidth({ ...state, transformationSet, infinite: true, itemsCount: 1 })).toEqual(20);
	});
});
