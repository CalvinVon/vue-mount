"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mount = mount;
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

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
      _ref$target = _ref.target,
      target = _ref$target === void 0 ? 'new' : _ref$target,
      _ref$root = _ref.root,
      root = _ref$root === void 0 ? '#app' : _ref$root;

  var rootEl = (0, _utils.getElement)(root);
  var rootVm = (0, _utils.isVueInstance)(rootEl);
  rootVm = rootVm && rootVm.$root;
  return {
    rootEl: rootEl,
    rootVm: rootVm,
    target: target,
    targetElement: (0, _utils.getElement)(target),
    propsData: props,
    targetData: data
  };
}

var Mount =
/*#__PURE__*/
function () {
  function Mount(component, options) {
    (0, _classCallCheck2["default"])(this, Mount);
    (0, _defineProperty2["default"])(this, "options", void 0);
    (0, _defineProperty2["default"])(this, "component_options", void 0);
    (0, _defineProperty2["default"])(this, "component_constructor", void 0);
    (0, _defineProperty2["default"])(this, "component_instance", void 0);
    (0, _defineProperty2["default"])(this, "component_vm", void 0);
    (0, _defineProperty2["default"])(this, "_to_append_component", false);
    (0, _defineProperty2["default"])(this, "_to_append_root", false);
    (0, _defineProperty2["default"])(this, "_to_create_root", false);
    (0, _defineProperty2["default"])(this, "_created_root_vue", void 0);
    this.component_options = component;
    this.options = parseOptions(options);
    this.component_constructor = _vue["default"].extend(component);
  }
  /**
   * Generate instance (only once)
   * @description Only generate vue component instannce (or vue instance), and would do nothing with components tree
   * @param {MountOptions} opt mount options
   */


  (0, _createClass2["default"])(Mount, [{
    key: "getInstance",
    value: function getInstance() {
      var _this = this;

      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = (0, _utils.isEmptyObject)(opt) ? this.options : Object.assign(this.options, parseOptions(opt));

      if (this.component_instance) {
        return this.component_instance;
      } // Has specific target element


      if (options.targetElement) {
        this._to_append_component = true;
        var instance = this.component_instance = new this.component_constructor(options);

        if ((0, _utils.isType)(options.targetData, 'Object')) {
          Object.assign(instance, options.targetData);
        }
      } // Would mount append to root
      else if ((0, _utils.isOneOf)(options.target, 'root', 'new')) {
          this._to_append_root = true;

          if (options.rootVm && options.target !== 'new') {
            var _instance = this.component_instance = new this.component_constructor(options);

            if ((0, _utils.isType)(options.targetData, 'Object')) {
              Object.assign(_instance, options.targetData);
            }
          } else {
            this._to_create_root = true;
            var rootVue = new _vue["default"]({
              data: options.propsData,
              render: function render(h) {
                var component = _this.component_options;
                return h(component, {
                  props: options.propsData
                });
              }
            });

            if (options.rootEl) {
              if (options.rootVm) {
                rootVue.$mount();

                if (options.target === 'new') {
                  document.body.appendChild(rootVue.$el);
                } else {
                  options.rootEl.appendChild(rootVue.$el);
                }
              } else {
                rootVue.$mount(options.rootEl);
              }
            } else {
              rootVue.$mount();
              document.body.appendChild(rootVue.$el);
            }

            this._created_root_vue = rootVue;
            this.component_instance = rootVue.$children[0];
          }
        } else {
          throw new Error("[vue-mount] Can't mount to target with value [".concat(options.target, "]"));
        } // this.component_instance.__mount__ = this;


      return this.component_instance;
    }
    /**
     * Mount component
     * @description Combine vue component instance with components tree
     * @param {Object} opt MountOptions
     */

  }, {
    key: "mount",
    value: function mount(opt) {
      var instance = this.component_vm = this.getInstance(opt);
      var options = this.options; // Instance would not mount more than once

      if (instance._isMounted) return instance; // Append to root vue instance

      if (this._to_append_root) {
        if (!this._to_create_root) {
          instance.$root = options.rootVm;
          instance.$parent = options.rootVm;
          options.rootVm.$children = (0, _toConsumableArray2["default"])(new Set([].concat((0, _toConsumableArray2["default"])(options.rootVm.$children), [instance])));
          instance.$mount();
          options.rootEl.appendChild(instance.$el);
        } else {// NOTE: instance has been mounted in method `getInstance`
        }
      } // Append to vue component instance
      else {
          var hostVm = (0, _utils.isVueInstance)(this.options.targetElement);

          if (hostVm) {
            var _parent = hostVm.$parent;
            hostVm.$destroy();
            instance.$parent = _parent;
            _parent.$children = (0, _toConsumableArray2["default"])(new Set([].concat((0, _toConsumableArray2["default"])(_parent.$children), [instance])));
          }

          var parentVm = (0, _utils.findParentVm)(this.options.targetElement);

          if (parentVm) {
            parentVm.$children = (0, _toConsumableArray2["default"])(new Set([].concat((0, _toConsumableArray2["default"])(parentVm.$children), [instance])));
            instance.$parent = parentVm;
            instance.$root = parentVm.$root;
          }

          instance.$mount(this.options.targetElement);
        }

      instance.$el.__mount__ = this;
      return instance;
    }
  }, {
    key: "getDom",
    value: function getDom() {
      return this.component_vm && this.component_vm.$el;
    }
  }]);
  return Mount;
}();

var _default = Mount;
exports["default"] = _default;

function mount(component, opt) {
  return new Mount(component, opt).mount();
}