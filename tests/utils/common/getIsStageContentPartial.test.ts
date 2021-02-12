import * as Utils from '../../../src/lib/utils';

describe('Utils.getIsStageContentPartial', function () {
	it('should return correct value', function () {
		expect(Utils.getIsStageContentPartial(false, 0, 0)).toEqual(true);
		expect(Utils.getIsStageContentPartial(true, 0, 0)).toEqual(false);
		expect(Utils.getIsStageContentPartial(true, 1, 0)).toEqual(false);
	});
});
