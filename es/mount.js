import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import Vue from 'vue';
import { isOneOf, isType, isEmptyObject, isVueInstance, findParentVm, getElement } from './utils';
/**
 * 
 * @param {MountOptions} options
 * @param {Object} options.props component props data
 * @param {Object} options.data component data
 * @param {Object} options.target component mount target. Options: `new`,`root` Default: `new`
 * @param {Object} options.root app root element
 * @param {Object} options.rootOptions app root instance options
 */

function parseOptions(options) {
  var _ref = options || {},
      _ref$props = _ref.props,
      props = _ref$props === void 0 ? {} : _ref$props,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? {} : _ref$data,
      _ref$on = _ref.on,
      on = _ref$on === void 0 ? {} : _ref$on,
      _ref$target = _ref.target,
      target = _ref$target === void 0 ? 'new' : _ref$target,
      _ref$root = _ref.root,
      root = _ref$root === void 0 ? '#app' : _ref$root,
      _ref$rootOptions = _ref.rootOptions,
      rootOptions = _ref$rootOptions === void 0 ? {} : _ref$rootOptions;

  var rootEl = getElement(root);
  var rootVm = isVueInstance(rootEl);
  rootVm = rootVm && rootVm.$root;
  return {
    rootEl: rootEl,
    rootVm: rootVm,
    target: target,
    targetElement: getElement(target),
    propsData: props,
    targetData: data,
    targetEventListener: on,
    rootOptions: rootOptions
  };
}

var Mount =
/*#__PURE__*/
function () {
  function Mount(component, options) {
    _classCallCheck(this, Mount);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "component_options", void 0);

    _defineProperty(this, "component_constructor", void 0);

    _defineProperty(this, "component_instance", void 0);

    _defineProperty(this, "_to_append_component", false);

    _defineProperty(this, "_to_append_root", false);

    _defineProperty(this, "_to_create_root", false);

    _defineProperty(this, "_is_destroyed", false);

    _defineProperty(this, "_created_root_vue", void 0);

    this.component_options = component;
    this.options = parseOptions(options);
    this.component_constructor = Vue.extend(component);
  }
  /**
   * Generate instance (only once)
   * @description Only generate vue component instannce (or vue instance), and would do nothing with components tree
   * @param {MountOptions} opt mount options
   * @returns {Vue}
   */


  _createClass(Mount, [{
    key: "getInstance",
    value: function getInstance() {
      var _this = this;

      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = isEmptyObject(opt) ? this.options : Object.assign(this.options, parseOptions(opt));
      if (this._is_destroyed) return null;

      if (this.component_instance) {
        // Instance has been/is being destroyed
        if (this.component_instance._isDestroyed || this.component_instance._isBeingDestroyed) {
          this.destroy();
          return this.getInstance(opt);
        } else {
          return this.component_instance;
        }
      } // Has specific target element


      if (options.targetElement) {
        this._to_append_component = true;
        this.component_instance = new this.component_constructor(options);
      } // Would mount append to root
      else if (isOneOf(options.target, 'root', 'new')) {
          this._to_append_root = true;

          if (options.rootVm && options.target !== 'new') {
            var instance = this.component_instance = new this.component_constructor(options);

            if (isType(options.targetData, 'Object')) {
              Object.assign(instance, options.targetData);
            }
          } else {
            this._to_create_root = true;
            var rootOptions = {
              data: options.propsData,
              render: function render(h) {
                var component = _this.component_options;
                return h(component, {
                  props: options.propsData
                });
              }
            };

            if (isType(options.rootOptions, 'Object')) {
              Object.assign(rootOptions, options.rootOptions);
            }

            var rootVue = new Vue(rootOptions);

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
        } // Modify component data


      if (isType(options.targetData, 'Object')) {
        Object.assign(this.component_instance, options.targetData);
      } // Attach component event listeners


      if (isType(options.targetEventListener, 'Object')) {
        Object.keys(options.targetEventListener).forEach(function (event) {
          var value = options.targetEventListener[event];
          var eventListener,
              attachMethod = _this.component_instance.$on; // Parse event listener config

          if (isType(value, 'Function')) {
            eventListener = value;
          } else if (isType(value, 'Object')) {
            var handler = value.handler,
                _value$once = value.once,
                once = _value$once === void 0 ? false : _value$once;

            if (once) {
              attachMethod = _this.component_instance.$once;
            }

            eventListener = handler;
          }

          var callback = function callback() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            eventListener.apply(_this, [].concat(args, [_this.component_instance, _this]));
          }; // Attach listener


          attachMethod.call(_this.component_instance, event, callback);
        });
      }

      if (this._to_append_root) {
        if (this._to_create_root) {
          // Emit instance mount event
          this.component_instance.$emit('mount:mount');
        }
      }

      this.component_instance && (this.component_instance.__mount__ = this);
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
      var instance = this.component_instance = this.getInstance(opt);
      var options = this.options; // Instance would not mount more than once

      if (!instance || instance._isMounted) return instance; // Append to root vue instance

      if (this._to_append_root) {
        if (!this._to_create_root) {
          instance.$root = options.rootVm;
          instance.$parent = options.rootVm;
          options.rootVm.$children = _toConsumableArray(new Set([].concat(_toConsumableArray(options.rootVm.$children), [instance])));
          instance.$mount();
          options.rootEl.appendChild(instance.$el);
        } else {// NOTE: instance has been mounted in method `getInstance`
        }
      } // Append to vue component instance
      else {
          var hostVm = isVueInstance(this.options.targetElement);

          if (hostVm) {
            var _parent = hostVm.$parent;
            hostVm.$emit('mount:destroy');
            hostVm.$destroy();
            instance.$parent = _parent;
            _parent && (_parent.$children = _toConsumableArray(new Set([].concat(_toConsumableArray(_parent.$children), [instance]))));
          }

          var parentVm = findParentVm(this.options.targetElement);

          if (parentVm) {
            parentVm.$children = _toConsumableArray(new Set([].concat(_toConsumableArray(parentVm.$children), [instance])));
            instance.$parent = parentVm;
            instance.$root = parentVm.$root;
          }

          instance.$mount(this.options.targetElement);
        }

      instance.$el.__mount__ = this; // Emit instance mount event

      instance.$emit('mount:mount');
      return instance;
    }
    /**
     * @returns {Vue}
     */

  }, {
    key: "destroy",
    value: function destroy() {
      var instance = this.component_instance;
      instance.$emit('mount:destroy');
      instance.$destroy();
      instance.$el && instance.$el.parentNode.removeChild(instance.$el);
      this.component_instance = null;
      this._to_append_component = false;
      this._to_append_root = false;
      this._to_create_root = false;
      this._is_destroyed = false;
      this._created_root_vue = null;
      this._is_destroyed = true;
      return instance;
    }
  }, {
    key: "getDom",
    value: function getDom() {
      return this.component_instance && this.component_instance.$el;
    }
  }]);

  return Mount;
}();

export default Mount;
export function mount(component, opt) {
  return new Mount(component, opt).mount();
}