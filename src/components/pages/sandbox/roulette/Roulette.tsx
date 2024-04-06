import React, { useState, useEffect } from 'react';
// import { nanoid } from 'nanoid';
// import { easeCircleOut } from 'd3-ease';
//
// import markdown from './code-roulette.md';
// import TheCode from '../../the-code';
import AliceCarousel from '../../../../lib/react-alice-carousel';
import { shuffleArray, genItems, genRandomInt } from './Roulette.utils';
import type { Props, Item } from './Roulette.types';

let timeoutId: null | NodeJS.Timeout = null;

const responsive = {
	0: { items: 1 },
	640: { items: 3 },
	768: { items: 5 },
};

const itemsAmount = 100;
const itemsPadding = 10;

function itemsToElements(items: Item[] = []) {
	const itemsLeftPadding = items.slice(-itemsPadding);
	const itemsRightPadding = items.slice(0, itemsPadding);
	const itemsWithAnimationPadding = items.concat(items);

	return [...itemsLeftPadding, ...itemsWithAnimationPadding, ...itemsRightPadding].map((item, i) => {
		return <div key={i + 1} data-value={item.id} className={`item roulette roulette-${item.type}`} />;
	});
}

function getOffset(itemsOnScreen: number) {
	return Math.floor(itemsOnScreen / 2);
}

function loadWinner() {
	return new Promise<{ id: number }>((resolve) => {
		timeoutId = setTimeout(() => resolve({ id: genRandomInt() }), 2_000);
	});
}

export default function SandboxPage(props: Partial<Props>) {
	const loadAnimationIndex = 10;
	const loadAnimationDuration = 2_000;
	const loadAnimationFunction = 'cubic-bezier(.97,-0.2,.77,.39)';

	const rouletteAnimationDuration = 8_000;
	const rouletteAnimationFunction = 'cubic-bezier(0,.4,.11,1.16)';

	const [key, setKey] = useState(0);
	const [items] = useState(shuffleArray(props.items || genItems()));
	const [elements] = useState(itemsToElements(items));
	const [activeIndex, setActive] = useState(itemsPadding);
	const [itemsOffset, setItemsOffset] = useState(0);
	const [itemsOnScreen, setItemsOnScreen] = useState(0);
	const [animationDuration, setAnimationDuration] = useState(loadAnimationDuration);
	const [animationEasingFunction, setAnimationEasingFunction] = useState(loadAnimationFunction);

	const [winner, setWinner] = useState<{ id: number } | null>(null);
	const [winnerId, setWinnerId] = useState<number | null>(null);
	const [isWinnerLoading, setSetIsWinnerLoading] = useState(false);
	const [isWinnerHighlighted, setIsWinnerHighlighted] = useState(false);
	const [isRouletteAnimationProcess, setIsRouletteAnimationProcess] = useState(false);

	useEffect(() => {
		if (winner) {
			setWinnerId(winner.id);
			setAnimationDuration(rouletteAnimationDuration);
			setAnimationEasingFunction(rouletteAnimationFunction);
		} else {
			setAnimationDuration(loadAnimationDuration);
			setAnimationEasingFunction(loadAnimationFunction);
		}
	}, [winner]);

	function getRouletteAnimationIndex({ id = 0 }) {
		const winnerIndex = items.findIndex((item) => item.id === id);
		return winnerIndex + itemsAmount + itemsPadding - itemsOffset;
	}

	function handleInit({ itemsInSlide = 0 }) {
		setItemsOnScreen(itemsInSlide);
		setItemsOffset(getOffset(itemsInSlide));
	}

	function handleSlideChange({ item = 0 }) {
		if (winner) {
			const nexIndex = getRouletteAnimationIndex(winner);
			setActive(nexIndex);
			setIsRouletteAnimationProcess(true);

			if (isRouletteAnimationProcess) {
				setKey(key + 1);
				setWinner(null);
				setActive(nexIndex - itemsAmount);
				setIsWinnerHighlighted(true);
				setIsRouletteAnimationProcess(false);
			}
		} else {
			// repeat load animation until the winner is loaded
			setActive(item - 1);
		}
	}

	return (
		<section className="p-basic">
			<div className={`b-content b-roulette${isWinnerHighlighted ? ' __highlighted' : ''} __size-${itemsOnScreen}`}>
				<AliceCarousel
					key={key}
					items={elements}
					paddingLeft={100}
					paddingRight={100}
					animationDuration={animationDuration}
					animationEasingFunction={animationEasingFunction}
					activeIndex={activeIndex}
					responsive={responsive}
					mouseTracking={false}
					touchTracking={false}
					disableButtonsControls
					disableDotsControls
					onSlideChanged={handleSlideChange}
					onResized={handleInit}
					onInitialized={handleInit}
				/>
				<div className="b-opacity" />
			</div>
			<button
				className="text"
				onClick={() => {
					if (timeoutId) clearTimeout(timeoutId);
					setKey(key + 1);
					setWinner(null);
					setActive(itemsPadding);
					setWinnerId(null);
					setSetIsWinnerLoading(false);
					setIsWinnerHighlighted(false);
					setIsRouletteAnimationProcess(false);
				}}
			>
				Reset
			</button>{' '}
			<button
				className="text"
				disabled={isWinnerLoading || isRouletteAnimationProcess}
				onClick={async () => {
					setActive(activeIndex + loadAnimationIndex);
					setSetIsWinnerLoading(true);
					setIsWinnerHighlighted(false);
					setWinner(await loadWinner());
					setSetIsWinnerLoading(false);
				}}
			>
				Run
			</button>{' '}
			<span className="text"> {isWinnerLoading && 'Loading winner...'}</span>
			<span className="text"> {!isWinnerLoading && winnerId && `Loaded winner: ${winnerId}`}</span>
		</section>
	);
}
