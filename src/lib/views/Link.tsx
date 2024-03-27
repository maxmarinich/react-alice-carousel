import React from 'react';
import type { AnchorHTMLAttributes, PropsWithChildren, MouseEvent } from 'react';

export type LinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>;

export default function Link(props: LinkProps) {
	const coords: Record<string, number | null> = {
		xDown: null,
		xUp: null,
	};

	const handleOnMouseDown = (e: MouseEvent) => {
		e.preventDefault();
		coords.xUp = null;
		coords.xDown = e.clientX;
	};

	const handleMouseUp = (e: MouseEvent) => {
		e.preventDefault();
		coords.xUp = e.clientX;
	};

	const handleOnClick = (e: MouseEvent) => {
		if (coords.xDown !== coords.xUp) {
			e.preventDefault();
		}
	};

	return (
		<a onClick={handleOnClick} onMouseDown={handleOnMouseDown} onMouseUp={handleMouseUp} {...props}>
			{props.children}
		</a>
	);
}
