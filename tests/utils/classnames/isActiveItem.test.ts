import * as Utils from '../../../src/lib/utils';

describe('Utils.isActiveItem', function () {
	it('should return correct value', function () {
		const initialState = Utils.calculateInitialState({}, null);
		const isActive = Utils.isActiveItem(1, { ...initialState, infinite: true });

		expect(isActive).toEqual(true);
	});

	it('should return correct value if not infinite', function () {
		const initialState = Utils.calculateInitialState({}, null);
		const isActive = Utils.isActiveItem(0, initialState);

		expect(isActive).toEqual(true);
	});

	it('should return correct value if infinite && autowidth', function () {
		const initialState = Utils.calculateInitialState({ children: [1] }, null);
		const isActive = Utils.isActiveItem(2, { ...initialState, infinite: true, autoWidth: true });

		expect(isActive).toEqual(false);
	});
});
