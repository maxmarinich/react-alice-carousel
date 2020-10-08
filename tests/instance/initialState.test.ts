import Carousel from '../../src/lib/react-alice-carousel';
import * as Utils from '../../src/lib/utils';

describe('Instance', function () {
	it('should return a correct initial state', function () {
		const { state } = new Carousel({}) || {};
		const initialState = Utils.calculateInitialState({}, null);

		expect(state).toEqual(initialState);
	});
});
