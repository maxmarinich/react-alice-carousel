import React from 'react';
import { Classnames, Modifiers, Props} from '../types';
import { concatClassnames, getSlideInfo } from '../utils';

type SlideProps = { activeIndex: number; itemsCount: number; renderSlideInfo?: Props['renderSlideInfo'] };
export const SlideInfo = ({ activeIndex, itemsCount, renderSlideInfo }: SlideProps) => {
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
