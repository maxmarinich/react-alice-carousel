"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var the_eye_1 = require("../the-eye");
require("./styles.scss");
function TheCode(_a) {
    var _b = _a.html, html = _b === void 0 ? '' : _b, _c = _a.hidden, hidden = _c === void 0 ? true : _c;
    var _d = (0, react_1.useState)(hidden), isHidden = _d[0], toggle = _d[1];
    var switchVisibility = function () { return toggle(!isHidden); };
    return (<section className="s-code">
			<h3 className="title">The Code</h3>
			<div className="s-code__item">
				<div className={"b-code".concat(isHidden ? ' __hidden' : '')} dangerouslySetInnerHTML={{ __html: html }}/>
				{isHidden && <div className="s-code__layer"/>}
				<div className="s-code__button" onClick={switchVisibility}>
					<the_eye_1.default isActive={!isHidden}/>
				</div>
			</div>
		</section>);
}
exports.default = TheCode;
