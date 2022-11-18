"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var code_md_1 = require("./code.md");
var the_code_1 = require("../../../the-code");
var react_alice_carousel_1 = require("../../../../lib/react-alice-carousel");
var responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
};
var createItems = function (length, _a) {
    if (length === void 0) { length = 0; }
    var handleClick = _a[0];
    var deltaX = 0;
    var difference = 0;
    var swipeDelta = 20;
    return Array.from({ length: length }).map(function (item, i) { return (<div data-value={i + 1} className="item" onMouseDown={function (e) { return (deltaX = e.pageX); }} onMouseUp={function (e) { return (difference = Math.abs(e.pageX - deltaX)); }} onClick={function () { return difference < swipeDelta && handleClick(i); }}>
			<span className="item-inner"/>
		</div>); });
};
var PropsComponent = function () {
    var _a = (0, react_1.useState)(0), activeIndex = _a[0], setActiveIndex = _a[1];
    var items = (0, react_1.useState)(createItems(5, [setActiveIndex]))[0];
    var slidePrev = function () { return setActiveIndex(activeIndex - 1); };
    var slideNext = function () { return setActiveIndex(activeIndex + 1); };
    var syncActiveIndex = function (_a) {
        var _b = _a.item, item = _b === void 0 ? 0 : _b;
        return setActiveIndex(item);
    };
    return (<section className="p-basic">
			<react_alice_carousel_1.default mouseTracking disableDotsControls disableButtonsControls items={items} activeIndex={activeIndex} responsive={responsive} onSlideChanged={syncActiveIndex}/>
			<div className="b-refs-buttons">
				<button onClick={slidePrev}>Prev</button>
				<button onClick={slideNext}>Next</button>
			</div>
			<the_code_1.default html={code_md_1.default}/>
		</section>);
};
exports.default = PropsComponent;
