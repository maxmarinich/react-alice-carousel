import React, { CSSProperties, ReactNode } from 'react';

type Props = { item: ReactNode, className?: string, styles?: CSSProperties }
export const StageItem = ({ item, className, styles }: Props) => {
	return (
		<li style={styles} className={className}>
			{item}
		</li>
	);
};
