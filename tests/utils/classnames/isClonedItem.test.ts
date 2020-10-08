import * as Utils from '../../../src/lib/utils';

describe('Utils.isClonedItem', function () {
	it('should return correct value', function () {
		const initialState = Utils.calculateInitialState({}, null);
		const isCloned = Utils.isClonedItem(0, initialState);

		expect(isCloned).toEqual(false);
	});

	it('should return correct value if infinite', function () {
		const initialState = Utils.calculateInitialState({}, null);
		const isCloned = Utils.isClonedItem(0, { ...initialState, infinite: true });

		expect(isCloned).toEqual(true);
	});

	it('should return correct value if infinite && autowidth', function () {
		const initialState = Utils.calculateInitialState({}, null);
		const isCloned = Utils.isClonedItem(0, { ...initialState, infinite: true, autoWidth: true });

		expect(isCloned).toEqual(true);
	});
});
