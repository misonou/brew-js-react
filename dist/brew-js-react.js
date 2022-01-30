(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("brew-js"), require("react"), require("react-dom"), require("zeta-dom"), require("zeta-dom-react"), require("waterpipe"));
	else if(typeof define === 'function' && define.amd)
		define("brew-js-react", ["brew-js", "react", "react-dom", "zeta-dom", "zeta-dom-react", "waterpipe"], factory);
	else if(typeof exports === 'object')
		exports["brew-js-react"] = factory(require("brew-js"), require("react"), require("react-dom"), require("zeta-dom"), require("zeta-dom-react"), require("waterpipe"));
	else
		root["brew-js-react"] = factory(root["brew"], root["React"], root["ReactDOM"], root["zeta"], root["zeta-dom-react"], root["waterpipe"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__80__, __WEBPACK_EXTERNAL_MODULE__359__, __WEBPACK_EXTERNAL_MODULE__318__, __WEBPACK_EXTERNAL_MODULE__654__, __WEBPACK_EXTERNAL_MODULE__103__, __WEBPACK_EXTERNAL_MODULE__28__) {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 28:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__28__;

/***/ }),

/***/ 103:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__103__;

/***/ }),

/***/ 80:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__80__;

/***/ }),

/***/ 359:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__359__;

/***/ }),

/***/ 318:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__318__;

/***/ }),

/***/ 654:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__654__;

/***/ }),

/***/ 43:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// @ts-nocheck

/** @type {Waterpipe} */
var waterpipe = window.waterpipe || __webpack_require__(28);

module.exports = waterpipe;

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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

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
  "default": () => (src),
  "linkTo": () => (linkTo),
  "makeTranslation": () => (makeTranslation),
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

// EXTERNAL MODULE: external {"commonjs":"brew-js","commonjs2":"brew-js","amd":"brew-js","root":"brew"}
var external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_ = __webpack_require__(80);
;// CONCATENATED MODULE: ./tmp/brew-js/app.js

var _defaultExport = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_;
/* harmony default export */ const app = (_defaultExport);
var install = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.install,
    addDetect = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.addDetect;

;// CONCATENATED MODULE: ./src/include/brew-js/app.js


/* harmony default export */ const brew_js_app = (app);
// EXTERNAL MODULE: external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"}
var external_commonjs_react_commonjs2_react_amd_react_root_React_ = __webpack_require__(359);
// EXTERNAL MODULE: external {"commonjs":"react-dom","commonjs2":"react-dom","amd":"react-dom","root":"ReactDOM"}
var external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_ = __webpack_require__(318);
// EXTERNAL MODULE: external {"commonjs":"zeta-dom","commonjs2":"zeta-dom","amd":"zeta-dom","root":"zeta"}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_ = __webpack_require__(654);
;// CONCATENATED MODULE: ./tmp/zeta-dom/util.js

var _lib$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
    noop = _lib$util.noop,
    either = _lib$util.either,
    is = _lib$util.is,
    isUndefinedOrNull = _lib$util.isUndefinedOrNull,
    isArray = _lib$util.isArray,
    isFunction = _lib$util.isFunction,
    isThenable = _lib$util.isThenable,
    isPlainObject = _lib$util.isPlainObject,
    isArrayLike = _lib$util.isArrayLike,
    makeArray = _lib$util.makeArray,
    extend = _lib$util.extend,
    each = _lib$util.each,
    map = _lib$util.map,
    grep = _lib$util.grep,
    splice = _lib$util.splice,
    any = _lib$util.any,
    single = _lib$util.single,
    kv = _lib$util.kv,
    pick = _lib$util.pick,
    exclude = _lib$util.exclude,
    mapGet = _lib$util.mapGet,
    mapRemove = _lib$util.mapRemove,
    arrRemove = _lib$util.arrRemove,
    setAdd = _lib$util.setAdd,
    equal = _lib$util.equal,
    combineFn = _lib$util.combineFn,
    executeOnce = _lib$util.executeOnce,
    createPrivateStore = _lib$util.createPrivateStore,
    setTimeoutOnce = _lib$util.setTimeoutOnce,
    util_setImmediate = _lib$util.setImmediate,
    setImmediateOnce = _lib$util.setImmediateOnce,
    throwNotFunction = _lib$util.throwNotFunction,
    keys = _lib$util.keys,
    values = _lib$util.values,
    util_hasOwnProperty = _lib$util.hasOwnProperty,
    getOwnPropertyDescriptors = _lib$util.getOwnPropertyDescriptors,
    util_define = _lib$util.define,
    definePrototype = _lib$util.definePrototype,
    defineOwnProperty = _lib$util.defineOwnProperty,
    defineGetterProperty = _lib$util.defineGetterProperty,
    defineHiddenProperty = _lib$util.defineHiddenProperty,
    defineAliasProperty = _lib$util.defineAliasProperty,
    defineObservableProperty = _lib$util.defineObservableProperty,
    watch = _lib$util.watch,
    watchOnce = _lib$util.watchOnce,
    watchable = _lib$util.watchable,
    inherit = _lib$util.inherit,
    deepFreeze = _lib$util.deepFreeze,
    iequal = _lib$util.iequal,
    randomId = _lib$util.randomId,
    repeat = _lib$util.repeat,
    camel = _lib$util.camel,
    hyphenate = _lib$util.hyphenate,
    ucfirst = _lib$util.ucfirst,
    lcfirst = _lib$util.lcfirst,
    trim = _lib$util.trim,
    matchWord = _lib$util.matchWord,
    htmlDecode = _lib$util.htmlDecode,
    resolve = _lib$util.resolve,
    reject = _lib$util.reject,
    always = _lib$util.always,
    resolveAll = _lib$util.resolveAll,
    catchAsync = _lib$util.catchAsync,
    setPromiseTimeout = _lib$util.setPromiseTimeout;

;// CONCATENATED MODULE: ./src/include/zeta-dom/util.js

;// CONCATENATED MODULE: ./tmp/zeta-dom/domUtil.js

var domUtil_lib$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
    domReady = domUtil_lib$util.domReady,
    tagName = domUtil_lib$util.tagName,
    domUtil_is = domUtil_lib$util.is,
    isVisible = domUtil_lib$util.isVisible,
    matchSelector = domUtil_lib$util.matchSelector,
    comparePosition = domUtil_lib$util.comparePosition,
    connected = domUtil_lib$util.connected,
    containsOrEquals = domUtil_lib$util.containsOrEquals,
    acceptNode = domUtil_lib$util.acceptNode,
    combineNodeFilters = domUtil_lib$util.combineNodeFilters,
    iterateNode = domUtil_lib$util.iterateNode,
    iterateNodeToArray = domUtil_lib$util.iterateNodeToArray,
    getCommonAncestor = domUtil_lib$util.getCommonAncestor,
    parentsAndSelf = domUtil_lib$util.parentsAndSelf,
    selectIncludeSelf = domUtil_lib$util.selectIncludeSelf,
    selectClosestRelative = domUtil_lib$util.selectClosestRelative,
    createNodeIterator = domUtil_lib$util.createNodeIterator,
    createTreeWalker = domUtil_lib$util.createTreeWalker,
    bind = domUtil_lib$util.bind,
    bindUntil = domUtil_lib$util.bindUntil,
    dispatchDOMMouseEvent = domUtil_lib$util.dispatchDOMMouseEvent,
    removeNode = domUtil_lib$util.removeNode,
    getClass = domUtil_lib$util.getClass,
    setClass = domUtil_lib$util.setClass,
    getScrollOffset = domUtil_lib$util.getScrollOffset,
    getScrollParent = domUtil_lib$util.getScrollParent,
    getContentRect = domUtil_lib$util.getContentRect,
    scrollBy = domUtil_lib$util.scrollBy,
    scrollIntoView = domUtil_lib$util.scrollIntoView,
    createRange = domUtil_lib$util.createRange,
    rangeIntersects = domUtil_lib$util.rangeIntersects,
    rangeEquals = domUtil_lib$util.rangeEquals,
    rangeCovers = domUtil_lib$util.rangeCovers,
    compareRangePosition = domUtil_lib$util.compareRangePosition,
    makeSelection = domUtil_lib$util.makeSelection,
    getRect = domUtil_lib$util.getRect,
    getRects = domUtil_lib$util.getRects,
    toPlainRect = domUtil_lib$util.toPlainRect,
    rectEquals = domUtil_lib$util.rectEquals,
    rectCovers = domUtil_lib$util.rectCovers,
    rectIntersects = domUtil_lib$util.rectIntersects,
    pointInRect = domUtil_lib$util.pointInRect,
    mergeRect = domUtil_lib$util.mergeRect,
    elementFromPoint = domUtil_lib$util.elementFromPoint;

;// CONCATENATED MODULE: ./src/include/zeta-dom/domUtil.js

;// CONCATENATED MODULE: ./tmp/zeta-dom/dom.js

var dom_defaultExport = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom;
/* harmony default export */ const dom = (dom_defaultExport);
var _lib$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    textInputAllowed = _lib$dom.textInputAllowed,
    beginDrag = _lib$dom.beginDrag,
    beginPinchZoom = _lib$dom.beginPinchZoom,
    getShortcut = _lib$dom.getShortcut,
    setShortcut = _lib$dom.setShortcut,
    focusable = _lib$dom.focusable,
    focused = _lib$dom.focused,
    setModal = _lib$dom.setModal,
    retainFocus = _lib$dom.retainFocus,
    releaseFocus = _lib$dom.releaseFocus,
    dom_focus = _lib$dom.focus;

;// CONCATENATED MODULE: ./src/include/zeta-dom/dom.js


/* harmony default export */ const zeta_dom_dom = (dom);
;// CONCATENATED MODULE: ./tmp/brew-js/domAction.js

var addAsyncAction = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.addAsyncAction,
    closeFlyout = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.closeFlyout,
    openFlyout = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.openFlyout;

;// CONCATENATED MODULE: ./src/include/brew-js/domAction.js

;// CONCATENATED MODULE: ./src/dialog.js






/**
 * @param {Partial<import("./dialog").DialogOptions<any>>} props
 */

function createDialog(props) {
  var root = document.createElement('div');
  var closing = false;
  var promise;

  function closeDialog(value) {
    if (!closing) {
      closing = true;
      closeFlyout(root, value).then(function () {
        closing = false;
        removeNode(root);
        (props.onClose || noop)(root);

        if (props.onRender) {
          external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_.unmountComponentAtNode(root);
        }
      });
    }
  }

  return {
    root: root,
    close: closeDialog,
    open: function open() {
      if (promise) {
        return promise;
      }

      root.className = props.className || '';
      document.body.appendChild(root);
      zeta_dom_dom.retainFocus(zeta_dom_dom.activeElement, root);

      if (props.modal) {
        root.setAttribute('is-modal', '');
        zeta_dom_dom.setModal(root);
      }

      if (props.onRender) {
        external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_.render(external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(props.onRender, extend({
          closeDialog: closeDialog
        }, props)), root);
      }

      promise = openFlyout(root);
      always(promise, function () {
        promise = null;
      });
      promise.then(props.onCommit);
      (props.onOpen || noop)(root);
      return promise;
    }
  };
}
/**
 * @param {import("./dialog").DialogProps} props
 */

function Dialog(props) {
  var _props = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(props)[0];
  var dialog = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return createDialog(_props);
  })[0];
  extend(_props, props);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    var opened = containsOrEquals(zeta_dom_dom.root, dialog.root);

    if (either(opened, _props.isOpen)) {
      if (!opened) {
        dialog.open();
      } else {
        dialog.close();
      }
    }
  }, [_props.isOpen]);
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return dialog.close;
  }, [dialog]);
  return external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_.createPortal(props.children, dialog.root);
}
;// CONCATENATED MODULE: ./tmp/brew-js/defaults.js

var defaults_defaultExport = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.defaults;
/* harmony default export */ const defaults = (defaults_defaultExport);
;// CONCATENATED MODULE: ./src/include/brew-js/defaults.js

/* harmony default export */ const brew_js_defaults = (defaults);
;// CONCATENATED MODULE: ./src/app.js


/** @type {Brew.AppInstance<Brew.WithRouter & Brew.WithI18n>} */

var app_app;
install('react', function (app_) {
  // @ts-ignore: type inference issue
  app_app = app_;
});
brew_js_defaults.react = true;
;// CONCATENATED MODULE: ./src/hooks.js



function useAppReady() {
  var sReady = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(false);
  var ready = sReady[0],
      setReady = sReady[1];
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    app_app.ready.then(function () {
      setReady(true);
    });
  }, []);
  return ready;
}
function useRouteParam(name, defaultValue) {
  var sValue = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(app_app.route[name]);
  var value = sValue[0],
      setValue = sValue[1];
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    var current = app_app.route[name]; // route parameter might be changed after state initialization and before useEffect hook is called

    setValue(current);
    return app_app.route.watch(name, setValue);
  }, [name, defaultValue]);

  if (!value && defaultValue !== undefined) {
    app_app.navigate(app_app.route.getPath(extend({}, app_app.route, kv(name, defaultValue))), true);
  }

  return value || '';
}
// EXTERNAL MODULE: external "zeta-dom-react"
var external_zeta_dom_react_ = __webpack_require__(103);
// EXTERNAL MODULE: ./src/include/external/waterpipe.js
var waterpipe = __webpack_require__(43);
;// CONCATENATED MODULE: ./src/i18n.js




var empty = Object.create(null);
function useLanguage() {
  return (0,external_zeta_dom_react_.useObservableProperty)(app_app, 'language');
}
function makeTranslation(resources, defaultLang) {
  var re = new RegExp('^(' + Object.keys(resources[defaultLang]).join('|') + ')\\.');
  var cache = {};

  function getTranslation(prefix, name, data) {
    var str = ((resources[app_app.language] || empty)[prefix] || empty)[name] || ((resources[defaultLang] || empty)[prefix] || empty)[name] || '';
    return str && data !== undefined ? waterpipe(str, data) : str;
  }

  function createCallback(translate) {
    return extend(translate, {
      html: function html(id, data) {
        return {
          __html: translate(id, data)
        };
      }
    });
  }

  function translate(key, data) {
    var prefix = re.test(key) ? RegExp.$1 : '';
    var name = prefix ? key.slice(RegExp.lastMatch.length) : key;
    return getTranslation(prefix, name, data) || key;
  }

  function useTranslation() {
    var prefix = makeArray(arguments);
    var language = useLanguage();
    var t = translate;

    if (prefix[0]) {
      var key = prefix.join(' ');
      t = cache[key] || (cache[key] = createCallback(function (key, data) {
        return single(prefix, function (v) {
          return getTranslation(v, key, data);
        }) || key;
      }));
    }

    return {
      language: language,
      t: t
    };
  }

  return {
    translate: createCallback(translate),
    useTranslation: useTranslation
  };
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
      if (current && current !== state.element) {
        state.element = current;
        self.initElement(current, state);
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

    app_app.on(element, {
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
    app_app.on(element, 'statechange', function (e) {
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

;// CONCATENATED MODULE: ./tmp/brew-js/anim.js

var animateIn = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.animateIn,
    animateOut = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.animateOut,
    addAnimateIn = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.addAnimateIn,
    addAnimateOut = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.addAnimateOut;

;// CONCATENATED MODULE: ./src/include/brew-js/anim.js

;// CONCATENATED MODULE: ./src/view.js





var routeMap = new Map();

function ViewContainer() {
  /** @type {any} */
  var self = this;
  external_commonjs_react_commonjs2_react_amd_react_root_React_.Component.apply(self, arguments);
  self.mounted = false;
  self.componentWillUnmount = app_app.on('navigate', function () {
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
        animateOut(self.prevElement, 'show').then(function () {
          self.prevElement = undefined;
          self.prevView = undefined;
          self.forceUpdate();
        });
      }

      self.currentView = external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(V, {
        key: app_app.route.view,
        rootProps: exclude(self.props, ['views']),
        onComponentLoaded: function onComponentLoaded(element) {
          self.currentElement = element;
          util_setImmediate(function () {
            return animateIn(element, 'show');
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
      return params && equal(params, pick(app_app.route, keys(params)));
    });
    return V || void app_app.navigate(linkTo(views[0]), true);
  }
});
function registerView(factory, routeParams) {
  var Component = function Component(props) {
    var childProps = exclude(props, ['rootProps', 'onComponentLoaded']);
    var Component = (0,external_zeta_dom_react_.useAsync)(factory)[0];
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
  return app_app.route.getPath(extend({}, app_app.route, params, routeMap.get(view)));
}
;// CONCATENATED MODULE: ./src/index.js

/* harmony default export */ const src = (brew_js_app);





;// CONCATENATED MODULE: ./src/entry.js

/* harmony default export */ const entry = (src_namespaceObject);
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=brew-js-react.js.map