export function genItems(length = 100) {
	return Array.from({ length }).map((v, i) => {
		const id = i++;
		if (i % 7 === 0) return { id, type: 5 };
		if (i % 5 === 0) return { id, type: 4 };
		if (i % 3 === 0) return { id, type: 3 };
		if (i % 2 === 0) return { id, type: 2 };
		if (i % 2 === 1) return { id, type: 1 };
		return { id, type: i };
	});
}

export function genRandomInt(min = 0, max = 100) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

export function shuffleArray<T>(array: T[] = []) {
	const shuffledArray = [...array];
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}
	return shuffledArray;
}

// Function to shuffle array and try to maintain for the uniqueness of neighboring elements
export function shuffleArrayUniquely<T>(items: T[] = [], key?: keyof T) {
	const shuffledItems = shuffleArray<T>(items);
	const getItemValue = (item: T) => (key ? item[key] : item);

	// Iterate through the shuffled array and try to maintain for the uniqueness of neighboring elements
	for (let i = 1; i < shuffledItems.length; i++) {
		const currentItem = shuffledItems[i];
		const prevItem = shuffledItems[i - 1];

		// if key passed we work with object, else with primitives
		const prevItemValue = getItemValue(prevItem);
		const currentItemValue = getItemValue(currentItem);

		if (currentItemValue === prevItemValue) {
			let newItemIndex: null | number = null;

			const newItem = shuffledItems.find((item, itemIndex) => {
				const itemValue = getItemValue(item);
				if (itemIndex > i && itemValue !== currentItemValue) {
					newItemIndex = itemIndex;
					return true;
				}
			});

			if (newItem && newItemIndex !== null) {
				// Swap the current item with the found item
				shuffledItems[i] = newItem;
				shuffledItems[newItemIndex] = currentItem;
			}
		}
	}
	return shuffledItems;
}
