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
var renderSlideInfo = function (_a) {
    var _b = _a.item, item = _b === void 0 ? 0 : _b, _c = _a.itemsCount, itemsCount = _c === void 0 ? 0 : _c;
    return "".concat(item, "\\").concat(itemsCount);
};
var renderPrevButton = function (_a) {
    var _b = _a.isDisabled, isDisabled = _b === void 0 ? false : _b;
    return <span style={{ opacity: isDisabled ? '0.5' : 1 }}>&lt;</span>;
};
var renderNextButton = function (_a) {
    var _b = _a.isDisabled, isDisabled = _b === void 0 ? false : _b;
    return <span style={{ opacity: isDisabled ? '0.5' : 1 }}>&gt;</span>;
};
var renderPlayPauseButton = function (_a) {
    var _b = _a.isPlaying, isPlaying = _b === void 0 ? false : _b;
    return isPlaying ? 'PAUSE' : 'PLAY';
};
var renderDotsItem = function (_a) {
    var _b = _a.isActive, isActive = _b === void 0 ? false : _b;
    return isActive ? 'x' : 'o';
};
var RenderComponent = function () {
    return (<section className="p-basic s-render-components">
			<react_alice_carousel_1.default mouseTracking items={items} autoPlayControls disableSlideInfo={false} renderSlideInfo={renderSlideInfo} renderDotsItem={renderDotsItem} renderPrevButton={renderPrevButton} renderNextButton={renderNextButton} renderPlayPauseButton={renderPlayPauseButton}/>
			<the_code_1.default html={code_md_1.default}/>
		</section>);
};
exports.default = RenderComponent;
