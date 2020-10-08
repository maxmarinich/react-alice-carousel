import React from 'react';

export const StageItem = ({ item, className, styles }) => {
	return (
		<li style={styles} className={className}>
			{item}
		</li>
	);
};
