import * as Utils from '../../../src/lib/utils';

describe('Utils.getRenderStageItemClasses', function () {
	it('should return default classnames', function () {
		const initialState = Utils.calculateInitialState({}, null);
		const classnames = Utils.getRenderStageItemClasses(0, initialState);

		expect(classnames).toEqual('alice-carousel__stage-item __active');
	});

	it('should return correct classnames', function () {
		const initialState = Utils.calculateInitialState({ children: [1] }, null);
		const classnames = Utils.getRenderStageItemClasses(0, initialState);

		expect(classnames).toEqual('alice-carousel__stage-item __active');
	});

	it('should return correct classnames if fadeout animation', function () {
		const initialState = Utils.calculateInitialState({ children: [1] }, null);
		const classnames = Utils.getRenderStageItemClasses(0, { ...initialState, fadeoutAnimationIndex: 0 });

		expect(classnames).toEqual('alice-carousel__stage-item __active animated animated-out fadeOut');
	});
});
