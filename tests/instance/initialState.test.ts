import Carousel from '../../src/lib/react-alice-carousel';
import * as Utils from '../../src/lib/utils';

describe('Instance: initialState', function () {
	it('should return a correct initial state', function () {
		const { state } = new Carousel({});
		const initialState = Utils.calculateInitialState({}, null);

		expect(state).toEqual(initialState);
	});
	it('should return a correct activeIndex if not less', function () {
		const props = { activeIndex: 5, children: [1, 2, 3, 4, 5], responsive: { 0: { items: 3 } } };
		const initialState = Utils.calculateInitialState(props, null);

		expect(4).toEqual(initialState.activeIndex);
	});
	it('should return a correct activeIndex if less', function () {
		const props = { activeIndex: -1, children: [1, 2, 3, 4, 5], responsive: { 0: { items: 3 } } };
		const initialState = Utils.calculateInitialState(props, null);

		expect(0).toEqual(initialState.activeIndex);
	});
});
