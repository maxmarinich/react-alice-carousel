/**
 *  @jest-environment jsdom
 */

import * as Utils from '../../../src/lib/utils';
import { defaultProps } from '../../../src/lib/defaultProps';

describe('Utils.getItemsInSlide', function () {
	const responsive = { '0': { items: 1 }, '568' : { items: 2 }, '1024': { items: 3 } };

	it('should return correct value', function () {
		expect(Utils.getItemsInSlide(0, defaultProps)).toEqual(1);
	});

	it('should return correct value if autoWidth && infinite', function () {
		expect(Utils.getItemsInSlide(1, { ...defaultProps, autoWidth: true, infinite: true })).toEqual(1);
	});

	it('should return correct value if responsive', function () {
		expect(Utils.getItemsInSlide(1, { ...defaultProps, responsive: { '0': { items: 2 } } })).toEqual(1);
	});

	it('should return correct value if responsive && innerWidth is 0', function () {
		expect(Utils.getItemsInSlide(3, { ...defaultProps, innerWidth: 0, responsive })).toEqual(1);
	});

	it('should return correct value if responsive && innerWidth is 567', function () {
		expect(Utils.getItemsInSlide(3, { ...defaultProps, innerWidth: 567, responsive })).toEqual(1);
	});

	it('should return correct value if responsive && innerWidth is 568', function () {
		expect(Utils.getItemsInSlide(3, { ...defaultProps, innerWidth: 568, responsive })).toEqual(2);
	});

	it('should return correct value if responsive && innerWidth is 1023', function () {
		expect(Utils.getItemsInSlide(3, { ...defaultProps, innerWidth: 1023, responsive })).toEqual(2);
	});

	it('should return correct value if responsive && innerWidth is 1024', function () {
		expect(Utils.getItemsInSlide(3, { ...defaultProps, innerWidth: 1024, responsive })).toEqual(3);
	});

	it('should return correct value if responsive && itemsFit equal `contain`', function () {
		expect(Utils.getItemsInSlide(2, { ...defaultProps, innerWidth: 0,  responsive: {
			0 : {
				items: 3,
				itemsFit: 'contain'
			},
		}})).toEqual(3);
	});
});
