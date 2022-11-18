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
var RefsComponent = function () {
    var carousel = (0, react_1.useRef)(null);
    return (<section className="p-basic">
			<react_alice_carousel_1.default key="carousel" mouseTracking disableDotsControls disableButtonsControls items={items} ref={carousel}/>
			<nav key="nav" className="b-refs-navs">
				{items.map(function (item, i) {
            return <span key={i} onClick={function () { var _a; return (_a = carousel === null || carousel === void 0 ? void 0 : carousel.current) === null || _a === void 0 ? void 0 : _a.slideTo(i); }}/>;
        })}
			</nav>
			<div key="btns" className="b-refs-buttons">
				<button onClick={function (e) { var _a; return (_a = carousel === null || carousel === void 0 ? void 0 : carousel.current) === null || _a === void 0 ? void 0 : _a.slidePrev(e); }}>Prev</button>
				<button onClick={function (e) { var _a; return (_a = carousel === null || carousel === void 0 ? void 0 : carousel.current) === null || _a === void 0 ? void 0 : _a.slideNext(e); }}>Next</button>
			</div>
			<the_code_1.default key="code" html={code_md_1.default}/>
		</section>);
};
exports.default = RefsComponent;
