(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "vue", "./mount"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("vue"), require("./mount"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.vue, global.mount);
    global.utils = mod.exports;
  }
})(this, function (_exports, _vue, _mount) {
  "use strict";

  var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isOneOf = isOneOf;
  _exports.isType = isType;
  _exports.isEmptyObject = isEmptyObject;
  _exports.isVueInstance = isVueInstance;
  _exports.isRootVue = isRootVue;
  _exports.isMountInstance = isMountInstance;
  _exports.getElement = getElement;
  _exports.findParentVm = findParentVm;
  _exports.checkAndRmUnmountedVm = checkAndRmUnmountedVm;
  _vue = _interopRequireDefault(_vue);
  _mount = _interopRequireDefault(_mount);

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
    return el && el.__vue__ && el.__vue__ instanceof _vue.default && el.__vue__;
  }
  /**
   * judge vm is an root vue instance
   * @param {Vue} vm vue instance
   */


  function isRootVue(vm) {
    if (vm && vm.$children[0]) {
      var child = vm.$children[0];

      if (child.$el === vm.$el) {
        // Is an Vue root instance but not an Vue component
        return true;
      }
    }

    return false;
  }

  function isMountInstance(el) {
    return el.__mount__ && el.__mount__ instanceof _mount.default && el.__mount__;
  }

  function getElement(target) {
    if (!target) return null;

    if (target instanceof _vue.default) {
      return target.$el;
    } else if (target instanceof Element) {
      return target;
    } else if (typeof target === 'string') {
      return document.querySelector(target);
    } else {
      return target.elm || null;
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

      if (isRootVue(parentVm)) {
        var child = parentVm.$children[0]; // Is an Vue root instance but not an Vue component

        return child;
      }

      return parentVm;
    }
  }

  function contains(a, b) {
    return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(arg) & 16);
  } // Check child component and if the element attached is removed, destroy them


  function checkAndRmUnmountedVm(vm) {
    if (!vm) return;
    var hostEl = vm.$el;
    vm.$children = vm.$children.filter(function (childVm) {
      var childEl = childVm.$el;

      if (!contains(hostEl, childEl)) {
        childVm.$emit('mount:destroy');
        childVm.$destroy();
        return false;
      } else {
        return true;
      }
    });
  }
});