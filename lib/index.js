(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./mount"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./mount"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mount);
    global.index = mod.exports;
  }
})(this, function (_exports, _mount) {
  "use strict";

  var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "mount", {
    enumerable: true,
    get: function get() {
      return _mount.mount;
    }
  });
  _exports.default = void 0;
  _mount = _interopRequireWildcard(_mount);
  var _default = _mount.default;
  _exports.default = _default;
});