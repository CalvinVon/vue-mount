import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import Vue from 'vue';
import { inspectVueVersion, isOneOf, isType, isEmptyObject, isVueInstance, isRootVue, findParentVm, getElement, checkAndRmUnmountedVm } from './utils';
/**
 * Parse options
 * @param {MountOptions} options
 * @param {Object} options.props component props data
 * @param {Object} options.data component data
 * @param {string|Element|Vue|VNode} options.target component mount target.
 *      - when string: Options: `new`,`root`. Default: `new`.
 * @param {string} options.mode component mount mode.
 *      - Options: `replace`,`append`. Default: `replace`.
 *      - disabled when target is `new` or `root`.
 * @param {string|Element|Vue|VNode} options.root app root element
 * @param {VueOptions} options.rootOptions app root instance options
 */

function parseOptions(options) {
  var _ref = options || {},
      _ref$props = _ref.props,
      props = _ref$props === void 0 ? {} : _ref$props,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? {} : _ref$data,
      _ref$on = _ref.on,
      on = _ref$on === void 0 ? {} : _ref$on,
      _ref$watch = _ref.watch,
      watch = _ref$watch === void 0 ? {} : _ref$watch,
      _ref$target = _ref.target,
      target = _ref$target === void 0 ? 'new' : _ref$target,
      _ref$mode = _ref.mode,
      mode = _ref$mode === void 0 ? 'replace' : _ref$mode,
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
    mode: mode,
    propsData: props,
    targetData: data,
    targetWatch: watch,
    targetEventListener: on,
    rootOptions: rootOptions
  };
}

function applyTargetWithData(mountInstance, data) {
  var instance = mountInstance.component_instance;

  if (isType(data, 'Object')) {
    Object.assign(instance, data);
  }
}

function applyTargetWithWatch(mountInstance, watchOptions) {
  function rewriteHandler(handler) {
    var originHandler = handler || new Function();
    return function handlerWrapper() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      originHandler.apply(mountInstance, [].concat(args, [instance, mountInstance]));
    };
  }

  if (!isType(watchOptions, 'Object')) return;
  var instance = mountInstance.component_instance;
  Object.keys(watchOptions).forEach(function (key) {
    var watchOption = watchOptions[key];

    if (isType(watchOption, 'Object')) {
      watchOption.handler = rewriteHandler(watchOption.handler);
      var unwatch = instance.$watch(key, watchOption);
      mountInstance.unwatchMapper[key] = unwatch;
    }

    if (isType(watchOption, 'Function')) {
      var _unwatch = instance.$watch(key, rewriteHandler(watchOption));

      mountInstance.unwatchMapper[key] = _unwatch;
    }
  });
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

    _defineProperty(this, "unwatchMapper", {});

    _defineProperty(this, "_to_mount_component", false);

    _defineProperty(this, "_to_mount_root", false);

    _defineProperty(this, "_to_create_root", false);

    _defineProperty(this, "_is_destroyed", false);

    _defineProperty(this, "_created_root_vue", void 0);

    inspectVueVersion();
    this.component_options = component;
    this.options = parseOptions(options);
    this.component_constructor = Vue.extend(component);
  }
  /**
   * Generate a vue component instance
   * @description Only generate vue component instannce (or vue instance), and would do nothing with components tree
   * @param {MountOptions} opt mount options
   * @returns {Vue} Vue instance
   */


  _createClass(Mount, [{
    key: "getInstance",
    value: function getInstance() {
      var _this = this;

      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = isEmptyObject(opt) ? this.options : Object.assign(this.options, parseOptions(opt));

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
        if (!isVueInstance(options.targetElement) && !findParentVm(options.targetElement)) {
          this._to_mount_root = true;
          this._to_create_root = true;
        } else {
          this._to_mount_component = true;
          this.component_instance = new this.component_constructor(options);
        }
      } // Should mount append to root
      else if (isOneOf(options.target, 'root', 'new')) {
          this._to_mount_root = true;

          if (options.rootVm && options.target !== 'new') {
            this.component_instance = new this.component_constructor(options);
          } // Should create new root
          else {
              this._to_create_root = true;
            }
        } else {
          throw new Error("[vue-mount] Can't mount to target with value [".concat(options.target, "]"));
        }

      if (this._to_mount_root) {
        if (this._to_create_root) {
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

          if (isOneOf(options.target, 'new', 'root') && options.rootEl) {
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
      } // Modify component data


      applyTargetWithData(this, options.targetData); // Apply watch options

      applyTargetWithWatch(this, options.targetWatch); // Attach component event listeners

      this._attachEventListeners(options.targetEventListener);

      if (this._to_mount_root && this._to_create_root) {
        // Emit instance mount event
        this.component_instance.$emit('mount:mount');
      }

      if (this.component_instance) {
        this.component_instance.__mount__ = this;

        this.component_instance.$getMount = function () {
          return _this;
        };
      }

      this._is_destroyed = false;
      return this.component_instance;
    }
    /**
     * Mount Vue component and return a Vue component instance
     * @description Combine vue component instance with components tree
     * @param {Object} opt MountOptions
     * 
     * @returns {Vue} Vue instance
     */

  }, {
    key: "mount",
    value: function mount(opt) {
      var instance = this.component_instance = this.getInstance(opt);
      var options = this.options; // Instance would not mount more than once

      if (instance._isMounted) return instance; // Append to root vue instance

      if (this._to_mount_root) {
        if (!this._to_create_root) {
          checkAndRmUnmountedVm(options.rootVm);
          instance.$root = options.rootVm;
          instance.$parent = options.rootVm;
          options.rootVm.$children = _toConsumableArray(new Set([].concat(_toConsumableArray(options.rootVm.$children), [instance])));
          instance.$mount();
          options.rootEl.appendChild(instance.$el);
        } else {// NOTE: instance has been mounted in method `getInstance`
        }
      } // Append to vue component instance
      else {
          var hostVm = isVueInstance(options.targetElement),
              parentVm = findParentVm(options.targetElement);
          if (isRootVue(hostVm)) hostVm = hostVm.$children[0];

          if (hostVm) {
            // Whether replace host vm
            if (options.mode === 'append') {
              parentVm = hostVm;
            } else {
              var _parent = hostVm.$parent;
              hostVm.$emit('mount:destroy');
              hostVm.$destroy();
              instance.$parent = _parent;
              _parent && (_parent.$children = _toConsumableArray(new Set([].concat(_toConsumableArray(_parent.$children), [instance]))));
            }
          }

          if (parentVm) {
            parentVm.$children = _toConsumableArray(new Set([].concat(_toConsumableArray(parentVm.$children), [instance])));
            instance.$parent = parentVm;
            instance.$root = parentVm.$root;
          }

          if (options.mode === 'append') {
            // Append mount
            instance.$mount();
            options.targetElement.appendChild(instance.$el);
          } else {
            // Replace Mount
            instance.$mount(options.targetElement);
            checkAndRmUnmountedVm(parentVm);
          }
        }

      instance.$el.__mount__ = this; // Emit instance mount event

      instance.$emit('mount:mount');
      return instance;
    }
    /**
     * Set component `props`/`data` and `listeners`.
     * @param {MountOptions} opt
     * @returns {Mount}
     */

  }, {
    key: "set",
    value: function set(opt) {
      var instance = this.component_instance = this.getInstance();

      var _ref2 = opt || {},
          _ref2$props = _ref2.props,
          props = _ref2$props === void 0 ? {} : _ref2$props,
          _ref2$data = _ref2.data,
          data = _ref2$data === void 0 ? {} : _ref2$data,
          _ref2$on = _ref2.on,
          on = _ref2$on === void 0 ? {} : _ref2$on,
          _ref2$watch = _ref2.watch,
          watch = _ref2$watch === void 0 ? {} : _ref2$watch;

      if (isType(data, 'Object')) {
        Object.assign(instance, data);
      }

      applyTargetWithWatch(this, watch);
      var _props = instance.$props;

      if (this._to_create_root) {
        _props = this._created_root_vue;
      }

      if (isType(props, 'Object')) {
        Object.assign(_props, props);
      }

      this._attachEventListeners(on);

      return this;
    }
    /**
     * Destroy the Vue component instance and remove the associated elements.
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
      this._to_mount_component = false;
      this._to_mount_root = false;
      this._to_create_root = false;
      this._created_root_vue = null;
      this._is_destroyed = true;
      this.unwatchMapper = {};
      return instance;
    }
  }, {
    key: "getDom",
    value: function getDom() {
      return this.component_instance && this.component_instance.$el;
    }
  }, {
    key: "_attachEventListeners",
    value: function _attachEventListeners(listeners) {
      var _this2 = this;

      if (isType(listeners, 'Object')) {
        Object.keys(listeners).forEach(function (event) {
          var value = listeners[event];
          var eventListener,
              attachMethod = _this2.component_instance.$on; // Parse event listener config

          if (isType(value, 'Function')) {
            eventListener = value;
          } else if (isType(value, 'Object')) {
            var handler = value.handler,
                _value$once = value.once,
                once = _value$once === void 0 ? false : _value$once;

            if (once) {
              attachMethod = _this2.component_instance.$once;
            }

            eventListener = handler;
          }

          var callback = function callback() {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            eventListener.apply(_this2, [].concat(args, [_this2.component_instance, _this2]));
          }; // Attach listener


          attachMethod.call(_this2.component_instance, event, callback);
        });
      }
    }
  }]);

  return Mount;
}();

export default Mount;
export function mount(component, opt) {
  return new Mount(component, opt).mount();
}