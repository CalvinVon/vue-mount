"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _vue = _interopRequireDefault(require("vue"));

var Mount = function Mount(component, options) {
  (0, _classCallCheck2["default"])(this, Mount);

  _constructors.set(this, {
    writable: true,
    value: void 0
  });

  this.constructors = _vue["default"].extend(component);
};

var _constructors = new WeakMap();