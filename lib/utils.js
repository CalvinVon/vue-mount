"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOneOf = isOneOf;
exports.isType = isType;
exports.isEmptyObject = isEmptyObject;
exports.isVueInstance = isVueInstance;
exports.isMountInstance = isMountInstance;
exports.getElement = getElement;
exports.findParentVm = findParentVm;

var _vue = _interopRequireDefault(require("vue"));

var _ = _interopRequireDefault(require("."));

function isOneOf(value) {
  for (var _len = arguments.length, opt = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    opt[_key - 1] = arguments[_key];
  }

  var options = opt;

  if (isType(opt[0]) === 'Array') {
    options = opt[0];
  }

  return options.some(function (it) {
    return it === value;
  });
}

function isType(value, type) {
  return Object.prototype.toString.call(value) === "[object ".concat(type, "]");
}

function isEmptyObject(obj) {
  return isType(obj, 'Object') && !Object.keys(obj).length;
}
/**
 * judge is an instance of Vue and return vm
 * @param {Element} el
 */


function isVueInstance(el) {
  return el.__vue__ && el.__vue__ instanceof _vue["default"] && el.__vue__;
}

function isMountInstance(el) {
  return el.__mount__ && el.__mount__ instanceof _["default"] && el.__mount__;
}

function getElement(target) {
  if (!target) return null;

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

    if (parentVm.$children[0]) {
      var child = parentVm.$children[0];

      if (child.$el === parentVm.$el) {
        // Is an Vue root instance but not an Vue component
        return child;
      }
    }

    return parentVm;
  }
}