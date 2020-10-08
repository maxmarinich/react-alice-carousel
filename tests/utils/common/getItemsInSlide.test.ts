import * as Utils from '../../../src/lib/utils';
import { defaultProps } from '../../../src/lib/defaultProps';

describe('Utils.getItemsInSlide', function () {
	const responsive = { '0': { items: 2 } };

	it('should return correct value', function () {
		expect(Utils.getItemsInSlide(0, defaultProps)).toEqual(1);
	});

	it('should return correct value if autoWidth && infinite', function () {
		expect(Utils.getItemsInSlide(1, { ...defaultProps, autoWidth: true, infinite: true })).toEqual(1);
	});

	it('should return correct value if responsive', function () {
		expect(Utils.getItemsInSlide(1, { ...defaultProps, responsive })).toEqual(1);
	});
});
