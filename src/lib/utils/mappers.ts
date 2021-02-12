export const mapPartialCoords = (coords) => {
	return coords.map(({ width }) => ({ width, position: 0 }));
};

export const mapPositionCoords = (coords, position = 0) => {
	return coords.map((item) => {
		if (item.position > position) {
			return { ...item, position };
		}
		return item;
	});
};
