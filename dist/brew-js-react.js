(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("brew-js"), require("zeta-dom"), require("zeta-dom-react"));
	else if(typeof define === 'function' && define.amd)
		define("brew-js-react", ["react", "react-dom", "brew-js", "zeta-dom", "zeta-dom-react"], factory);
	else if(typeof exports === 'object')
		exports["brew-js-react"] = factory(require("react"), require("react-dom"), require("brew-js"), require("zeta-dom"), require("zeta-dom-react"));
	else
		root["brew-js-react"] = factory(root["React"], root["ReactDOM"], root["brew"], root["zeta"], root["zeta-dom-react"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__359__, __WEBPACK_EXTERNAL_MODULE__318__, __WEBPACK_EXTERNAL_MODULE__80__, __WEBPACK_EXTERNAL_MODULE__654__, __WEBPACK_EXTERNAL_MODULE__103__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 103:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__103__;

/***/ }),

/***/ 80:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__80__;

/***/ }),

/***/ 359:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__359__;

/***/ }),

/***/ 318:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__318__;

/***/ }),

/***/ 654:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__654__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ entry)
});

// NAMESPACE OBJECT: ./src/index.js
var src_namespaceObject = {};
__webpack_require__.r(src_namespaceObject);
__webpack_require__.d(src_namespaceObject, {
  "AnimateMixin": () => (AnimateMixin),
  "AnimateSequenceItemMixin": () => (AnimateSequenceItemMixin),
  "AnimateSequenceMixin": () => (AnimateSequenceMixin),
  "ClassNameMixin": () => (ClassNameMixin),
  "Dialog": () => (Dialog),
  "FlyoutMixin": () => (FlyoutMixin),
  "FocusStateMixin": () => (FocusStateMixin),
  "LoadingStateMixin": () => (LoadingStateMixin),
  "Mixin": () => (Mixin),
  "ScrollableMixin": () => (ScrollableMixin),
  "StatefulMixin": () => (StatefulMixin),
  "createDialog": () => (createDialog),
  "linkTo": () => (linkTo),
  "registerView": () => (registerView),
  "renderView": () => (renderView),
  "useAnimateMixin": () => (useAnimateMixin),
  "useAnimateSequenceMixin": () => (useAnimateSequenceMixin),
  "useAppReady": () => (useAppReady),
  "useFlyoutMixin": () => (useFlyoutMixin),
  "useFocusStateMixin": () => (useFocusStateMixin),
  "useLanguage": () => (useLanguage),
  "useLoadingStateMixin": () => (useLoadingStateMixin),
  "useMixinRef": () => (useMixinRef),
  "useRouteParam": () => (useRouteParam),
  "useScrollableMixin": () => (useScrollableMixin)
});

// EXTERNAL MODULE: external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"}
var external_commonjs_react_commonjs2_react_amd_react_root_React_ = __webpack_require__(359);
// EXTERNAL MODULE: external {"commonjs":"react-dom","commonjs2":"react-dom","amd":"react-dom","root":"ReactDOM"}
var external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_ = __webpack_require__(318);
// EXTERNAL MODULE: external {"commonjs":"brew-js","commonjs2":"brew-js","amd":"brew-js","root":"brew"}
var external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_ = __webpack_require__(80);
// EXTERNAL MODULE: external {"commonjs":"zeta-dom","commonjs2":"zeta-dom","amd":"zeta-dom","root":"zeta"}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_ = __webpack_require__(654);
;// CONCATENATED MODULE: ./tmp/zeta-dom/util.js

var _zeta$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
    noop = _zeta$util.noop,
    either = _zeta$util.either,
    is = _zeta$util.is,
    isUndefinedOrNull = _zeta$util.isUndefinedOrNull,
    isArray = _zeta$util.isArray,
    isFunction = _zeta$util.isFunction,
    isThenable = _zeta$util.isThenable,
    isPlainObject = _zeta$util.isPlainObject,
    isArrayLike = _zeta$util.isArrayLike,
    makeArray = _zeta$util.makeArray,
    extend = _zeta$util.extend,
    each = _zeta$util.each,
    map = _zeta$util.map,
    grep = _zeta$util.grep,
    splice = _zeta$util.splice,
    any = _zeta$util.any,
    single = _zeta$util.single,
    kv = _zeta$util.kv,
    pick = _zeta$util.pick,
    exclude = _zeta$util.exclude,
    mapGet = _zeta$util.mapGet,
    mapRemove = _zeta$util.mapRemove,
    arrRemove = _zeta$util.arrRemove,
    setAdd = _zeta$util.setAdd,
    equal = _zeta$util.equal,
    combineFn = _zeta$util.combineFn,
    executeOnce = _zeta$util.executeOnce,
    createPrivateStore = _zeta$util.createPrivateStore,
    setTimeoutOnce = _zeta$util.setTimeoutOnce,
    util_setImmediate = _zeta$util.setImmediate,
    setImmediateOnce = _zeta$util.setImmediateOnce,
    throwNotFunction = _zeta$util.throwNotFunction,
    keys = _zeta$util.keys,
    values = _zeta$util.values,
    util_hasOwnProperty = _zeta$util.hasOwnProperty,
    getOwnPropertyDescriptors = _zeta$util.getOwnPropertyDescriptors,
    util_define = _zeta$util.define,
    definePrototype = _zeta$util.definePrototype,
    defineOwnProperty = _zeta$util.defineOwnProperty,
    defineGetterProperty = _zeta$util.defineGetterProperty,
    defineHiddenProperty = _zeta$util.defineHiddenProperty,
    defineAliasProperty = _zeta$util.defineAliasProperty,
    defineObservableProperty = _zeta$util.defineObservableProperty,
    watch = _zeta$util.watch,
    watchOnce = _zeta$util.watchOnce,
    watchable = _zeta$util.watchable,
    inherit = _zeta$util.inherit,
    deepFreeze = _zeta$util.deepFreeze,
    iequal = _zeta$util.iequal,
    randomId = _zeta$util.randomId,
    repeat = _zeta$util.repeat,
    camel = _zeta$util.camel,
    hyphenate = _zeta$util.hyphenate,
    ucfirst = _zeta$util.ucfirst,
    lcfirst = _zeta$util.lcfirst,
    trim = _zeta$util.trim,
    matchWord = _zeta$util.matchWord,
    htmlDecode = _zeta$util.htmlDecode,
    resolve = _zeta$util.resolve,
    reject = _zeta$util.reject,
    always = _zeta$util.always,
    resolveAll = _zeta$util.resolveAll,
    catchAsync = _zeta$util.catchAsync,
    setPromiseTimeout = _zeta$util.setPromiseTimeout;

;// CONCATENATED MODULE: ./src/include/zeta-dom/util.js

;// CONCATENATED MODULE: ./tmp/zeta-dom/domUtil.js

var domUtil_zeta$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
    domReady = domUtil_zeta$util.domReady,
    tagName = domUtil_zeta$util.tagName,
    domUtil_is = domUtil_zeta$util.is,
    isVisible = domUtil_zeta$util.isVisible,
    matchSelector = domUtil_zeta$util.matchSelector,
    comparePosition = domUtil_zeta$util.comparePosition,
    connected = domUtil_zeta$util.connected,
    containsOrEquals = domUtil_zeta$util.containsOrEquals,
    acceptNode = domUtil_zeta$util.acceptNode,
    combineNodeFilters = domUtil_zeta$util.combineNodeFilters,
    iterateNode = domUtil_zeta$util.iterateNode,
    iterateNodeToArray = domUtil_zeta$util.iterateNodeToArray,
    getCommonAncestor = domUtil_zeta$util.getCommonAncestor,
    parentsAndSelf = domUtil_zeta$util.parentsAndSelf,
    selectIncludeSelf = domUtil_zeta$util.selectIncludeSelf,
    selectClosestRelative = domUtil_zeta$util.selectClosestRelative,
    createNodeIterator = domUtil_zeta$util.createNodeIterator,
    createTreeWalker = domUtil_zeta$util.createTreeWalker,
    bind = domUtil_zeta$util.bind,
    bindUntil = domUtil_zeta$util.bindUntil,
    dispatchDOMMouseEvent = domUtil_zeta$util.dispatchDOMMouseEvent,
    removeNode = domUtil_zeta$util.removeNode,
    getClass = domUtil_zeta$util.getClass,
    setClass = domUtil_zeta$util.setClass,
    getScrollOffset = domUtil_zeta$util.getScrollOffset,
    getScrollParent = domUtil_zeta$util.getScrollParent,
    getContentRect = domUtil_zeta$util.getContentRect,
    scrollBy = domUtil_zeta$util.scrollBy,
    scrollIntoView = domUtil_zeta$util.scrollIntoView,
    createRange = domUtil_zeta$util.createRange,
    rangeIntersects = domUtil_zeta$util.rangeIntersects,
    rangeEquals = domUtil_zeta$util.rangeEquals,
    rangeCovers = domUtil_zeta$util.rangeCovers,
    compareRangePosition = domUtil_zeta$util.compareRangePosition,
    makeSelection = domUtil_zeta$util.makeSelection,
    getRect = domUtil_zeta$util.getRect,
    getRects = domUtil_zeta$util.getRects,
    toPlainRect = domUtil_zeta$util.toPlainRect,
    rectEquals = domUtil_zeta$util.rectEquals,
    rectCovers = domUtil_zeta$util.rectCovers,
    rectIntersects = domUtil_zeta$util.rectIntersects,
    pointInRect = domUtil_zeta$util.pointInRect,
    mergeRect = domUtil_zeta$util.mergeRect,
    elementFromPoint = domUtil_zeta$util.elementFromPoint;

;// CONCATENATED MODULE: ./src/include/zeta-dom/domUtil.js

;// CONCATENATED MODULE: ./tmp/zeta-dom/dom.js

var _defaultExport = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom;
/* harmony default export */ const dom = (_defaultExport);
var _zeta$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    textInputAllowed = _zeta$dom.textInputAllowed,
    beginDrag = _zeta$dom.beginDrag,
    beginPinchZoom = _zeta$dom.beginPinchZoom,
    getShortcut = _zeta$dom.getShortcut,
    setShortcut = _zeta$dom.setShortcut,
    focusable = _zeta$dom.focusable,
    focused = _zeta$dom.focused,
    setModal = _zeta$dom.setModal,
    retainFocus = _zeta$dom.retainFocus,
    releaseFocus = _zeta$dom.releaseFocus,
    dom_focus = _zeta$dom.focus;

;// CONCATENATED MODULE: ./src/include/zeta-dom/dom.js


/* harmony default export */ const zeta_dom_dom = (dom);
;// CONCATENATED MODULE: ./src/dialog.js






function createDialog(props) {
  var root = document.createElement('div');
  var closing = false;
  var refresh = noop;
  var promise;

  function Component() {
    var forceRefresh = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(0)[1];

    refresh = function refresh() {
      forceRefresh(function (v) {
        return ++v;
      });
    };

    return props.onRender(extend({
      root: root,
      closeDialog: closeDialog
    }, props));
  }

  function closeDialog(value) {
    if (!closing) {
      closing = true;
      external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.closeFlyout(root, value).then(function () {
        closing = false;
        removeNode(root);
        external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_.unmountComponentAtNode(root);
        (props.onClose || noop)(root);
      });
    }
  }

  return {
    root: root,
    refresh: refresh,
    close: closeDialog,
    open: function open() {
      if (promise) {
        return promise;
      }

      root.className = props.className;

      if (props.modal) {
        root.setAttribute('is-modal', '');
      }

      document.body.appendChild(root);

      if (props.modal) {
        zeta_dom_dom.setModal(root);
      }

      zeta_dom_dom.retainFocus(zeta_dom_dom.activeElement, root);
      external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_.render(external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(Component), root);
      promise = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.openFlyout(root);
      always(promise, function () {
        promise = null;
      });
      promise.then(props.onCommit);
      (props.onOpen || noop)(root);
      return promise;
    }
  };
}
function Dialog(props) {
  /** @type {import("./dialog").DialogProps & { open: boolean }} */
  var _props = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)({
    open: false
  })[0];
  extend(_props, props);

  if (props.children) {
    _props.onRender = function () {
      return external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(external_commonjs_react_commonjs2_react_amd_react_root_React_.Fragment, null, props.children);
    };
  }

  var dialog = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return createDialog(_props);
  })[0];
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    var opened = containsOrEquals(zeta_dom_dom.root, dialog.root);

    if (either(opened, _props.open)) {
      if (!opened) {
        dialog.open();
      } else {
        dialog.close();
      }
    }
  }, [_props.open]);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return dialog.close;
  }, [dialog]);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    dialog.refresh();
  });
  return external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(external_commonjs_react_commonjs2_react_amd_react_root_React_.Fragment);
}
// EXTERNAL MODULE: external "zeta-dom-react"
var external_zeta_dom_react_ = __webpack_require__(103);
;// CONCATENATED MODULE: ./src/app.js

/** @type {Brew.AppInstance<Brew.WithRouter & Brew.WithI18n>} */

var app;
external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.install('react', function (app_) {
  // @ts-ignore: type inference issue
  app = app_;
});
external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.defaults.react = true;
;// CONCATENATED MODULE: ./src/hooks.js




function useAppReady() {
  var sReady = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(false);
  var ready = sReady[0],
      setReady = sReady[1];
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    app.ready.then(function () {
      setReady(true);
    });
  }, []);
  return ready;
}
function useLanguage() {
  return (0,external_zeta_dom_react_.useObservableProperty)(app, 'language');
}
function useRouteParam(name, defaultValue) {
  var sValue = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(app.route[name]);
  var value = sValue[0],
      setValue = sValue[1];
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    var current = app.route[name]; // route parameter might be changed after state initialization and before useEffect hook is called

    setValue(current);
    return app.route.watch(name, setValue);
  }, [name, defaultValue]);

  if (!value && defaultValue !== undefined) {
    app.navigate(app.route.getPath(extend({}, app.route, kv(name, defaultValue))), true);
  }

  return value || '';
}
;// CONCATENATED MODULE: ./src/mixins/StaticAttributeMixin.js


function StaticAttributeMixin(attributes) {
  Mixin.call(this);
  this.attributes = attributes || {};
}
definePrototype(StaticAttributeMixin, Mixin, {
  getCustomAttributes: function getCustomAttributes() {
    return extend({}, this.attributes);
  }
});
;// CONCATENATED MODULE: ./src/mixins/Mixin.js



function Mixin() {}
definePrototype(Mixin, {
  next: function next() {},
  getRef: function getRef() {
    return noop;
  },
  getClassNames: function getClassNames() {
    return [];
  },
  getCustomAttributes: function getCustomAttributes() {
    return {};
  }
});
watchable(Mixin.prototype);
util_define(Mixin, {
  get scrollableTarget() {
    return new StaticAttributeMixin({
      'scrollable-target': ''
    });
  },

  use: function use() {
    var args = makeArray(arguments);
    var ref = args[0];
    var props = {};
    var mixins = args.filter(function (v) {
      return v instanceof Mixin;
    });
    var refs = mixins.map(function (v) {
      return v.getRef();
    });

    if (ref && !(ref instanceof Mixin)) {
      if (typeof ref !== 'function') {
        refs.push(function (v) {
          ref.current = v;
        });
      } else {
        refs.push(ref);
      }

      args.shift();
    } else if (!ref) {
      args.shift();
    }

    each(mixins, function (i, v) {
      extend(props, v.getCustomAttributes());
    });
    extend(props, {
      ref: combineFn(refs),
      className: external_zeta_dom_react_.classNames.apply(null, args)
    });
    each(mixins, function (i, v) {
      v.next();
    });
    return props;
  }
});
;// CONCATENATED MODULE: ./src/mixins/StatefulMixin.js



function MixinRefImpl(mixin) {
  this.mixin = mixin;
}

definePrototype(MixinRefImpl, {
  getMixin: function getMixin() {
    return this.mixin;
  }
});
function StatefulMixin() {
  Mixin.call(this);
  this.states = {};
  this.prefix = '';
  this.counter = 0;
}
definePrototype(StatefulMixin, Mixin, {
  get ref() {
    var state = this.state;
    this.next();
    return state.ref || (state.ref = new MixinRefImpl(this.clone()));
  },

  get state() {
    var self = this;
    var key = self.prefix + self.counter;
    return self.states[key] || (self.states[key] = self.initState());
  },

  reset: function reset() {
    this.counter = 0;
    return this;
  },
  next: function next() {
    this.counter++;
    return this;
  },
  getRef: function getRef() {
    var self = this;
    var state = self.state;
    return function (current) {
      if (current !== state.element) {
        state.element = current;

        if (current) {
          self.initElement(current, state);
        }
      }
    };
  },
  elements: function elements() {
    return values(this.states).map(function (v) {
      return v.element;
    }).filter(function (v) {
      return v;
    });
  },
  initState: function initState() {
    return {
      element: null
    };
  },
  initElement: function initElement(element, state) {},
  clone: function clone() {
    return inherit(Object.getPrototypeOf(this), {
      states: this.states,
      prefix: randomId() + '.',
      counter: 0
    });
  }
});
;// CONCATENATED MODULE: ./src/mixins/ClassNameMixin.js



var ClassNameMixinSuper = StatefulMixin.prototype;
function ClassNameMixin(classNames) {
  StatefulMixin.call(this);
  this.classNames = classNames || [];
}
definePrototype(ClassNameMixin, StatefulMixin, {
  getClassNames: function getClassNames() {
    return [this.state.classNames];
  },
  initState: function initState() {
    return {
      element: null,
      classNames: {}
    };
  },
  initElement: function initElement(element, state) {
    var self = this;
    zeta_dom_dom.watchAttributes(element, ['class'], function (nodes) {
      if (nodes.includes(element)) {
        var prev = extend({}, state.classNames);
        each(self.classNames, function (i, v) {
          state.classNames[v] = element.classList.contains(v);
        });

        if (!equal(prev, state.classNames)) {
          self.onClassNameUpdated(element, prev, state.classNames);
        }
      }
    });
  },
  clone: function clone() {
    return extend(ClassNameMixinSuper.clone.call(this), {
      classNames: this.classNames
    });
  },
  onClassNameUpdated: function onClassNameUpdated(element, prevState, state) {}
});
;// CONCATENATED MODULE: ./src/mixins/AnimateMixin.js


var AnimateMixinSuper = ClassNameMixin.prototype;
function AnimateMixin() {
  ClassNameMixin.call(this, ['tweening-in', 'tweening-out']);
}
definePrototype(AnimateMixin, ClassNameMixin, {
  next: function next() {
    this.effects = undefined;
    this.trigger = undefined;
    return AnimateMixinSuper.next.call(this);
  },
  "with": function _with(props) {
    this.effects = props.effects;
    this.trigger = props.trigger;
    return this;
  },
  withEffects: function withEffects() {
    this.effects = makeArray(arguments);
    return this;
  },
  getCustomAttributes: function getCustomAttributes() {
    return extend({}, AnimateMixinSuper.getCustomAttributes.call(this), {
      'animate-in': (this.effects || []).join(' '),
      'animate-on': this.trigger || 'show'
    });
  }
});
;// CONCATENATED MODULE: ./src/mixins/AnimateSequenceItemMixin.js


var AnimateSequenceItemMixinSuper = ClassNameMixin.prototype;
function AnimateSequenceItemMixin(className) {
  ClassNameMixin.call(this, ['tweening-in', 'tweening-out']);
  this.className = className;
}
definePrototype(AnimateSequenceItemMixin, ClassNameMixin, {
  getClassNames: function getClassNames() {
    return [this.className].concat(AnimateSequenceItemMixinSuper.getClassNames.call(this));
  }
});
;// CONCATENATED MODULE: ./src/mixins/AnimateSequenceMixin.js



var AnimateSequenceMixinSuper = AnimateMixin.prototype;
var animateSequenceMixinCounter = 0;
function AnimateSequenceMixin() {
  AnimateMixin.call(this);
  this.className = 'brew-anim-' + ++animateSequenceMixinCounter;
  this.item = new AnimateSequenceItemMixin(this.className);
}
definePrototype(AnimateSequenceMixin, AnimateMixin, {
  reset: function reset() {
    this.item.reset();
    return AnimateSequenceMixinSuper.reset.call(this);
  },
  getCustomAttributes: function getCustomAttributes() {
    return extend({}, AnimateSequenceMixinSuper.getCustomAttributes.call(this), {
      'animate-sequence': '.' + this.className
    });
  },
  clone: function clone() {
    return extend(AnimateSequenceMixinSuper.clone.call(this), {
      item: this.item.ref.getMixin()
    });
  }
});
;// CONCATENATED MODULE: ./src/mixins/FlyoutMixin.js



var FlyoutMixinSuper = ClassNameMixin.prototype;
var flyoutMixinCounter = 0;
function FlyoutMixin() {
  ClassNameMixin.call(this, ['open', 'closing', 'tweening-in', 'tweening-out']);
  this.isFlyoutOpened = false;
  this.animating = false;
  this.visible = false;
  this.toggle = new ClassNameMixin(['target-opened']);
}
definePrototype(FlyoutMixin, ClassNameMixin, {
  reset: function reset() {
    this.toggle.reset();
    return FlyoutMixinSuper.reset.call(this);
  },
  next: function next() {
    this.effects = undefined;
    return FlyoutMixinSuper.next.call(this);
  },
  withEffects: function withEffects() {
    this.effects = makeArray(arguments);
    return this;
  },
  getCustomAttributes: function getCustomAttributes() {
    return extend({}, FlyoutMixinSuper.getCustomAttributes.call(this), {
      'is-flyout': ''
    }, this.effects && {
      'animate-on': 'open',
      'animate-in': this.effects.join(' '),
      'animate-out': ''
    });
  },
  onOpen: function onOpen(callback) {
    return this.onToggleState(function (opened) {
      if (opened) {
        return callback();
      }
    });
  },
  onToggleState: function onToggleState(callback) {
    return this.watch('isFlyoutOpened', callback);
  },
  onVisibilityChanged: function onVisibilityChanged(callback) {
    return this.watch('visible', callback);
  },
  initElement: function initElement(element, state) {
    var self = this;
    FlyoutMixinSuper.initElement.call(self, element, state);

    if (!element.id) {
      element.id = 'flyout-' + ++flyoutMixinCounter;
    }

    app.on(element, {
      animationstart: function animationstart() {
        self.animating = true;
      },
      animationcomplete: function animationcomplete() {
        self.animating = false;
      }
    }, true);
    setImmediate(function () {
      each(self.toggle.elements(), function (i, v) {
        v.setAttribute('toggle', '#' + element.id);
      });
    });
  },
  clone: function clone() {
    var mixin = extend(FlyoutMixinSuper.clone.call(this), {
      toggle: this.toggle.ref.getMixin()
    });
    defineAliasProperty(mixin, 'isFlyoutOpened', this);
    return mixin;
  },
  onClassNameUpdated: function onClassNameUpdated(element, prevState, state) {
    var self = this;

    var isAdded = function isAdded(v) {
      return prevState[v] !== state[v] && state[v];
    };

    var isRemoved = function isRemoved(v) {
      return prevState[v] !== state[v] && !state[v];
    };

    if (isAdded('open')) {
      self.isFlyoutOpened = true;
      self.visible = true;
    } else if (isAdded('closing') || isAdded('tweening-out')) {
      self.isFlyoutOpened = false;
    } else if (isRemoved('open')) {
      self.visible = false;
    }
  }
});
;// CONCATENATED MODULE: ./src/mixins/FocusStateMixin.js




var FocusStateMixinSuper = ClassNameMixin.prototype;
function FocusStateMixin() {
  ClassNameMixin.call(this, ['focused']);
}
definePrototype(FocusStateMixin, ClassNameMixin, {
  initElement: function initElement(element, state) {
    FocusStateMixinSuper.initElement.call(this, element, state);
    zeta_dom_dom.on(element, {
      focusin: function focusin() {
        setClass(element, 'focused', true);
      },
      focusout: function focusout() {
        setClass(element, 'focused', false);
      }
    });
  }
});
;// CONCATENATED MODULE: ./src/mixins/LoadingStateMixin.js




var LoadingStateMixinSuper = ClassNameMixin.prototype;
function LoadingStateMixin() {
  ClassNameMixin.call(this, ['loading']);
}
definePrototype(LoadingStateMixin, ClassNameMixin, {
  initElement: function initElement(element, state) {
    LoadingStateMixinSuper.initElement.call(this, element, state);
    zeta_dom_dom.on(element, {
      asyncStart: function asyncStart() {
        setClass(element, 'loading', true);
      },
      asyncEnd: function asyncEnd() {
        setClass(element, 'loading', false);
      },
      cancelled: function cancelled() {
        setClass(element, 'loading', false);
      }
    });
  }
});
;// CONCATENATED MODULE: ./src/mixins/ScrollableMixin.js




var ScrollableMixinSuper = ClassNameMixin.prototype;
function ScrollableMixin() {
  ClassNameMixin.call(this, ['scrollable-x', 'scrollable-x-l', 'scrollable-x-r', 'scrollable-y', 'scrollable-y-d', 'scrollable-y-u']);
  this.target = Mixin.scrollableTarget;
  this.pageIndex = 0;
}
definePrototype(ScrollableMixin, ClassNameMixin, {
  withOptions: function withOptions(options) {
    this.options = options;
    return this;
  },
  getCustomAttributes: function getCustomAttributes() {
    var options = this.options || {};
    return extend({}, ScrollableMixinSuper.getCustomAttributes.call(this), {
      'scrollable': [options.direction || 'both', options.handle || 'auto'].join(' ')
    }, options.paged && {
      'var': '{ pageIndex: 0 }',
      'scroller-snap-page': options.paged,
      'scroller-page': options.pagedItemSelector,
      'scroller-state': 'pageIndex'
    });
  },
  onPageIndexChanged: function onPageIndexChanged(callback) {
    return this.watch('pageIndex', callback);
  },
  initElement: function initElement(element, state) {
    var self = this;
    app.on(element, 'statechange', function (e) {
      if ('pageIndex' in e.newValues) {
        extend(self, {
          pageIndex: e.newValues.pageIndex
        });
      }
    }, true);
  },
  clone: function clone() {
    var mixin = ScrollableMixinSuper.clone.call(this);
    defineAliasProperty(mixin, 'pageIndex', this);
    return mixin;
  }
});
;// CONCATENATED MODULE: ./src/mixin.js











function useScrollableMixin(options) {
  return (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return new ScrollableMixin();
  })[0].reset().withOptions(options);
}
function useFlyoutMixin() {
  return (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return new FlyoutMixin();
  })[0].reset();
}
function useAnimateMixin() {
  return (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return new AnimateMixin();
  })[0].reset();
}
function useAnimateSequenceMixin() {
  return (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return new AnimateSequenceMixin();
  })[0].reset();
}
function useFocusStateMixin() {
  return (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return new FocusStateMixin();
  })[0].reset();
}
function useLoadingStateMixin() {
  return (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return new LoadingStateMixin();
  })[0].reset();
}
function useMixinRef(mixin) {
  return mixin.getMixin().reset();
}

;// CONCATENATED MODULE: ./src/view.js





var routeMap = new Map();

function ViewContainer() {
  /** @type {any} */
  var self = this;
  external_commonjs_react_commonjs2_react_amd_react_root_React_.Component.apply(self, arguments);
  self.mounted = false;
  self.componentWillUnmount = app.on('navigate', function () {
    if (self.mounted && self.getViewComponent()) {
      self.forceUpdate();
    }
  });
}

definePrototype(ViewContainer, external_commonjs_react_commonjs2_react_amd_react_root_React_.Component, {
  componentDidMount: function componentDidMount() {
    this.mounted = true;
  },
  render: function render() {
    /** @type {any} */
    var self = this;
    var V = self.getViewComponent();

    if (V && V !== self.currentViewComponent) {
      self.currentViewComponent = V;

      if (self.currentView && self.currentElement) {
        self.prevView = self.currentView;
        self.prevElement = self.currentElement;
        self.currentElement = undefined;
        external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.animateOut(self.prevElement, 'show').then(function () {
          self.prevElement = undefined;
          self.prevView = undefined;
          self.forceUpdate();
        });
      }

      self.currentView = external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(V, {
        key: app.route.view,
        rootProps: exclude(self.props, ['views']),
        onComponentLoaded: function onComponentLoaded(element) {
          self.currentElement = element;
          util_setImmediate(function () {
            return external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.animateIn(element, 'show');
          });
        }
      });
    }

    return external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(external_commonjs_react_commonjs2_react_amd_react_root_React_.Fragment, null, self.prevView, self.currentView);
  },
  getViewComponent: function getViewComponent() {
    var views = this.props.views;
    var V = any(views, function (V) {
      var params = routeMap.get(V);
      return params && equal(params, pick(app.route, keys(params)));
    });
    return V || void app.navigate(linkTo(views[0]), true);
  }
});
function registerView(factory, routeParams) {
  var Component = function Component(props) {
    var childProps = exclude(props, ['rootProps', 'onComponentLoaded']);
    var Component = (0,external_zeta_dom_react_.useAsyncContent)(factory)[0];
    return external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement('div', extend({}, props.rootProps, {
      ref: function ref(element) {
        if (element && Component) {
          (props.onComponentLoaded || noop)(element);
        }
      },
      children: Component && external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(Component["default"], childProps)
    }));
  };

  routeMap.set(Component, routeParams);
  return Component;
}
function renderView() {
  var views = makeArray(arguments);
  var props;

  if (views[0] && typeof views[0] !== 'function') {
    props = views.shift();
  }

  return external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(ViewContainer, extend({}, props, {
    views: views
  }));
}
function linkTo(view, params) {
  return app.route.getPath(extend({}, app.route, params, routeMap.get(view)));
}
;// CONCATENATED MODULE: ./src/index.js




;// CONCATENATED MODULE: ./src/entry.js

/* harmony default export */ const entry = (src_namespaceObject);
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=brew-js-react.js.map