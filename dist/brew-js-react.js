/*! brew-js-react v0.5.1 | (c) misonou | https://misonou.github.io */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("brew-js"), require("react"), require("react-dom"), require("zeta-dom"), require("zeta-dom-react"), require("waterpipe"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define("brew-js-react", ["brew-js", "react", "react-dom", "zeta-dom", "zeta-dom-react", "waterpipe", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["brew-js-react"] = factory(require("brew-js"), require("react"), require("react-dom"), require("zeta-dom"), require("zeta-dom-react"), require("waterpipe"), require("jquery"));
	else
		root["brew-js-react"] = factory(root["brew"], root["React"], root["ReactDOM"], root["zeta"], root["zeta-dom-react"], root["waterpipe"], root["jQuery"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__80__, __WEBPACK_EXTERNAL_MODULE__359__, __WEBPACK_EXTERNAL_MODULE__318__, __WEBPACK_EXTERNAL_MODULE__654__, __WEBPACK_EXTERNAL_MODULE__103__, __WEBPACK_EXTERNAL_MODULE__28__, __WEBPACK_EXTERNAL_MODULE__47__) {
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

/***/ 47:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__47__;

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

/***/ 862:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ReactDOM = __webpack_require__(318);
var ReactDOMClient;

if (ReactDOM.createRoot) {
    ReactDOMClient = ReactDOM;
} else {
    ReactDOMClient = {
        createRoot(container, options) {
            return {
                render(children) {
                    ReactDOM.render(children, container);
                },
                unmount() {
                    ReactDOM.unmountComponentAtNode(container);
                }
            };
        },
        hydrateRoot(container, initialChildren, options) {
            ReactDOM.hydrate(initialChildren, container);
            return ReactDOMClient.createRoot(container, options);
        },
    };
}

/** @type {import("react-dom/client")} */
module.exports = ReactDOMClient;


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
  "ClassNameToggleMixin": () => (ClassNameToggleMixin),
  "Dialog": () => (Dialog),
  "FlyoutMixin": () => (FlyoutMixin),
  "FlyoutToggleMixin": () => (FlyoutToggleMixin),
  "FocusStateMixin": () => (FocusStateMixin),
  "LoadingStateMixin": () => (LoadingStateMixin),
  "Mixin": () => (Mixin),
  "ScrollIntoViewMixin": () => (ScrollIntoViewMixin),
  "ScrollableMixin": () => (ScrollableMixin),
  "StatefulMixin": () => (StatefulMixin),
  "UnmanagedClassNameMixin": () => (UnmanagedClassNameMixin),
  "ViewStateContainer": () => (ViewStateContainer),
  "createDialog": () => (createDialog),
  "default": () => (src),
  "isViewMatched": () => (isViewMatched),
  "linkTo": () => (linkTo),
  "makeTranslation": () => (makeTranslation),
  "matchView": () => (matchView),
  "navigateTo": () => (navigateTo),
  "redirectTo": () => (redirectTo),
  "registerErrorView": () => (registerErrorView),
  "registerView": () => (registerView),
  "renderView": () => (renderView),
  "resolvePath": () => (resolvePath),
  "useAnimateMixin": () => (useAnimateMixin),
  "useAnimateSequenceMixin": () => (useAnimateSequenceMixin),
  "useAppReady": () => (useAppReady),
  "useAppReadyState": () => (useAppReadyState),
  "useClassNameToggleMixin": () => (useClassNameToggleMixin),
  "useFlyoutMixin": () => (useFlyoutMixin),
  "useFocusStateMixin": () => (useFocusStateMixin),
  "useLanguage": () => (useLanguage),
  "useLoadingStateMixin": () => (useLoadingStateMixin),
  "useMixin": () => (useMixin),
  "useMixinRef": () => (useMixinRef),
  "useRouteParam": () => (useRouteParam),
  "useRouteState": () => (useRouteState),
  "useScrollIntoViewMixin": () => (useScrollIntoViewMixin),
  "useScrollableMixin": () => (useScrollableMixin),
  "useUnmanagedClassNameMixin": () => (useUnmanagedClassNameMixin),
  "useViewContainerState": () => (useViewContext),
  "useViewContext": () => (useViewContext)
});

// EXTERNAL MODULE: external {"commonjs":"brew-js","commonjs2":"brew-js","amd":"brew-js","root":"brew"}
var external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_ = __webpack_require__(80);
;// CONCATENATED MODULE: ./tmp/brew-js/app.js

var _defaultExport = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_;
/* harmony default export */ const app = (_defaultExport);
var install = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.install,
    addExtension = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.addExtension,
    addDetect = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.addDetect,
    emitAppEvent = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.emitAppEvent,
    isElementActive = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.isElementActive;

;// CONCATENATED MODULE: ./src/include/brew-js/app.js


/* harmony default export */ const brew_js_app = (app);
// EXTERNAL MODULE: external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"}
var external_commonjs_react_commonjs2_react_amd_react_root_React_ = __webpack_require__(359);
// EXTERNAL MODULE: external {"commonjs":"react-dom","commonjs2":"react-dom","amd":"react-dom","root":"ReactDOM"}
var external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_ = __webpack_require__(318);
// EXTERNAL MODULE: ./node_modules/@misonou/react-dom-client/fallback.js
var fallback = __webpack_require__(862);
;// CONCATENATED MODULE: ./src/include/external/react-dom-client.js
// @ts-nocheck

/** @type {import("react-dom/client")} */

/* harmony default export */ const react_dom_client = (fallback);
// EXTERNAL MODULE: external {"commonjs":"zeta-dom","commonjs2":"zeta-dom","amd":"zeta-dom","root":"zeta"}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_ = __webpack_require__(654);
;// CONCATENATED MODULE: ./tmp/zeta-dom/util.js

var _lib$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
    noop = _lib$util.noop,
    pipe = _lib$util.pipe,
    either = _lib$util.either,
    sameValueZero = _lib$util.sameValueZero,
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
    fill = _lib$util.fill,
    pick = _lib$util.pick,
    exclude = _lib$util.exclude,
    mapObject = _lib$util.mapObject,
    mapGet = _lib$util.mapGet,
    mapRemove = _lib$util.mapRemove,
    arrRemove = _lib$util.arrRemove,
    setAdd = _lib$util.setAdd,
    equal = _lib$util.equal,
    combineFn = _lib$util.combineFn,
    executeOnce = _lib$util.executeOnce,
    createPrivateStore = _lib$util.createPrivateStore,
    util_setTimeout = _lib$util.setTimeout,
    setTimeoutOnce = _lib$util.setTimeoutOnce,
    util_setInterval = _lib$util.setInterval,
    setIntervalSafe = _lib$util.setIntervalSafe,
    setImmediate = _lib$util.setImmediate,
    setImmediateOnce = _lib$util.setImmediateOnce,
    clearImmediateOnce = _lib$util.clearImmediateOnce,
    _throws = _lib$util["throws"],
    throwNotFunction = _lib$util.throwNotFunction,
    errorWithCode = _lib$util.errorWithCode,
    isErrorWithCode = _lib$util.isErrorWithCode,
    util_keys = _lib$util.keys,
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
    freeze = _lib$util.freeze,
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
    matchWordMulti = _lib$util.matchWordMulti,
    htmlDecode = _lib$util.htmlDecode,
    resolve = _lib$util.resolve,
    reject = _lib$util.reject,
    always = _lib$util.always,
    resolveAll = _lib$util.resolveAll,
    retryable = _lib$util.retryable,
    deferrable = _lib$util.deferrable,
    catchAsync = _lib$util.catchAsync,
    setPromiseTimeout = _lib$util.setPromiseTimeout,
    delay = _lib$util.delay,
    makeAsync = _lib$util.makeAsync;

;// CONCATENATED MODULE: ./tmp/zeta-dom/domUtil.js

var domUtil_lib$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
    domReady = domUtil_lib$util.domReady,
    tagName = domUtil_lib$util.tagName,
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
    getSafeAreaInset = domUtil_lib$util.getSafeAreaInset,
    getScrollOffset = domUtil_lib$util.getScrollOffset,
    getScrollParent = domUtil_lib$util.getScrollParent,
    getContentRect = domUtil_lib$util.getContentRect,
    scrollBy = domUtil_lib$util.scrollBy,
    scrollIntoView = domUtil_lib$util.scrollIntoView,
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

;// CONCATENATED MODULE: ./tmp/zeta-dom/dom.js

var dom_defaultExport = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom;
/* harmony default export */ const dom = (dom_defaultExport);
var _lib$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    textInputAllowed = _lib$dom.textInputAllowed,
    beginDrag = _lib$dom.beginDrag,
    beginPinchZoom = _lib$dom.beginPinchZoom,
    insertText = _lib$dom.insertText,
    getShortcut = _lib$dom.getShortcut,
    setShortcut = _lib$dom.setShortcut,
    focusable = _lib$dom.focusable,
    focused = _lib$dom.focused,
    setTabRoot = _lib$dom.setTabRoot,
    unsetTabRoot = _lib$dom.unsetTabRoot,
    setModal = _lib$dom.setModal,
    releaseModal = _lib$dom.releaseModal,
    retainFocus = _lib$dom.retainFocus,
    releaseFocus = _lib$dom.releaseFocus,
    iterateFocusPath = _lib$dom.iterateFocusPath,
    dom_focus = _lib$dom.focus,
    dom_blur = _lib$dom.blur;

;// CONCATENATED MODULE: ./src/include/zeta-dom/dom.js


/* harmony default export */ const zeta_dom_dom = (dom);
;// CONCATENATED MODULE: ./tmp/zeta-dom/domLock.js

var domLock_lib$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    lock = domLock_lib$dom.lock,
    locked = domLock_lib$dom.locked,
    cancelLock = domLock_lib$dom.cancelLock,
    subscribeAsync = domLock_lib$dom.subscribeAsync,
    notifyAsync = domLock_lib$dom.notifyAsync,
    preventLeave = domLock_lib$dom.preventLeave;

;// CONCATENATED MODULE: ./tmp/brew-js/domAction.js

var addAsyncAction = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.addAsyncAction,
    isFlyoutOpen = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.isFlyoutOpen,
    closeFlyout = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.closeFlyout,
    toggleFlyout = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.toggleFlyout,
    openFlyout = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.openFlyout;

;// CONCATENATED MODULE: ./src/dialog.js








/**
 * @param {Partial<import("./dialog").DialogOptions<any>>} props
 */

function createDialog(props) {
  var root = document.createElement('div');
  var reactRoot = react_dom_client.createRoot(root);

  var _closeDialog = closeFlyout.bind(0, root);

  var promise;
  zeta_dom_dom.on(root, {
    flyouthide: function flyouthide() {
      removeNode(root);
      (props.onClose || noop)(root);

      if (props.onRender) {
        reactRoot.unmount();
      }
    },
    asyncStart: function asyncStart() {
      setClass(root, 'loading', true);
    },
    asyncEnd: function asyncEnd() {
      setClass(root, 'loading', false);
    }
  });
  subscribeAsync(root);
  return {
    root: root,
    close: _closeDialog,
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
        var dialogProps = extend({}, props, {
          closeDialog: function closeDialog(value) {
            var promise = makeAsync(props.onCommit || pipe)(value);
            notifyAsync(zeta_dom_dom.activeElement, promise);
            return promise.then(_closeDialog);
          }
        });
        var content = /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)(props.onRender, dialogProps);

        if (props.wrapper) {
          content = /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)(props.wrapper, dialogProps, content);
        }

        reactRoot.render(content);
        setImmediate(function () {
          zeta_dom_dom.focus(root);
        });
      }

      promise = openFlyout(root);

      if (props.preventLeave) {
        preventLeave(root, promise);
      } else if (props.preventNavigation) {
        lock(root, promise);
      }

      always(promise, function () {
        promise = null;
      });
      (props.onOpen || noop)(root);
      return promise;
    }
  };
}
/**
 * @param {import("./dialog").DialogProps} props
 */

function Dialog(props) {
  var _props = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)({})[0];
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
  return /*#__PURE__*/external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_.createPortal(props.children, dialog.root);
}
// EXTERNAL MODULE: external "zeta-dom-react"
var external_zeta_dom_react_ = __webpack_require__(103);
;// CONCATENATED MODULE: ./tmp/zeta-dom/events.js

var ZetaEventContainer = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.EventContainer;

;// CONCATENATED MODULE: ./tmp/brew-js/defaults.js

var defaults_defaultExport = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.defaults;
/* harmony default export */ const defaults = (defaults_defaultExport);
;// CONCATENATED MODULE: ./src/include/brew-js/defaults.js

/* harmony default export */ const brew_js_defaults = (defaults);
;// CONCATENATED MODULE: ./src/app.js



/** @type {Brew.AppInstance<Brew.WithRouter & Brew.WithI18n>} */

var app_app;
var appInitCallabcks = [];
function onAppInit(callback) {
  appInitCallabcks.push(throwNotFunction(callback));
}
install('react', function (app_) {
  // @ts-ignore: type inference issue
  app_app = app_;
  combineFn(appInitCallabcks)(app_app);
});
brew_js_defaults.react = true;
;// CONCATENATED MODULE: ./tmp/brew-js/anim.js

var animateIn = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.animateIn,
    animateOut = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.animateOut,
    addAnimateIn = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.addAnimateIn,
    addAnimateOut = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.addAnimateOut;

;// CONCATENATED MODULE: ./tmp/brew-js/util/path.js

var setBaseUrl = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.setBaseUrl,
    combinePath = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.combinePath,
    parsePath = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.parsePath,
    normalizePath = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.normalizePath,
    removeQueryAndHash = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.removeQueryAndHash,
    withBaseUrl = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.withBaseUrl,
    toAbsoluteUrl = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.toAbsoluteUrl,
    toRelativeUrl = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.toRelativeUrl,
    isSubPathOf = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.isSubPathOf,
    toSegments = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.toSegments;

;// CONCATENATED MODULE: ./src/view.js











var _ = createPrivateStore();

var root = zeta_dom_dom.root;
var routeMap = new Map();
var usedParams = {};
var sortedViews = [];
var emitter = new ZetaEventContainer();
var rootContext = freeze(extend(new ViewContext(null, null), {
  container: root
}));

var rootState = _(rootContext);

var StateContext = /*#__PURE__*/external_commonjs_react_commonjs2_react_amd_react_root_React_.createContext(rootContext);
var errorView;
/** @type {Partial<Zeta.ZetaEventType<"beforepageload", Brew.RouterEventMap, Element>>} */

var view_event = {};
onAppInit(function () {
  app_app.on('beforepageload', function (e) {
    rootState.setPage(app_app.page);
    rootState.setActive(true);
    view_event = e;
    e.waitFor(new Promise(function (resolve) {
      (function updateViewRecursive(next) {
        if (!next[0]) {
          return resolve();
        }

        resolveAll(map(next, function (v) {
          return new Promise(function (resolve) {
            v.onRender = resolve;
            v.forceUpdate();
          });
        })).then(function () {
          updateViewRecursive(map(next, function (v) {
            return v.children;
          }));
        });
      })(rootState.children);
    }));
  });
});

function ViewContext(view, page) {
  var self = this;
  watch(self, true);
  defineOwnProperty(self, 'view', view, true);

  _(self, {
    children: [],
    setPage: defineObservableProperty(self, 'page', page, true),
    setActive: defineObservableProperty(self, 'active', !!page, true)
  });

  watch(self, 'page', function (page, previousPage) {
    emitter.emit('pagechange', self, {
      previousPage: previousPage
    });
  });
}

definePrototype(ViewContext, {
  on: function on(event, handler) {
    return emitter.add(this, event, handler);
  }
});

function ErrorBoundary() {
  external_commonjs_react_commonjs2_react_amd_react_root_React_.Component.apply(this, arguments);
  this.state = {};
}

ErrorBoundary.contextType = StateContext;
definePrototype(ErrorBoundary, external_commonjs_react_commonjs2_react_amd_react_root_React_.Component, {
  componentDidCatch: function componentDidCatch(error) {
    var self = this;

    if (errorView && !self.state.error) {
      self.setState({
        error: error
      });
    } else {
      // emit error in next tick as ref callback may yet to be invoked
      // if error is thrown synchronously in first render
      setImmediate(function () {
        zeta_dom_dom.emit('error', self.context.container, {
          error: error
        }, true);
      });
    }
  },
  render: function render() {
    var self = this;
    var props = {
      view: self.context.view,
      error: self.state.error,
      reset: self.reset.bind(self)
    };
    var onComponentLoaded = self.props.onComponentLoaded;

    if (props.error) {
      return /*#__PURE__*/external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(errorView, {
        onComponentLoaded: onComponentLoaded,
        viewProps: props
      });
    }

    return /*#__PURE__*/external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(props.view, {
      onComponentLoaded: onComponentLoaded,
      viewProps: self.props.viewProps
    });
  },
  reset: function reset() {
    this.setState({
      error: null
    });
  }
});

function ViewContainer() {
  external_commonjs_react_commonjs2_react_amd_react_root_React_.Component.apply(this, arguments);
}

ViewContainer.contextType = StateContext;
definePrototype(ViewContainer, external_commonjs_react_commonjs2_react_amd_react_root_React_.Component, {
  componentDidMount: function componentDidMount() {
    var self = this;

    var parent = _(self.context).children;

    parent.push(self);
    self.componentWillUnmount = combineFn(watch(app_app.route, function () {
      (self.setActive || noop)(self.getViewComponent() === self.currentViewComponent);
    }), function () {
      arrRemove(parent, self);
    });
  },
  render: function render() {
    /** @type {any} */
    var self = this;

    if (self.context.active) {
      self.updateView();
    }

    (self.onRender || noop)();
    return /*#__PURE__*/external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(external_commonjs_react_commonjs2_react_amd_react_root_React_.Fragment, null, self.prevView, self.currentView);
  },
  updateView: function updateView() {
    var self = this;
    var V = self.getViewComponent();
    var viewChanged = V !== self.currentViewComponent;

    if (V && (viewChanged || !(self.children || '')[0])) {
      // ensure the current path actually corresponds to the matched view
      // when some views are not included in the list of allowed views
      var targetPath = resolvePath(V, getCurrentParams(V, true));

      if (targetPath !== removeQueryAndHash(app_app.path)) {
        app_app.navigate(targetPath, true);
        return;
      }
    }

    if (V && viewChanged) {
      var prevElement = self.currentElement;

      if (prevElement) {
        self.setActive(false);
        self.prevView = self.currentView;
        self.currentElement = undefined;
        app_app.emit('pageleave', prevElement, {
          pathname: self.currentPath
        }, true);
        animateOut(prevElement, 'show').then(function () {
          self.prevView = undefined;
          self.forceUpdate();
        });
      }

      (self.cancelPrevious || noop)();
      var onComponentLoaded;
      var promise = new Promise(function (resolve) {
        onComponentLoaded = resolve;
      });
      var initElement = executeOnce(function (element) {
        self.currentElement = element;
        state.container = element;
        promise.then(function () {
          animateIn(element, 'show', '[brew-view]', true);
          app_app.emit('pageenter', element, {
            pathname: app_app.path
          }, true);
        });
        notifyAsync(element, promise);
      });
      var state = new ViewContext(V, app_app.page);
      var viewProps = freeze({
        navigationType: view_event.navigationType,
        viewContext: state,
        viewData: view_event.data || {}
      });
      var view = /*#__PURE__*/external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(StateContext.Provider, {
        key: routeMap.get(V).id,
        value: state
      }, /*#__PURE__*/external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(ViewStateContainer, null, /*#__PURE__*/external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement('div', extend({}, self.props.rootProps, {
        ref: initElement,
        'brew-view': ''
      }), /*#__PURE__*/external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(ErrorBoundary, {
        onComponentLoaded: onComponentLoaded,
        viewProps: viewProps
      }))));
      extend(self, _(state), {
        cancelPrevious: onComponentLoaded,
        currentPath: app_app.path,
        currentView: view,
        currentViewComponent: V
      });
      (view_event.waitFor || noop)(promise);
    }

    (self.setPage || noop)(app_app.page);
  },
  getViewComponent: function getViewComponent() {
    var props = this.props;
    return any(props.views, isViewMatched) || props.defaultView;
  }
});

function getCurrentParams(view, includeAll, params) {
  var state = routeMap.get(view);

  if (!state.maxParams) {
    var matchers = exclude(state.matchers, ['remainingSegments']);
    var matched = map(app_app.routes, function (v) {
      var route = app_app.parseRoute(v);
      var matched = route.length && !any(matchers, function (v, i) {
        var pos = route.params[i];
        return (v ? !(pos >= 0) : pos < route.minLength) || !isFunction(v) && !route.match(i, v);
      });
      return matched ? route : null;
    });

    if (matched[1]) {
      matched = grep(matched, function (v) {
        return !single(v.params, function (v, i) {
          return usedParams[i] && !matchers[i];
        });
      });
    }

    if (matched[0]) {
      var last = matched.slice(-1)[0];
      state.maxParams = util_keys(extend.apply(0, [{
        remainingSegments: true
      }].concat(matched.map(function (v) {
        return v.params;
      }))));
      state.minParams = map(last.params, function (v, i) {
        return state.params[i] || v >= last.minLength ? null : i;
      });
    }
  }

  return pick(params || app_app.route, includeAll ? state.maxParams : state.minParams);
}

function sortViews(a, b) {
  return (routeMap.get(b) || {}).matchCount - (routeMap.get(a) || {}).matchCount;
}

function matchViewParams(view, route) {
  var params = routeMap.get(view);
  return !!params && !single(params.matchers, function (v, i) {
    var value = route[i] || '';
    return isFunction(v) ? !v(value) : (v || '') !== value;
  });
}

function createViewComponent(factory) {
  var promise;
  throwNotFunction(factory);

  if (factory.prototype instanceof external_commonjs_react_commonjs2_react_amd_react_root_React_.Component) {
    factory = external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement.bind(null, factory);
  }

  return function fn(props) {
    var viewProps = props.viewProps;
    var children = !promise && factory(viewProps);

    if (isThenable(children)) {
      promise = children;
      children = null;
      catchAsync(promise);
    }

    var state = (0,external_zeta_dom_react_.useAsync)(function () {
      return promise.then(function (s) {
        return /*#__PURE__*/external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(s["default"], viewProps);
      });
    }, !!promise)[1];

    if (!promise || !state.loading) {
      props.onComponentLoaded();

      if (state.error) {
        throw state.error;
      }
    }

    return children || state.value || /*#__PURE__*/external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(external_commonjs_react_commonjs2_react_amd_react_root_React_.Fragment);
  };
}

function useViewContext() {
  return external_commonjs_react_commonjs2_react_amd_react_root_React_.useContext(StateContext);
}
function isViewMatched(view) {
  return matchViewParams(view, app_app.route);
}
function matchView(path, views) {
  var route = app_app.route;

  if (typeof path === 'string') {
    route = route.parse(path);
  } else {
    views = path;
  }

  views = views ? makeArray(views).sort(sortViews) : sortedViews;
  return any(views, function (v) {
    return matchViewParams(v, route);
  }) || undefined;
}
function registerView(factory, routeParams) {
  var Component = createViewComponent(factory);
  routeParams = extend({}, routeParams);
  each(routeParams, function (i, v) {
    usedParams[i] = true;

    if (v instanceof RegExp) {
      routeParams[i] = v.test.bind(v);
    }
  });
  routeMap.set(Component, {
    id: randomId(),
    matchCount: util_keys(routeParams).length,
    matchers: routeParams,
    params: pick(routeParams, function (v) {
      return isUndefinedOrNull(v) || typeof v === 'string';
    })
  });
  sortedViews.push(Component);
  sortedViews.sort(sortViews);
  return Component;
}
function registerErrorView(factory) {
  errorView = createViewComponent(factory);
}
function renderView() {
  var views = makeArray(arguments);
  var rootProps = isFunction(views[0]) ? {} : views.shift();
  var defaultView = views[0];
  each(views, function (i, v) {
    if (!routeMap.has(v)) {
      throw new Error('Invalid argument to renderView: ' + (isFunction(v) ? v.name : v));
    }
  });
  views.sort(sortViews);
  return /*#__PURE__*/external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement(ViewContainer, {
    rootProps: rootProps,
    views: views,
    defaultView: defaultView
  });
}
function resolvePath(view, params) {
  var state = routeMap.get(view);

  if (!state) {
    return '/';
  }

  var newParams = extend(getCurrentParams(view), getCurrentParams(view, true, params || {}), state.params);
  return app_app.route.getPath(newParams);
}
function linkTo(view, params) {
  return app_app.toHref(resolvePath(view, params));
}
function navigateTo(view, params, data, replace) {
  return app_app.navigate(resolvePath(view, params), replace, data && freeze(extend({}, data)));
}
function redirectTo(view, params, data) {
  return navigateTo(view, params, data, true);
}

;// CONCATENATED MODULE: ./src/hooks.js






var hooks_emitter = new ZetaEventContainer();

function getCurrentStates() {
  return app_app.historyStorage.current;
}

function ViewState(key, dispose) {
  this.key = key;
  this.store = getCurrentStates();
  this.dispose = dispose;
}

definePrototype(ViewState, {
  get: function get() {
    return this.store.get(this.key);
  },
  set: function set(value, snapshot) {
    this.store = updatePersistedValue(this.store, this.key, value, snapshot);
  },
  onPopState: function onPopState(callback) {
    throwNotFunction(callback);
    return hooks_emitter.add(this, 'popstate', function (e) {
      callback.call(this, e.newValue);
    });
  }
});

function updatePersistedValue(cur, key, value, snapshot) {
  if (cur.get(key) !== value) {
    if (snapshot && cur.has(key)) {
      app_app.snapshot();
      cur = getCurrentStates();
    }

    cur.set(key, value);
  }

  return cur;
}

function updateViewState(state, key, store) {
  var newValue = state.get();

  if (key !== state.key || store !== state.store && store.has(key)) {
    newValue = store.get(key);
    hooks_emitter.emit('popstate', state, {
      newValue: newValue
    });
  }

  state.key = key;
  state.store = store;
  store.set(key, newValue);
}

function useViewContextWithEffect(callback, deps) {
  var container = useViewContext();
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    return app_app.on('beforepageload popstate', function () {
      if (container.active) {
        callback(getCurrentStates());
      }
    });
  }, deps);
  return container;
}

function useAppReady() {
  return useAppReadyState().ready;
}
function useAppReadyState() {
  var readyState = (0,external_zeta_dom_react_.useObservableProperty)(app_app, 'readyState');
  return {
    ready: readyState === 'ready',
    error: readyState === 'error'
  };
}
function useRouteParam(name, defaultValue) {
  var container = useViewContext();
  var params = container.page.params;
  var route = app_app.route;
  var value = params[name] || '';
  var ref = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef)(value);
  var forceUpdate = (0,external_zeta_dom_react_.useUpdateTrigger)();
  (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect)(function () {
    var setValue = function setValue() {
      var current = route[name] || '';

      if (current !== ref.current) {
        if (container.active) {
          ref.current = current;
          forceUpdate();
        } else {
          watch(container, 'active', setValue);
        }
      }
    }; // route parameter might be changed after state initialization and before useEffect hook is called


    setValue();

    if (name in route) {
      return route.watch(name, function () {
        setImmediateOnce(setValue);
      });
    }

    console.error('Route parameter ' + name + ' does not exist');
  }, [name, defaultValue]);
  ref.current = value;

  if (defaultValue && container.active && (!value || name === 'remainingSegments' && value === '/')) {
    app_app.navigate(route.getPath(extend({}, params, kv(name, defaultValue))), true);
  }

  return value;
}
function useRouteState(key, defaultValue, snapshotOnUpdate) {
  var cur = getCurrentStates();
  var state = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(cur && cur.has(key) ? cur.get(key) : defaultValue);
  var container = useViewContextWithEffect(function (cur) {
    state[1](function (oldValue) {
      return cur.has(key) ? cur.get(key) : (cur.set(key, oldValue), oldValue);
    });
  }, [key]);

  if (!cur) {
    // delay app ready to ensure that beforepageload event can be caught
    app_app.beforeInit(delay(1));
  } else if (container.active) {
    updatePersistedValue(cur, key, state[0], snapshotOnUpdate);
  }

  return state;
}
function ViewStateContainer(props) {
  var cache = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)({})[0];
  var container = useViewContextWithEffect(function (cur) {
    each(cache, function (i, v) {
      updateViewState(v, v.key, cur);
    });
  }, []);
  var provider = (0,external_commonjs_react_commonjs2_react_amd_react_root_React_.useState)(function () {
    return {
      getState: function getState(uniqueId, key) {
        var state = cache[uniqueId];

        if (state && container.active) {
          updateViewState(state, key, getCurrentStates());
        }

        return state || (cache[uniqueId] = new ViewState(key, function () {
          delete cache[uniqueId];
        }));
      }
    };
  })[0];
  return /*#__PURE__*/(0,external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement)(external_zeta_dom_react_.ViewStateProvider, {
    value: provider
  }, props.children);
}
// EXTERNAL MODULE: external "waterpipe"
var external_waterpipe_ = __webpack_require__(28);
;// CONCATENATED MODULE: ./src/include/external/waterpipe.js
// @ts-nocheck

/* harmony default export */ const waterpipe = (external_waterpipe_);
;// CONCATENATED MODULE: ./src/i18n.js




var empty = Object.create(null);
var toPrimitive = typeof Symbol === 'function' && Symbol.toPrimitive;

function TString(toString) {
  this.toString = toString;
}

if (toPrimitive) {
  TString.prototype[toPrimitive] = function () {
    return this.toString();
  };
}

function createCallback(translate) {
  var callback = function callback(key, data, lang) {
    var result = translate(key, data, lang, true);
    return result !== undefined ? result : key;
  };

  return extend(callback, {
    html: function html(id, data, lang) {
      return {
        __html: translate(id, data, lang)
      };
    },
    lazy: function lazy(id, data, lang) {
      return new TString(translate.bind(0, id, data, lang, true));
    }
  });
}

function useLanguage() {
  return (0,external_zeta_dom_react_.useObservableProperty)(app_app, 'language');
}
function makeTranslation(resources, defaultLang) {
  var re = new RegExp('^(' + Object.keys(resources[defaultLang]).join('|') + ')\\.');
  var cache = {};

  function getTranslation(prefix, name, data, noEncode, lang) {
    var str = ((resources[lang] || empty)[prefix] || empty)[name];

    if (typeof str === 'string') {
      if (str && (!noEncode || data !== undefined)) {
        return waterpipe(str, data, {
          noEncode: noEncode
        });
      }

      return str;
    }

    if (lang !== defaultLang) {
      return getTranslation(prefix, name, data, noEncode, defaultLang);
    }
  }

  function translate(key, data, lang, noEncode) {
    var prefix = re.test(key) ? RegExp.$1 : '';
    var name = prefix ? key.slice(RegExp.lastMatch.length) : key;
    return getTranslation(prefix, name, data, noEncode, lang || app_app.language);
  }

  function getTranslationCallback() {
    var currentLang = String(this);
    var prefix = makeArray(arguments);
    var key = currentLang + ' ' + prefix.join(' ');
    return cache[key] || (cache[key] = prefix[0] ? createCallback(function (key, data, lang, noEncode) {
      lang = lang || currentLang || app_app.language;
      return single(prefix, function (v) {
        return getTranslation(v, key, data, noEncode, lang);
      });
    }) : createCallback(function (key, data, lang, noEncode) {
      return translate(key, data, lang || currentLang, noEncode);
    }));
  }

  function useTranslation() {
    var language = useLanguage();
    var t = getTranslationCallback.apply(language, arguments);
    return {
      language: language,
      t: t
    };
  }

  return {
    translate: createCallback(translate),
    getTranslation: getTranslationCallback.bind(''),
    useTranslation: useTranslation,
    keys: function keys(prefix) {
      return util_keys(resources[defaultLang][prefix] || empty);
    }
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
  reset: function reset() {
    return this;
  },
  next: function next() {},
  getRef: function getRef() {
    return noop;
  },
  getClassNames: function getClassNames() {
    return [];
  },
  getCustomAttributes: function getCustomAttributes() {
    return {};
  },
  dispose: function dispose() {}
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
;// CONCATENATED MODULE: ./tmp/zeta-dom/observe.js

var observe_lib$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
    observe = observe_lib$dom.observe,
    registerCleanup = observe_lib$dom.registerCleanup,
    createAutoCleanupMap = observe_lib$dom.createAutoCleanupMap,
    afterDetached = observe_lib$dom.afterDetached,
    watchElements = observe_lib$dom.watchElements,
    watchAttributes = observe_lib$dom.watchAttributes,
    watchOwnAttributes = observe_lib$dom.watchOwnAttributes;

;// CONCATENATED MODULE: ./src/mixins/StatefulMixin.js



var StatefulMixin_ = createPrivateStore();

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

  StatefulMixin_(this, {
    elements: new Set(),
    states: new WeakMap(),
    flush: watch(this, false),
    dispose: []
  });
}
definePrototype(StatefulMixin, Mixin, {
  get ref() {
    var state = StatefulMixin_(this);

    return state.ref || (state.ref = new MixinRefImpl(this));
  },

  get state() {
    return StatefulMixin_(this).pending;
  },

  reset: function reset() {
    StatefulMixin_(this).pending = {};
    return this;
  },
  next: function next() {
    StatefulMixin_(this).pending = {};
    return this;
  },
  getRef: function getRef() {
    var self = this;

    var obj = StatefulMixin_(self);

    var newState = obj.pending;
    var state;
    return function (current) {
      if (current) {
        state = obj.states.get(current) || extend(self.initState(), newState);

        if (state.element !== current) {
          state.element = current;
          self.initElement(current, state);
          obj.states.set(current, state);
        } else if (util_keys(newState)[0]) {
          self.mergeState(current, state, newState);
        }

        self.onLayoutEffect(current, state);
        obj.elements.add(current);
      } else {
        obj.elements["delete"](state.element);
      }
    };
  },
  elements: function elements() {
    return map(StatefulMixin_(this).elements, pipe);
  },
  onDispose: function onDispose(callback) {
    StatefulMixin_(this).dispose.push(callback);
  },
  initState: function initState() {
    return {
      element: null
    };
  },
  initElement: function initElement(element, state) {},
  mergeState: function mergeState(element, state, newState) {
    extend(state, newState);
  },
  onLayoutEffect: function onLayoutEffect(element, state) {},
  clone: function clone() {
    return this;
  },
  dispose: function dispose() {
    var state = StatefulMixin_(this);

    combineFn(state.dispose.splice(0))();
    state.flush();
    state.states = {};
    state.pending = {};
  }
});
;// CONCATENATED MODULE: ./src/mixins/ClassNameMixin.js





function checkState(self, element, state, fireEvent) {
  var classNames = state.classNames;
  var prev = extend({}, classNames);
  each(classNames, function (i) {
    classNames[i] = element.classList.contains(i);
  });

  if (fireEvent && !equal(prev, classNames)) {
    self.onClassNameUpdated(element, prev, extend({}, classNames));
  }
}

function ClassNameMixin(classNames) {
  StatefulMixin.call(this);
  this.classNames = classNames || [];
}
definePrototype(ClassNameMixin, StatefulMixin, {
  initState: function initState() {
    return {
      element: null,
      classNames: fill(this.classNames, false)
    };
  },
  initElement: function initElement(element, state) {
    var self = this;
    checkState(self, element, state);
    watchOwnAttributes(element, 'class', function () {
      checkState(self, element, state, true);
    });
  },
  onLayoutEffect: function onLayoutEffect(element, state) {
    setClass(element, state.classNames);
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
    var self = this;
    self.effects = undefined;
    self.trigger = undefined;
    return AnimateMixinSuper.next.call(self);
  },
  "with": function _with(props) {
    var self = this;
    self.effects = props.effects;
    self.trigger = props.trigger;
    return self;
  },
  withEffects: function withEffects() {
    this.effects = makeArray(arguments);
    return this;
  },
  getCustomAttributes: function getCustomAttributes() {
    var self = this;
    return extend({}, AnimateMixinSuper.getCustomAttributes.call(self), {
      'animate-in': (self.effects || []).join(' '),
      'animate-on': self.trigger || 'show'
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
  getCustomAttributes: function getCustomAttributes() {
    return extend({}, AnimateSequenceItemMixinSuper.getCustomAttributes.call(this), {
      'is-animate-sequence': ''
    });
  },
  getClassNames: function getClassNames() {
    return [this.className].concat(AnimateSequenceItemMixinSuper.getClassNames.call(this));
  }
});
// EXTERNAL MODULE: external {"commonjs":"jquery","commonjs2":"jquery","amd":"jquery","root":"jQuery"}
var external_commonjs_jquery_commonjs2_jquery_amd_jquery_root_jQuery_ = __webpack_require__(47);
;// CONCATENATED MODULE: ./src/include/external/jquery.js
// @ts-nocheck

/* harmony default export */ const jquery = (external_commonjs_jquery_commonjs2_jquery_amd_jquery_root_jQuery_);
;// CONCATENATED MODULE: ./src/mixins/AnimateSequenceMixin.js





var AnimateSequenceMixinSuper = AnimateMixin.prototype;
var animateSequenceMixinCounter = 0;
function AnimateSequenceMixin() {
  var self = this;
  AnimateMixin.call(self);
  self.className = 'brew-anim-' + ++animateSequenceMixinCounter;
  self.item = new AnimateSequenceItemMixin(self.className);
}
definePrototype(AnimateSequenceMixin, AnimateMixin, {
  withOptions: function withOptions(options) {
    this.selector = options;
    return this;
  },
  getCustomAttributes: function getCustomAttributes() {
    var self = this;
    return extend({}, AnimateSequenceMixinSuper.getCustomAttributes.call(self), {
      'animate-in': null,
      'animate-sequence-type': (self.effects || []).join(' '),
      'animate-sequence': self.selector || '.' + self.className
    });
  },
  initElement: function initElement(element, state) {
    var self = this;
    AnimateSequenceMixinSuper.initElement.call(self, element, state);

    if (self.selector) {
      self.onDispose(watchElements(element, self.selector, function (addedNodes) {
        jquery(addedNodes).attr('is-animate-sequence', '');
      }));
    }
  }
});
;// CONCATENATED MODULE: ./src/mixins/ClassNameToggleMixin.js



function ClassNameToggleMixin() {
  StatefulMixin.call(this);
}
definePrototype(ClassNameToggleMixin, StatefulMixin, {
  withOptions: function withOptions(classes) {
    this.classes = extend({}, classes);
  },
  getClassNames: function getClassNames() {
    return this.classes;
  },
  set: function set(name, value) {
    value = isPlainObject(name) || kv(name, value);
    each(this.elements(), function (i, v) {
      setClass(v, value);
    });
    extend(this.classes, value);
  }
});
;// CONCATENATED MODULE: ./src/mixins/FlyoutToggleMixin.js




var FlyoutToggleMixinSuper = ClassNameMixin.prototype;
function FlyoutToggleMixin(mixin) {
  ClassNameMixin.call(this, ['target-opened']);
  this.flyoutMixin = mixin;
}
definePrototype(FlyoutToggleMixin, ClassNameMixin, {
  open: function open(value) {
    return this.flyoutMixin.open(value);
  },
  close: function close(value) {
    return this.flyoutMixin.close(value);
  },
  initElement: function initElement(element, state) {
    var self = this;
    FlyoutToggleMixinSuper.initElement.call(self, element, state);
    self.onDispose(zeta_dom_dom.on(element, 'click', function () {
      toggleFlyout(self.flyoutMixin.elements()[0], element);
    }));
  }
});
;// CONCATENATED MODULE: ./src/mixins/FlyoutMixin.js





var FlyoutMixinSuper = ClassNameMixin.prototype;
var valueMap = new WeakMap();
function FlyoutMixin() {
  var self = this;
  ClassNameMixin.call(self, ['open', 'closing', 'visible', 'tweening-in', 'tweening-out']);
  self.modal = false;
  self.tabThrough = false;
  self.isFlyoutOpened = false;
  self.animating = false;
  self.visible = false;
  self.toggle = new FlyoutToggleMixin(self);
  self.onDispose(function () {
    self.isFlyoutOpened = false;
    self.visible = false;
  });
}
definePrototype(FlyoutMixin, ClassNameMixin, {
  next: function next() {
    this.effects = undefined;
    return FlyoutMixinSuper.next.call(this);
  },
  withEffects: function withEffects() {
    this.effects = makeArray(arguments);
    return this;
  },
  getCustomAttributes: function getCustomAttributes() {
    var self = this;
    return extend({}, FlyoutMixinSuper.getCustomAttributes.call(self), {
      'is-flyout': '',
      'swipe-dismiss': self.swipeToDismiss
    }, self.modal && {
      'is-modal': ''
    }, self.tabThrough && {
      'tab-through': ''
    }, self.effects && {
      'animate-on': 'open',
      'animate-in': self.effects.join(' '),
      'animate-out': ''
    });
  },
  open: function open(value) {
    var element = this.elements()[0];
    valueMap.set(element, value);
    return openFlyout(element);
  },
  close: function close(value) {
    return closeFlyout(this.elements()[0], value);
  },
  onOpen: function onOpen(callback) {
    var element = this.elements()[0];
    return this.onToggleState(function (opened) {
      if (opened) {
        return callback(valueMap.get(element));
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
    self.onDispose(app_app.on(element, {
      animationstart: function animationstart() {
        self.animating = true;
      },
      animationcomplete: function animationcomplete() {
        self.animating = false;
      }
    }, true));
  },
  onClassNameUpdated: function onClassNameUpdated(element, prevState, state) {
    var self = this;
    self.visible = state.open;
    self.isFlyoutOpened = state.open && !state.closing && !state['tweening-out'];
  }
});
;// CONCATENATED MODULE: ./src/mixins/FocusStateMixin.js




var FocusStateMixinSuper = StatefulMixin.prototype;
function FocusStateMixin() {
  StatefulMixin.call(this);
}
definePrototype(FocusStateMixin, StatefulMixin, {
  "for": function _for(ref) {
    this.state.ref = ref;
    return this;
  },
  initElement: function initElement(element, state) {
    FocusStateMixinSuper.initElement.call(this, element, state);

    var checkTarget = function checkTarget(callback, arg) {
      var ref = state.ref;
      var target = ref && (typeof ref === 'string' ? element.querySelector(ref) : ref.current);

      if (target && !zeta_dom_dom.focused(target)) {
        callback(arg || target);
      }
    };

    this.onDispose(zeta_dom_dom.on(element, {
      focusin: function focusin(e) {
        state.focused = e.source;
        setClass(element, 'focused', e.source);
        checkTarget(zeta_dom_dom.focus);
      },
      focusout: function focusout() {
        state.focused = false;
        setClass(element, 'focused', false);
      },
      focuschange: function focuschange() {
        checkTarget(zeta_dom_dom.blur, element);
      }
    }));
  },
  onLayoutEffect: function onLayoutEffect(element, state) {
    setClass(element, 'focused', state.focused);
  }
});
;// CONCATENATED MODULE: ./src/mixins/LoadingStateMixin.js




var LoadingStateMixinSuper = StatefulMixin.prototype;
function LoadingStateMixin() {
  StatefulMixin.call(this);
}
definePrototype(LoadingStateMixin, StatefulMixin, {
  initElement: function initElement(element, state) {
    LoadingStateMixinSuper.initElement.call(this, element, state);
    this.onDispose(subscribeAsync(element, function (loading) {
      state.loading = loading;
      setClass(element, 'loading', loading);
    }));
  },
  onLayoutEffect: function onLayoutEffect(element, state) {
    setClass(element, 'loading', state.loading);
  }
});
;// CONCATENATED MODULE: ./tmp/brew-js/directive.js

var getDirectiveComponent = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.getDirectiveComponent,
    registerDirective = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.registerDirective;

;// CONCATENATED MODULE: ./src/mixins/ScrollableMixin.js





var ScrollableMixinSuper = ClassNameMixin.prototype;
function ScrollableMixin() {
  var self = this;
  ClassNameMixin.call(self, ['scrollable-x', 'scrollable-x-l', 'scrollable-x-r', 'scrollable-y', 'scrollable-y-d', 'scrollable-y-u']);
  self.target = Mixin.scrollableTarget;
  self.pageIndex = 0;
  self.scrolling = false;
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
    }, options.pagedItemSelector && {
      'scroller-snap-page': options.paged,
      'scroller-page': options.pagedItemSelector
    }, options.persistScroll && {
      'persist-scroll': ''
    });
  },
  onPageIndexChanged: function onPageIndexChanged(callback) {
    return this.watch('pageIndex', callback);
  },
  initElement: function initElement(element, state) {
    var self = this;
    ScrollableMixinSuper.initElement.call(self, element, state);
    self.onDispose(app_app.on(element, {
      scrollIndexChange: function scrollIndexChange(e) {
        self.pageIndex = e.newIndex;
      },
      scrollStart: function scrollStart() {
        self.scrolling = true;
      },
      scrollStop: function scrollStop() {
        self.scrolling = false;
      }
    }, true));
  }
});
each('destroy enable disable setOptions setStickyPosition refresh scrollPadding stop scrollLeft scrollTop scrollBy scrollTo scrollByPage scrollToPage scrollToElement', function (i, v) {
  defineHiddenProperty(ScrollableMixin.prototype, v, function () {
    var obj = getDirectiveComponent(this.elements()[0]);
    return obj.scrollable[v].apply(null, arguments);
  });
});
;// CONCATENATED MODULE: ./src/mixins/ScrollIntoViewMixin.js



function ScrollIntoViewMixin() {
  StatefulMixin.call(this);
}
definePrototype(ScrollIntoViewMixin, StatefulMixin, {
  when: function when(deps) {
    this.state.deps = deps;
    return this;
  },
  initElement: function initElement(element, state) {
    state.callback = function () {
      scrollIntoView(element);
    };
  },
  mergeState: function mergeState(element, state, newState) {
    if (newState.deps && !equal(newState.deps, state.deps)) {
      setImmediateOnce(state.callback);
    }

    extend(state, newState);
  }
});
;// CONCATENATED MODULE: ./src/mixins/UnmanagedClassNameMixin.js


function UnmanagedClassNameMixin() {
  ClassNameMixin.call(this);
}
definePrototype(UnmanagedClassNameMixin, ClassNameMixin, {
  memorize: function memorize() {
    this.classNames = makeArray(arguments);
    return this;
  }
});
;// CONCATENATED MODULE: ./src/mixin.js

















function extendSelf(options) {
  extend(this, options);
}

function createUseFunction(ctor) {
  return function () {
    var mixin = useMixin(ctor);
    (mixin.withOptions || extendSelf).apply(mixin, arguments);
    return mixin;
  };
}

var useAnimateMixin = createUseFunction(AnimateMixin);
var useAnimateSequenceMixin = createUseFunction(AnimateSequenceMixin);
var useClassNameToggleMixin = createUseFunction(ClassNameToggleMixin);
var useFlyoutMixin = createUseFunction(FlyoutMixin);
var useFocusStateMixin = createUseFunction(FocusStateMixin);
var useLoadingStateMixin = createUseFunction(LoadingStateMixin);
var useScrollableMixin = createUseFunction(ScrollableMixin);
var useScrollIntoViewMixin = createUseFunction(ScrollIntoViewMixin);
var useUnmanagedClassNameMixin = createUseFunction(UnmanagedClassNameMixin);
function useMixin(ctor) {
  return (0,external_zeta_dom_react_.useSingleton)(function () {
    return new ctor();
  }).reset();
}
function useMixinRef(mixin) {
  return mixin && mixin.getMixin().reset();
}

;// CONCATENATED MODULE: ./src/index.js

/* harmony default export */ const src = (brew_js_app);





;// CONCATENATED MODULE: ./src/entry.js

/* harmony default export */ const entry = (src_namespaceObject);

brew_js_app.react = src_namespaceObject;
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=brew-js-react.js.map