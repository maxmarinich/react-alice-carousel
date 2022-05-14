import React from 'react';
import { Classnames, Modifiers } from '../types';
import { concatClassnames, getSlideInfo } from '../utils';

export const SlideInfo = ({ activeIndex, itemsCount, renderSlideInfo }) => {
	const { item } = getSlideInfo(activeIndex, itemsCount);

	if (typeof renderSlideInfo === 'function') {
		return <div className={Classnames.SLIDE_INFO}>{renderSlideInfo({ item, itemsCount })}</div>;
	}

	const classnames = concatClassnames(Classnames.SLIDE_INFO_ITEM, Modifiers.SEPARATOR);

	return (
		<div className={Classnames.SLIDE_INFO}>
			<span className={Classnames.SLIDE_INFO_ITEM}>{item}</span>
			<span className={classnames}>/</span>
			<span className={Classnames.SLIDE_INFO_ITEM}>{itemsCount}</span>
		</div>
	);
};
