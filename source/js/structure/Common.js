export function setTransformAnimation(element, position, durationMs) {
    const prefixes = ['Webkit', 'Moz', 'ms', 'O', ''];

    for (let value of prefixes) {
        element.style[value + 'Transform'] = `translate3d(${position}px, 0, 0)`;
        element.style[value + 'Transition'] = `transform ${durationMs}ms ease-out`;
    }
}
