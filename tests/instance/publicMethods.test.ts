import Carousel from '../../src/lib/react-alice-carousel';

describe('Instance: methods', function () {
	it('should provide public methods', function () {
		const Gallery = new Carousel({}) || {};

		expect(typeof Gallery.slideNext).toEqual('function');
		expect(typeof Gallery.slidePrev).toEqual('function');
		expect(typeof Gallery.slideTo).toEqual('function');
	});
});
