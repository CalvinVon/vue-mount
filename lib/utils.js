"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isType = isType;
exports.isEmptyObject = isEmptyObject;
exports.isVueInstance = isVueInstance;
exports.getElement = getElement;
exports.findParentVm = findParentVm;

var _vue = _interopRequireDefault(require("vue"));

function isType(value, type) {
  return Object.prototype.toString.call(value) === "[object ".concat(type, "]");
}

function isEmptyObject(obj) {
  return isType(obj, 'Object') && !Object.keys(obj).length;
}

function isVueInstance(el) {
  return el.__vue__ && el.__vue__ instanceof _vue["default"] && el.__vue__;
}

function getElement(target) {
  if (target instanceof _vue["default"]) {
    return target.$el;
  } else if (target instanceof Element) {
    return target;
  } else if (typeof target === 'string') {
    return document.querySelector(target);
  } else {
    return null;
  }
}

function findParentVm(el) {
  var dom = getElement(el);
  if (!dom) return null;
  var parentVm, currentVm;

  if (currentVm = isVueInstance(dom)) {
    return parentVm = currentVm.$parent;
  } else {
    var parentNode = dom.parentNode;

    while (parentNode && !(parentVm = isVueInstance(parentNode))) {
      parentNode = parentNode.parentNode;
    }

    return parentVm;
  }
}