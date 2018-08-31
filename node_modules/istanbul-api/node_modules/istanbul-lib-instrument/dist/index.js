"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInstrumenter = createInstrumenter;
Object.defineProperty(exports, "programVisitor", {
  enumerable: true,
  get: function get() {
    return _visitor.default;
  }
});
Object.defineProperty(exports, "readInitialCoverage", {
  enumerable: true,
  get: function get() {
    return _readCoverage.default;
  }
});

var _instrumenter = _interopRequireDefault(require("./instrumenter"));

var _visitor = _interopRequireDefault(require("./visitor"));

var _readCoverage = _interopRequireDefault(require("./read-coverage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * createInstrumenter creates a new instrumenter with the
 * supplied options.
 * @param {Object} opts - instrumenter options. See the documentation
 * for the Instrumenter class.
 */
function createInstrumenter(opts) {
  return new _instrumenter.default(opts);
}