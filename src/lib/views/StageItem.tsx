import React from 'react';
//aria-roledescription = {item.ariaRoledescription}
export const StageItem = ({ item, className, styles, ariaRoledescriptionSlide, addGroupRole, pageInfo }) => {
	const {thisCount, itemsCount} = pageInfo;
	return (
		<li style={styles} 
			className={className} 
			aria-roledescription = {ariaRoledescriptionSlide}
			role={addGroupRole ? 'group' : 'none'}
			aria-label = {`${thisCount} of ${itemsCount}`}
		>
			{item}
		</li>
	);
};
