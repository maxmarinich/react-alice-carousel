import * as Utils from '../../../src/lib/utils';

describe('Utils.isActiveItem', function () {
	it('should return correct value', function () {
		const initialState = Utils.calculateInitialState({}, null);
		const isCloned = Utils.isActiveItem(1, { ...initialState, infinite: true });

		expect(isCloned).toEqual(true);
	});

	it('should return correct value if not infinite', function () {
		const initialState = Utils.calculateInitialState({}, null);
		const isCloned = Utils.isActiveItem(0, initialState);

		expect(isCloned).toEqual(true);
	});

	it('should return correct value if infinite && autowidth', function () {
		const initialState = Utils.calculateInitialState({}, null);
		const isCloned = Utils.isActiveItem(1, { ...initialState, infinite: true, autoWidth: true });

		expect(isCloned).toEqual(true);
	});
});
