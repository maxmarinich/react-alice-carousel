import { ItemCoords } from '../types';

export const mapPartialCoords = (coords: ItemCoords[]) => {
	return coords.map(({ width }) => ({ width, position: 0 }));
};

export const mapPositionCoords = (coords: ItemCoords[], position = 0) => {
	return coords.map((item) => {
		if (item.position > position) {
			return { ...item, position };
		}
		return item;
	});
};
