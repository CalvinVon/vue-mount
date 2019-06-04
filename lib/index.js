"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _vue = _interopRequireDefault(require("vue"));

var _utils = require("./utils");

var Mount =
/*#__PURE__*/
function () {
  function Mount(component, options) {
    (0, _classCallCheck2["default"])(this, Mount);
    (0, _defineProperty2["default"])(this, "component_constructor", void 0);
    (0, _defineProperty2["default"])(this, "component_instance", void 0);
    (0, _defineProperty2["default"])(this, "component_vm", void 0);
    (0, _defineProperty2["default"])(this, "options", void 0);
    this.component_constructor = _vue["default"].extend(component);
    this.options = (0, _utils.parseOptions)(options);
  }

  (0, _createClass2["default"])(Mount, [{
    key: "getInstance",
    value: function getInstance(opt) {
      var options = (0, _utils.isEmptyObject)(opt) ? this.options : (0, _utils.parseOptions)(opt);
      var instance = this.component_instance || new this.component_constructor(options);
      return this.component_instance = instance;
    }
  }, {
    key: "getDom",
    value: function getDom() {
      return this.component_vm && this.component_vm.$el;
    }
  }, {
    key: "mount",
    value: function mount(opt) {
      var instance = this.getInstance(opt);
      return this.component_vm = instance.$mount();
    }
  }]);
  return Mount;
}();

var _default = Mount;
exports["default"] = _default;