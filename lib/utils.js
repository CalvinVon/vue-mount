"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseOptions = parseOptions;
exports.isType = isType;
exports.isEmptyObject = isEmptyObject;

function parseOptions(options) {
  var _ref = options || {},
      _ref$props = _ref.props,
      props = _ref$props === void 0 ? {} : _ref$props,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? {} : _ref$data;

  return {
    propsData: props,
    data: data
  };
}

function isType(value, type) {
  return Object.prototype.toString.call(value) === "[object ".concat(type, "]");
}

function isEmptyObject(obj) {
  return isType(obj, 'Object') && !Object.keys(obj).length;
}