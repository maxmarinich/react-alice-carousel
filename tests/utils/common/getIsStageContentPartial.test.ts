import * as Utils from '../../../src/lib/utils';

describe('Utils.getIsStageContentPartial', function () {
	it('should return correct value', function () {
		expect(Utils.getIsStageContentPartial(0, 0)).toEqual(true);
	});
});
