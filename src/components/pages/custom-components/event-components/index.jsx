"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var code_md_1 = require("./code.md");
var the_code_1 = require("../../../the-code");
var react_alice_carousel_1 = require("../../../../lib/react-alice-carousel");
var items = [
    <div className="item" data-value="1">
		1
	</div>,
    <div className="item" data-value="2">
		2
	</div>,
    <div className="item" data-value="3">
		3
	</div>,
    <div className="item" data-value="4">
		4
	</div>,
    <div className="item" data-value="5">
		5
	</div>,
];
var thumbItems = function (items, _a) {
    var setThumbIndex = _a[0], setThumbAnimation = _a[1];
    return items.map(function (item, i) { return (<div className="thumb" onClick={function () { return (setThumbIndex(i), setThumbAnimation(true)); }}>
			{item}
		</div>); });
};
var Carousel = function () {
    var _a = (0, react_1.useState)(0), mainIndex = _a[0], setMainIndex = _a[1];
    var _b = (0, react_1.useState)(false), mainAnimation = _b[0], setMainAnimation = _b[1];
    var _c = (0, react_1.useState)(0), thumbIndex = _c[0], setThumbIndex = _c[1];
    var _d = (0, react_1.useState)(false), thumbAnimation = _d[0], setThumbAnimation = _d[1];
    var thumbs = (0, react_1.useState)(thumbItems(items, [setThumbIndex, setThumbAnimation]))[0];
    var slideNext = function () {
        if (!thumbAnimation && thumbIndex < thumbs.length - 1) {
            setThumbAnimation(true);
            setThumbIndex(thumbIndex + 1);
        }
    };
    var slidePrev = function () {
        if (!thumbAnimation && thumbIndex > 0) {
            setThumbAnimation(true);
            setThumbIndex(thumbIndex - 1);
        }
    };
    var syncMainBeforeChange = function () {
        setMainAnimation(true);
    };
    var syncMainAfterChange = function (e) {
        setMainAnimation(false);
        if (e.type === 'action') {
            setThumbIndex(e.item);
            setThumbAnimation(false);
        }
        else {
            setMainIndex(thumbIndex);
        }
    };
    var syncThumbs = function (e) {
        setThumbIndex(e.item);
        setThumbAnimation(false);
        if (!mainAnimation) {
            setMainIndex(e.item);
        }
    };
    return [
        <react_alice_carousel_1.default activeIndex={mainIndex} animationType="fadeout" animationDuration={800} disableDotsControls disableButtonsControls items={items} mouseTracking={!thumbAnimation} onSlideChange={syncMainBeforeChange} onSlideChanged={syncMainAfterChange} touchTracking={!thumbAnimation} key="main"/>,
        <div className="thumbs" key="thumbs">
			<react_alice_carousel_1.default activeIndex={thumbIndex} autoWidth disableDotsControls disableButtonsControls items={thumbs} mouseTracking={false} onSlideChanged={syncThumbs} touchTracking={!mainAnimation}/>
			<div className="btn-prev" onClick={slidePrev}>
				&lang;
			</div>
			<div className="btn-next" onClick={slideNext}>
				&rang;
			</div>
		</div>,
    ];
};
var EventComponentPage = function () {
    return (<section className="p-basic p-event">
			{Carousel()}
			<the_code_1.default html={code_md_1.default}/>
		</section>);
};
exports.default = EventComponentPage;
