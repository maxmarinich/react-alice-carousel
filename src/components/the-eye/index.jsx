"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
require("./styles.scss");
function TheEye(_a) {
    var _b = _a.isActive, isActive = _b === void 0 ? false : _b;
    return <i className={"e-eye".concat(isActive ? ' __active' : '')}/>;
}
exports.default = TheEye;
