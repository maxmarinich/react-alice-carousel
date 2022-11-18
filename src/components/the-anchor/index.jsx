"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAnchorProps = void 0;
var react_1 = require("react");
var genAnchorProps = function (anchorString) {
    if (anchorString === void 0) { anchorString = ''; }
    return {
        anchor: "#".concat(anchorString),
        id: anchorString,
    };
};
exports.genAnchorProps = genAnchorProps;
function TheAnchor(_a) {
    var _b = _a.id, id = _b === void 0 ? '' : _b, _c = _a.anchor, anchor = _c === void 0 ? '' : _c;
    return (<a id={id} href={anchor} className="anchor">
			<svg className="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
				<path fillRule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"/>
			</svg>
		</a>);
}
exports.default = TheAnchor;
