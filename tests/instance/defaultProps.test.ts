import Carousel from '../../src/lib/react-alice-carousel';
import { defaultProps } from '../../src/lib/defaultProps';

describe('Instance', function () {
	it('should include default props', function () {
		expect(Carousel.defaultProps).toEqual(defaultProps);
	});
});
