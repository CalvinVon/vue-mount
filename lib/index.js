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

function parseOptions(options) {
  var _ref = options || {},
      _ref$props = _ref.props,
      props = _ref$props === void 0 ? {} : _ref$props,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? {} : _ref$data,
      target = _ref.target;

  return {
    target: (0, _utils.getElement)(target),
    propsData: props,
    targetData: data
  };
}

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
    this.options = parseOptions(options);
  }

  (0, _createClass2["default"])(Mount, [{
    key: "getInstance",
    value: function getInstance(opt) {
      var options = (0, _utils.isEmptyObject)(opt) ? this.options : Object.assign(this.options, parseOptions(opt));
      var instance = this.component_instance || new this.component_constructor(options);

      if ((0, _utils.isType)(options.targetData, 'Object')) {
        Object.assign(instance, options.targetData);
      }

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
      var instance = this.component_vm = this.getInstance(opt);

      if (!this.options.target) {
        instance.$mount(this.options.target);
        document.body.appendChild(this.component_vm.$el);
      } else {
        var hostVm = (0, _utils.isVueInstance)(this.options.target);

        if (hostVm) {
          hostVm.$destroy();
        } // adding to components tree


        if (!instance._isMounted) {
          var parentVm = (0, _utils.findParentVm)(this.options.target);

          if (parentVm) {
            parentVm.$children.push(instance);
            instance.$parent = parentVm;
            instance.$root = parentVm.$root;
          }
        }

        instance.$mount(this.options.target);
      }

      return instance;
    }
  }]);
  return Mount;
}();

var _default = Mount;
exports["default"] = _default;