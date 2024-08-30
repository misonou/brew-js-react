/*! brew-js-react v0.6.1 | (c) misonou | https://misonou.github.io */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("zeta-dom"), require("react"), require("react-dom"), require("brew-js"), require("zeta-dom-react"), require("waterpipe"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define("brew-js-react", ["zeta-dom", "react", "react-dom", "brew-js", "zeta-dom-react", "waterpipe", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["brew-js-react"] = factory(require("zeta-dom"), require("react"), require("react-dom"), require("brew-js"), require("zeta-dom-react"), require("waterpipe"), require("jquery"));
	else
		root["brew"] = root["brew"] || {}, root["brew"]["react"] = factory(root["zeta"], root["React"], root["ReactDOM"], root["brew"], root["zeta"]["react"], root["waterpipe"], root["jQuery"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__231__, __WEBPACK_EXTERNAL_MODULE__12__, __WEBPACK_EXTERNAL_MODULE__33__, __WEBPACK_EXTERNAL_MODULE__760__, __WEBPACK_EXTERNAL_MODULE__402__, __WEBPACK_EXTERNAL_MODULE__87__, __WEBPACK_EXTERNAL_MODULE__914__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__87__;

/***/ }),

/***/ 760:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__760__;

/***/ }),

/***/ 914:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__914__;

/***/ }),

/***/ 12:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__12__;

/***/ }),

/***/ 33:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__33__;

/***/ }),

/***/ 231:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__231__;

/***/ }),

/***/ 402:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__402__;

/***/ }),

/***/ 621:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ReactDOM = __webpack_require__(33);
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
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  AnimateMixin: () => (/* reexport */ AnimateMixin),
  AnimateSequenceItemMixin: () => (/* reexport */ AnimateSequenceItemMixin),
  AnimateSequenceMixin: () => (/* reexport */ AnimateSequenceMixin),
  ClassNameMixin: () => (/* reexport */ ClassNameMixin),
  ClassNameToggleMixin: () => (/* reexport */ ClassNameToggleMixin),
  Dialog: () => (/* reexport */ Dialog),
  FlyoutMixin: () => (/* reexport */ FlyoutMixin),
  FlyoutToggleMixin: () => (/* reexport */ FlyoutToggleMixin),
  FocusStateMixin: () => (/* reexport */ FocusStateMixin),
  LoadingStateMixin: () => (/* reexport */ LoadingStateMixin),
  Mixin: () => (/* reexport */ Mixin),
  ScrollIntoViewMixin: () => (/* reexport */ ScrollIntoViewMixin),
  ScrollableMixin: () => (/* reexport */ ScrollableMixin),
  StatefulMixin: () => (/* reexport */ StatefulMixin),
  UnmanagedClassNameMixin: () => (/* reexport */ UnmanagedClassNameMixin),
  ViewStateContainer: () => (/* reexport */ ViewStateContainer),
  createDialog: () => (/* reexport */ createDialog),
  isViewMatched: () => (/* reexport */ isViewMatched),
  isViewRendered: () => (/* reexport */ isViewRendered),
  linkTo: () => (/* reexport */ linkTo),
  makeTranslation: () => (/* reexport */ makeTranslation),
  matchView: () => (/* reexport */ matchView),
  navigateTo: () => (/* reexport */ navigateTo),
  redirectTo: () => (/* reexport */ redirectTo),
  registerErrorView: () => (/* reexport */ registerErrorView),
  registerView: () => (/* reexport */ registerView),
  renderView: () => (/* reexport */ renderView),
  resolvePath: () => (/* reexport */ resolvePath),
  useAnimateMixin: () => (/* reexport */ useAnimateMixin),
  useAnimateSequenceMixin: () => (/* reexport */ useAnimateSequenceMixin),
  useAppReady: () => (/* reexport */ useAppReady),
  useAppReadyState: () => (/* reexport */ useAppReadyState),
  useClassNameToggleMixin: () => (/* reexport */ useClassNameToggleMixin),
  useFlyoutMixin: () => (/* reexport */ useFlyoutMixin),
  useFocusStateMixin: () => (/* reexport */ useFocusStateMixin),
  useLanguage: () => (/* reexport */ useLanguage),
  useLoadingStateMixin: () => (/* reexport */ useLoadingStateMixin),
  useMixin: () => (/* reexport */ useMixin),
  useMixinRef: () => (/* reexport */ useMixinRef),
  useQueryParam: () => (/* reexport */ useQueryParam),
  useRouteParam: () => (/* reexport */ useRouteParam),
  useRouteState: () => (/* reexport */ useRouteState),
  useScrollIntoViewMixin: () => (/* reexport */ useScrollIntoViewMixin),
  useScrollableMixin: () => (/* reexport */ useScrollableMixin),
  useUnmanagedClassNameMixin: () => (/* reexport */ useUnmanagedClassNameMixin),
  useViewContainerState: () => (/* reexport */ useViewContext),
  useViewContext: () => (/* reexport */ useViewContext)
});

// EXTERNAL MODULE: external {"commonjs":"zeta-dom","commonjs2":"zeta-dom","amd":"zeta-dom","root":"zeta"}
var external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_ = __webpack_require__(231);
;// CONCATENATED MODULE: ./|umd|/zeta-dom/util.js

var _lib$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
  any = _lib$util.any,
  arrRemove = _lib$util.arrRemove,
  catchAsync = _lib$util.catchAsync,
  combineFn = _lib$util.combineFn,
  createPrivateStore = _lib$util.createPrivateStore,
  util_define = _lib$util.define,
  defineGetterProperty = _lib$util.defineGetterProperty,
  defineHiddenProperty = _lib$util.defineHiddenProperty,
  defineObservableProperty = _lib$util.defineObservableProperty,
  defineOwnProperty = _lib$util.defineOwnProperty,
  definePrototype = _lib$util.definePrototype,
  delay = _lib$util.delay,
  each = _lib$util.each,
  either = _lib$util.either,
  equal = _lib$util.equal,
  exclude = _lib$util.exclude,
  executeOnce = _lib$util.executeOnce,
  extend = _lib$util.extend,
  fill = _lib$util.fill,
  freeze = _lib$util.freeze,
  grep = _lib$util.grep,
  isArray = _lib$util.isArray,
  isFunction = _lib$util.isFunction,
  isPlainObject = _lib$util.isPlainObject,
  isThenable = _lib$util.isThenable,
  isUndefinedOrNull = _lib$util.isUndefinedOrNull,
  util_keys = _lib$util.keys,
  kv = _lib$util.kv,
  makeArray = _lib$util.makeArray,
  map = _lib$util.map,
  mapObject = _lib$util.mapObject,
  noop = _lib$util.noop,
  pick = _lib$util.pick,
  randomId = _lib$util.randomId,
  resolve = _lib$util.resolve,
  resolveAll = _lib$util.resolveAll,
  setImmediate = _lib$util.setImmediate,
  setImmediateOnce = _lib$util.setImmediateOnce,
  single = _lib$util.single,
  throwNotFunction = _lib$util.throwNotFunction,
  _throws = _lib$util["throws"],
  watch = _lib$util.watch,
  watchable = _lib$util.watchable;

// EXTERNAL MODULE: external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"}
var external_commonjs_react_commonjs2_react_amd_react_root_React_ = __webpack_require__(12);
;// CONCATENATED MODULE: ./|umd|/react.js

var Component = external_commonjs_react_commonjs2_react_amd_react_root_React_.Component,
  Fragment = external_commonjs_react_commonjs2_react_amd_react_root_React_.Fragment,
  StrictMode = external_commonjs_react_commonjs2_react_amd_react_root_React_.StrictMode,
  createContext = external_commonjs_react_commonjs2_react_amd_react_root_React_.createContext,
  createElement = external_commonjs_react_commonjs2_react_amd_react_root_React_.createElement,
  useContext = external_commonjs_react_commonjs2_react_amd_react_root_React_.useContext,
  useEffect = external_commonjs_react_commonjs2_react_amd_react_root_React_.useEffect,
  useMemo = external_commonjs_react_commonjs2_react_amd_react_root_React_.useMemo,
  useRef = external_commonjs_react_commonjs2_react_amd_react_root_React_.useRef,
  useState = external_commonjs_react_commonjs2_react_amd_react_root_React_.useState;

// EXTERNAL MODULE: external {"commonjs":"react-dom","commonjs2":"react-dom","amd":"react-dom","root":"ReactDOM"}
var external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_ = __webpack_require__(33);
// EXTERNAL MODULE: ./node_modules/@misonou/react-dom-client/fallback.js
var fallback = __webpack_require__(621);
;// CONCATENATED MODULE: ./|umd|/zeta-dom/domUtil.js

var domUtil_lib$util = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.util,
  containsOrEquals = domUtil_lib$util.containsOrEquals,
  getClass = domUtil_lib$util.getClass,
  removeNode = domUtil_lib$util.removeNode,
  scrollIntoView = domUtil_lib$util.scrollIntoView,
  setClass = domUtil_lib$util.setClass;

;// CONCATENATED MODULE: ./|umd|/zeta-dom/dom.js

var dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom;
/* harmony default export */ const zeta_dom_dom = (dom);
var reportError = dom.reportError;

;// CONCATENATED MODULE: ./|umd|/zeta-dom/domLock.js

var _lib$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
  lock = _lib$dom.lock,
  notifyAsync = _lib$dom.notifyAsync,
  preventLeave = _lib$dom.preventLeave,
  runAsync = _lib$dom.runAsync,
  subscribeAsync = _lib$dom.subscribeAsync;

// EXTERNAL MODULE: external {"commonjs":"brew-js","commonjs2":"brew-js","amd":"brew-js","root":"brew"}
var external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_ = __webpack_require__(760);
;// CONCATENATED MODULE: ./|umd|/brew-js/domAction.js

var closeFlyout = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.closeFlyout,
  isFlyoutOpen = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.isFlyoutOpen,
  openFlyout = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.openFlyout,
  toggleFlyout = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.toggleFlyout;

;// CONCATENATED MODULE: ./src/dialog.js









/**
 * @param {Partial<import("./dialog").DialogOptions<any>>} props
 */
function createDialog(props) {
  var root = document.createElement('div');
  var reactRoot = fallback.createRoot(root);
  var closeDialog = closeFlyout.bind(0, root);
  var promise;
  zeta_dom_dom.on(root, {
    flyoutshow: function flyoutshow() {
      (props.onOpen || noop)(root);
    },
    flyouthide: function flyouthide() {
      promise = null;
      removeNode(root);
      (props.onClose || noop)(root);
      if (props.onRender) {
        reactRoot.unmount();
      }
    }
  });
  root.setAttribute('loading-class', '');
  subscribeAsync(root, true);
  return {
    root: root,
    close: closeDialog,
    open: function open() {
      if (promise) {
        return promise;
      }
      root.className = props.className || '';
      document.body.appendChild(root);
      if (props.modal) {
        root.setAttribute('is-modal', '');
      }
      if (props.onRender) {
        var dialogProps = extend({}, props, {
          closeDialog: props.onCommit ? function (value) {
            return runAsync(zeta_dom_dom.activeElement, props.onCommit.bind(this, value)).then(closeDialog);
          } : closeDialog
        });
        var content = /*#__PURE__*/createElement(props.onRender, dialogProps);
        if (props.wrapper) {
          content = /*#__PURE__*/createElement(props.wrapper, dialogProps, content);
        }
        reactRoot.render( /*#__PURE__*/createElement(StrictMode, null, content));
      }
      promise = resolve().then(function () {
        zeta_dom_dom.retainFocus(zeta_dom_dom.activeElement, root);
        return openFlyout(root, null, pick(props, ['focus']));
      });
      if (props.preventLeave) {
        preventLeave(root, promise);
      } else if (props.preventNavigation) {
        lock(root, promise);
      }
      return promise;
    }
  };
}

/**
 * @param {import("./dialog").DialogProps} props
 */
function Dialog(props) {
  var _props = useState({})[0];
  var dialog = useState(function () {
    return createDialog(_props);
  })[0];
  extend(_props, props);
  useEffect(function () {
    var opened = containsOrEquals(zeta_dom_dom.root, dialog.root);
    if (either(opened, _props.isOpen)) {
      if (!opened) {
        dialog.open();
      } else {
        dialog.close();
      }
    }
  }, [_props.isOpen]);
  useEffect(function () {
    return dialog.close;
  }, [dialog]);
  return /*#__PURE__*/external_commonjs_react_dom_commonjs2_react_dom_amd_react_dom_root_ReactDOM_.createPortal(props.children, dialog.root);
}
// EXTERNAL MODULE: external {"commonjs":"zeta-dom-react","commonjs2":"zeta-dom-react","amd":"zeta-dom-react","root":["zeta","react"]}
var external_commonjs_zeta_dom_react_commonjs2_zeta_dom_react_amd_zeta_dom_react_root_zeta_react_ = __webpack_require__(402);
;// CONCATENATED MODULE: ./|umd|/zeta-dom-react.js

var ViewStateProvider = external_commonjs_zeta_dom_react_commonjs2_zeta_dom_react_amd_zeta_dom_react_root_zeta_react_.ViewStateProvider,
  classNames = external_commonjs_zeta_dom_react_commonjs2_zeta_dom_react_amd_zeta_dom_react_root_zeta_react_.classNames,
  useAsync = external_commonjs_zeta_dom_react_commonjs2_zeta_dom_react_amd_zeta_dom_react_root_zeta_react_.useAsync,
  useMemoizedFunction = external_commonjs_zeta_dom_react_commonjs2_zeta_dom_react_amd_zeta_dom_react_root_zeta_react_.useMemoizedFunction,
  useObservableProperty = external_commonjs_zeta_dom_react_commonjs2_zeta_dom_react_amd_zeta_dom_react_root_zeta_react_.useObservableProperty,
  useSingleton = external_commonjs_zeta_dom_react_commonjs2_zeta_dom_react_amd_zeta_dom_react_root_zeta_react_.useSingleton,
  useValueTrigger = external_commonjs_zeta_dom_react_commonjs2_zeta_dom_react_amd_zeta_dom_react_root_zeta_react_.useValueTrigger;

;// CONCATENATED MODULE: ./|umd|/zeta-dom/events.js

var EventContainer = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.EventContainer;

;// CONCATENATED MODULE: ./|umd|/brew-js/util/common.js

var getQueryParam = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.getQueryParam,
  setQueryParam = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.setQueryParam;

;// CONCATENATED MODULE: ./|umd|/brew-js/util/path.js

var parsePath = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.parsePath,
  removeQueryAndHash = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.removeQueryAndHash;

;// CONCATENATED MODULE: ./|umd|/brew-js/app.js

/* harmony default export */ const app = ((/* unused pure expression or super */ null && (lib)));
var install = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.install;

;// CONCATENATED MODULE: ./|umd|/brew-js/defaults.js

var defaults = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.defaults;
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
;// CONCATENATED MODULE: ./|umd|/brew-js/anim.js

var animateIn = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.animateIn,
  animateOut = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.animateOut;

;// CONCATENATED MODULE: ./src/view.js










var _ = createPrivateStore();
var root = zeta_dom_dom.root;
var routeMap = new Map();
var usedParams = {};
var sortedViews = [];
var emitter = new EventContainer();
var rootContext = freeze(extend(new ViewContext(), {
  container: root
}));
var rootState = _(rootContext);
var StateContext = /*#__PURE__*/createContext(rootContext);
var errorView;
/** @type {Partial<Zeta.ZetaEventType<"beforepageload", Brew.RouterEventMap, Element>>} */
var view_event = {};
onAppInit(function () {
  app_app.on('beforepageload', function (e) {
    rootState.setPage(app_app.page);
    rootState.setActive(true);
    view_event = e;
    (function updateViewRecursive(next) {
      each(next.children, function (i, v) {
        e.waitFor(new Promise(function (resolve) {
          v.onRender = resolve;
          v.forceUpdate();
        }).then(function () {
          updateViewRecursive(v);
        }));
      });
    })(rootState);
  });
});
function ViewContext(view, page, parent) {
  var self = this;
  defineOwnProperty(self, 'view', view || null, true);
  defineOwnProperty(self, 'parent', parent || null, true);
  _(self, {
    children: [],
    setPage: defineObservableProperty(self, 'page', page || null, true),
    setActive: defineObservableProperty(self, 'active', !!page, true)
  });
  watch(self, 'page', function (page, previousPage) {
    emitter.emit('pagechange', self, {
      page: page,
      previousPage: previousPage,
      navigationType: view_event.navigationType,
      waitFor: view_event.waitFor
    });
  });
}
definePrototype(ViewContext, {
  getChildren: function getChildren() {
    return map(_(this).children, function (v) {
      return v.currentContext;
    });
  },
  on: function on(event, handler) {
    return emitter.add(this, event, handler);
  }
});
function ErrorBoundary() {
  Component.apply(this, arguments);
  this.state = {};
}
ErrorBoundary.contextType = StateContext;
definePrototype(ErrorBoundary, Component, {
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
        reportError(error, self.context.container);
      });
      // ensure promise sent to beforepageload event is resolved
      self.props.onComponentLoaded();
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
      return /*#__PURE__*/createElement(errorView, {
        onComponentLoaded: onComponentLoaded,
        viewProps: props
      });
    }
    return /*#__PURE__*/createElement(props.view, {
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
  Component.apply(this, arguments);
}
ViewContainer.contextType = StateContext;
definePrototype(ViewContainer, Component, {
  setActive: noop,
  componentDidMount: function componentDidMount() {
    var self = this;
    var parent = _(self.context).children;
    var unwatch = watch(app_app.route, function () {
      self.setActive(self.getViewComponent() === self.currentViewComponent);
    });
    self.componentWillUnmount = function () {
      self.setActive(false);
      arrRemove(parent, self);
      unwatch();
      setImmediate(function () {
        if (self.unmountView && !self.currentContext.active) {
          self.unmountView();
        }
      });
    };
    parent.push(self);
    self.setActive(true);
  },
  render: function render() {
    /** @type {any} */
    var self = this;
    if (self.context.active) {
      self.updateView();
    }
    (self.onRender || noop)();
    return /*#__PURE__*/createElement(Fragment, null, self.prevView, self.currentView);
  },
  updateView: function updateView() {
    var self = this;
    var V = self.getViewComponent();
    var viewChanged = V !== self.currentViewComponent;
    if (V && (viewChanged || !(self.children || '')[0])) {
      // ensure the current path actually corresponds to the matched view
      // when some views are not included in the list of allowed views
      var targetPath = resolvePath(V, app_app.route);
      if (targetPath !== removeQueryAndHash(app_app.path)) {
        app_app.navigate(targetPath, true);
        return;
      }
    }
    if (V && viewChanged) {
      (self.unmountView || noop)(true);
      var context = new ViewContext(V, app_app.page, self.context);
      var state = routeMap.get(V);
      var onComponentLoaded;
      var promise = new Promise(function (resolve) {
        onComponentLoaded = resolve;
      });
      var unmountView = onComponentLoaded;
      var initElement = executeOnce(function (element) {
        context.container = element;
        promise.then(function () {
          if (self.currentContext === context) {
            unmountView = function unmountView() {
              self.prevView = self.currentView;
              app_app.emit('pageleave', element, {
                pathname: context.page.path,
                view: V
              }, true);
              animateOut(element, 'show').then(function () {
                self.prevView = undefined;
                self.forceUpdate();
              });
            };
            animateIn(element, 'show', '[brew-view]', true);
            app_app.emit('pageenter', element, {
              pathname: context.page.path,
              view: V
            }, true);
          }
        });
        notifyAsync(element, promise);
      });
      var viewProps = function viewProps() {
        return freeze({
          navigationType: view_event.navigationType,
          viewContext: context,
          viewData: context.page.data || {}
        });
      };
      var view = /*#__PURE__*/createElement(StateContext.Provider, {
        key: state.id,
        value: context
      }, /*#__PURE__*/createElement(ViewStateContainer, null, /*#__PURE__*/createElement('div', extend({}, self.props.rootProps, {
        ref: initElement,
        'brew-view': ''
      }), /*#__PURE__*/createElement(ErrorBoundary, {
        onComponentLoaded: onComponentLoaded,
        viewProps: viewProps
      }))));
      extend(self, _(context), {
        currentContext: context,
        currentView: view,
        currentViewComponent: V,
        unmountView: executeOnce(function () {
          self.setActive(false);
          state.rendered--;
          unmountView();
        })
      });
      state.rendered++;
      (view_event.waitFor || noop)(promise);
    }
    (self.setPage || noop)(app_app.page);
  },
  getViewComponent: function getViewComponent() {
    var props = this.props;
    return any(props.views, isViewMatched) || props.defaultView;
  }
});
function getCurrentParams(view, params) {
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
  return extend(pick(app_app.route, state.minParams), params && pick(params, state.maxParams), state.params);
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
  if (factory.prototype instanceof Component) {
    factory = createElement.bind(null, factory);
  }
  return function fn(props) {
    var viewContext = useContext(StateContext);
    var viewProps = useState(props.viewProps);
    var children = !promise && factory(viewProps[0]);
    if (isThenable(children)) {
      promise = children;
      children = null;
      catchAsync(promise);
    }
    var state = useAsync(function () {
      return promise;
    }, !!promise)[1];
    var loaded = !promise || !state.loading;
    useEffect(function () {
      // listen to property directly so that it is invoked after pagechange event handlers in actual component
      return watch(viewContext, 'page', function () {
        viewProps[1](props.viewProps);
      });
    }, []);
    useEffect(function () {
      if (loaded) {
        setImmediate(props.onComponentLoaded);
      }
    }, [loaded]);
    if (state.error) {
      throw state.error;
    }
    return children || (state.value ? /*#__PURE__*/createElement(state.value["default"], viewProps[0]) : null);
  };
}
function useViewContext() {
  return useContext(StateContext);
}
function isViewMatched(view) {
  return matchViewParams(view, app_app.route);
}
function isViewRendered(view) {
  return !!(routeMap.get(view) || '').rendered;
}
function matchView() {
  var views = makeArray(arguments);
  var route = app_app.route;
  if (typeof views[0] === 'string') {
    route = route.parse(views.shift());
  }
  views = views[0] ? (isArray(views[0]) ? makeArray(views[0]) : views).sort(sortViews) : sortedViews;
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
    rendered: 0,
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
  return /*#__PURE__*/createElement(ViewContainer, {
    rootProps: rootProps,
    views: views,
    defaultView: defaultView
  });
}
function resolvePath(view, params) {
  if (!routeMap.has(view)) {
    return '/';
  }
  return app_app.route.getPath(getCurrentParams(view, params));
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








var hooks_emitter = new EventContainer();
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
  useEffect(function () {
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
  var readyState = useObservableProperty(app_app, 'readyState');
  return {
    ready: readyState === 'ready',
    error: readyState === 'error'
  };
}
function useRouteParam(name, defaultValue) {
  var container = useViewContext();
  var params = container.page.params;
  var value = params[name] || '';
  var notifyChange = useValueTrigger(value);
  useEffect(function () {
    var setValue = function setValue() {
      notifyChange(container.page.params[name] || '');
    };
    // route parameter might be changed after state initialization and before useEffect hook is called
    setValue();
    return container.on('pagechange', setValue);
  }, [name]);
  if (defaultValue && container.active && (!value || name === 'remainingSegments' && value === '/')) {
    app_app.navigate(app_app.route.getPath(extend({}, params, kv(name, defaultValue))), true);
  }
  return value;
}
function useRouteState(key, defaultValue, snapshotOnUpdate) {
  var cur = getCurrentStates();
  var state = useState(cur && cur.has(key) ? cur.get(key) : defaultValue);
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
function useQueryParam(key, value, snapshotOnUpdate) {
  if (isPlainObject(key)) {
    snapshotOnUpdate = value;
    value = key;
    key = false;
  }
  var container = useViewContext();
  var getParams = function getParams() {
    return freeze(mapObject(key === false ? value : kv(key, value), function (v, i) {
      return getQueryParam(i, app_app.path) || v || '';
    }));
  };
  var ref = useRef({});
  useMemo(function () {
    ref.current = getParams();
  }, [key]);
  var current = ref.current;
  var notifyChange = useValueTrigger(current, function (current, params) {
    return equal(current, params) || !(ref.current = params);
  });
  var setParams = useMemoizedFunction(function (values) {
    var current = ref.current;
    if (key !== false) {
      values = kv(key, isFunction(values) ? values(current[key]) : values);
    } else if (isFunction(values)) {
      values = values(extend({}, current));
    }
    if (container.active) {
      var url = parsePath(app_app.path);
      var search = util_keys(values).reduce(function (v, i) {
        return values[i] !== current[i] ? setQueryParam(i, values[i] || null, v) : v;
      }, url.search);
      if (search !== url.search) {
        if (snapshotOnUpdate) {
          app_app.snapshot();
        }
        catchAsync(app_app.navigate((search || '?') + url.hash, true));
        notifyChange(getParams());
      }
    }
  });
  useEffect(function () {
    return app_app.watch('path', function () {
      if (container.active) {
        notifyChange(getParams());
      }
    });
  }, [key]);
  return [key !== false ? current[key] : current, setParams];
}
function ViewStateContainer(props) {
  var cache = useState({})[0];
  var container = useViewContextWithEffect(function (cur) {
    each(cache, function (i, v) {
      updateViewState(v, v.key, cur);
    });
  }, []);
  var provider = useState(function () {
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
  return /*#__PURE__*/createElement(ViewStateProvider, {
    value: provider
  }, props.children);
}
// EXTERNAL MODULE: external "waterpipe"
var external_waterpipe_ = __webpack_require__(87);
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
  return useObservableProperty(app_app, 'language');
}
function makeTranslation(resources, defaultLang) {
  var re = new RegExp('^(' + Object.keys(resources[defaultLang]).join('|') + ')\\.');
  var cache = {};
  function getTranslation(prefix, name, data, noEncode, lang) {
    var str = ((resources[lang] || empty)[prefix] || empty)[name];
    if (typeof str === 'string') {
      if (str && (!noEncode || data !== undefined)) {
        return external_waterpipe_(str, data, {
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


function StaticAttributeMixin(name, value) {
  Mixin.call(this);
  this.attributes = isPlainObject(name) || kv(name, value || '');
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
    return new StaticAttributeMixin('scrollable-target');
  },
  get tabRoot() {
    return new StaticAttributeMixin('tab-root');
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
      className: classNames.apply(null, args)
    });
    each(mixins, function (i, v) {
      v.next();
    });
    return props;
  }
});
;// CONCATENATED MODULE: ./|umd|/zeta-dom/observe.js

var observe_lib$dom = external_commonjs_zeta_dom_commonjs2_zeta_dom_amd_zeta_dom_root_zeta_.dom,
  watchElements = observe_lib$dom.watchElements,
  watchOwnAttributes = observe_lib$dom.watchOwnAttributes;

;// CONCATENATED MODULE: ./src/mixins/StatefulMixin.js


var StatefulMixin_ = createPrivateStore();
var unmounted = new Set();
function disposeUnmountedStates() {
  each(unmounted, function (i, v) {
    combineFn(StatefulMixin_(v).splice(0))();
  });
  unmounted.clear();
}
function MixinState(parent, element) {
  StatefulMixin_(this, [parent["delete"].bind(parent, element)]);
  parent.set(element, this);
}
definePrototype(MixinState, {
  onDispose: function onDispose(callback) {
    StatefulMixin_(this).push(throwNotFunction(callback));
  }
});
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
    pending: {},
    elements: [],
    states: new Map(),
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
    var element, state;
    return function (current) {
      if (current) {
        element = current;
        state = obj.states.get(element) || new MixinState(obj.states, element);
        obj.elements.push(element);
        if (!state.element) {
          self.initElement(element, extend(state, self.initState(), newState, {
            element: element
          }));
        } else if (util_keys(newState)[0]) {
          self.mergeState(element, state, newState);
        }
        self.onLayoutEffect(element, state);
        unmounted["delete"](state);
      } else if (state) {
        unmounted.add(state);
        self.onBeforeUpdate(element, state);
        arrRemove(obj.elements, element);
      }
      setImmediateOnce(disposeUnmountedStates);
    };
  },
  elements: function elements() {
    return StatefulMixin_(this).elements.slice();
  },
  onDispose: function onDispose(callback) {
    StatefulMixin_(this).dispose.push(callback);
  },
  initState: function initState() {
    return {};
  },
  initElement: function initElement(element, state) {},
  mergeState: function mergeState(element, state, newState) {
    extend(state, newState);
  },
  onLayoutEffect: function onLayoutEffect(element, state) {},
  onBeforeUpdate: function onBeforeUpdate(element, state) {},
  clone: function clone() {
    return this;
  },
  dispose: function dispose() {
    var state = StatefulMixin_(this);
    each(state.states, function (i, v) {
      unmounted.add(v);
    });
    setImmediateOnce(disposeUnmountedStates);
    combineFn(state.dispose.splice(0))();
    state.flush();
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
  if (fireEvent && !equal(state.prev || prev, classNames)) {
    state.prev = prev;
    self.onClassNameUpdated(element, prev, extend({}, classNames));
  }
}
function ClassNameMixin(classNames) {
  StatefulMixin.call(this);
  this.classNames = classNames || [];
}
definePrototype(ClassNameMixin, StatefulMixin, {
  initElement: function initElement(element, state) {
    var self = this;
    state.classNames = fill(self.classNames, false);
    checkState(self, element, state);
    state.onDispose(watchOwnAttributes(element, 'class', function () {
      checkState(self, element, state, true);
    }).dispose);
  },
  onLayoutEffect: function onLayoutEffect(element, state) {
    setClass(element, state.classNames);
  },
  onBeforeUpdate: function onBeforeUpdate(element, state) {
    checkState(this, element, state);
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
    return extend(AnimateMixinSuper.getCustomAttributes.call(self), {
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
    return extend(AnimateSequenceItemMixinSuper.getCustomAttributes.call(this), {
      'is-animate-sequence': ''
    });
  },
  getClassNames: function getClassNames() {
    return [this.className].concat(AnimateSequenceItemMixinSuper.getClassNames.call(this));
  }
});
// EXTERNAL MODULE: external {"commonjs":"jquery","commonjs2":"jquery","amd":"jquery","root":"jQuery"}
var external_commonjs_jquery_commonjs2_jquery_amd_jquery_root_jQuery_ = __webpack_require__(914);
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
    return extend(AnimateSequenceMixinSuper.getCustomAttributes.call(self), {
      'animate-in': null,
      'animate-sequence-type': (self.effects || []).join(' '),
      'animate-sequence': self.selector || '.' + self.className
    });
  },
  initElement: function initElement(element, state) {
    var self = this;
    AnimateSequenceMixinSuper.initElement.call(self, element, state);
    if (self.selector) {
      state.onDispose(watchElements(element, self.selector, function (addedNodes) {
        external_commonjs_jquery_commonjs2_jquery_amd_jquery_root_jQuery_(addedNodes).attr('is-animate-sequence', '');
      }).dispose);
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
function triggerFlyoutAction(self, state, trigger, action, args) {
  if ((state.trigger || 'click') === trigger) {
    action.apply(self, args);
  }
}
definePrototype(FlyoutToggleMixin, ClassNameMixin, {
  on: function on(trigger) {
    this.state.trigger = trigger;
    return this;
  },
  open: function open(value, source) {
    return this.flyoutMixin.open(value, source);
  },
  close: function close(value) {
    return this.flyoutMixin.close(value);
  },
  toggle: function toggle(flag, source) {
    return this.flyoutMixin.toggleSelf(flag, source);
  },
  initElement: function initElement(element, state) {
    var self = this;
    FlyoutToggleMixinSuper.initElement.call(self, element, state);
    state.onDispose(zeta_dom_dom.on(element, {
      focusin: function focusin() {
        triggerFlyoutAction(self, state, 'focus', self.open, [null, zeta_dom_dom.activeElement]);
      },
      focusout: function focusout() {
        triggerFlyoutAction(self, state, 'focus', self.close, []);
      },
      click: function click() {
        triggerFlyoutAction(self, state, 'click', self.toggle, [element]);
      }
    }));
  }
});
;// CONCATENATED MODULE: ./src/mixins/FlyoutMixin.js





var FlyoutMixinSuper = ClassNameMixin.prototype;
var valueMap = new WeakMap();
function _toggleSelf(self, flag, value, source) {
  if (!flag && !isFlyoutOpen(self.element)) {
    return resolve();
  }
  var options = self.getOptions();
  return flag ? openFlyout(self.element, value, source, options) : toggleFlyout(self.element, source, options);
}
function FlyoutMixin() {
  var self = this;
  ClassNameMixin.call(self, ['open', 'closing', 'visible', 'tweening-in', 'tweening-out']);
  self.modal = false;
  self.tabThrough = false;
  self.isFlyoutOpened = false;
  self.animating = false;
  self.visible = false;
  self.initialFocus = undefined;
  self.toggle = new FlyoutToggleMixin(self);
  self.onDispose(function () {
    self.isFlyoutOpened = false;
    self.visible = false;
    self.toggle.dispose();
  });
}
definePrototype(FlyoutMixin, ClassNameMixin, {
  get element() {
    return this.elements()[0] || null;
  },
  getOptions: function getOptions() {
    var self = this;
    var options = pick(self, ['closeOnBlur']);
    if (self.initialFocus !== undefined) {
      options.focus = self.initialFocus;
    }
    return options;
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
    var self = this;
    return extend(FlyoutMixinSuper.getCustomAttributes.call(self), {
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
  open: function open(value, source) {
    return _toggleSelf(this, true, value, source);
  },
  close: function close(value) {
    return closeFlyout(this.element, value);
  },
  toggleSelf: function toggleSelf(flag, source) {
    if (typeof flag !== 'boolean') {
      source = flag;
      flag = !isFlyoutOpen(this.element);
    }
    return _toggleSelf(this, flag, undefined, source);
  },
  onOpen: function onOpen(callback) {
    return this.onToggleState(function (opened) {
      if (opened) {
        callback(valueMap.get(this.element));
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
    if (self.elements()[1]) {
      _throws('FlyoutMixin only supports single element');
    }
    FlyoutMixinSuper.initElement.call(self, element, state);
    state.onDispose(app_app.on(element, {
      flyoutshow: function flyoutshow(e) {
        valueMap.set(element, e.data);
        self.isFlyoutOpened = true;
        self.visible = true;
      },
      flyoutclose: function flyoutclose() {
        self.isFlyoutOpened = false;
      },
      flyouthide: function flyouthide() {
        self.visible = false;
      },
      animationstart: function animationstart() {
        self.animating = true;
      },
      animationcomplete: function animationcomplete() {
        self.animating = false;
      }
    }, true));
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
    state.onDispose(zeta_dom_dom.on(element, {
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
;// CONCATENATED MODULE: ./|umd|/brew-js/directive.js

var getDirectiveComponent = external_commonjs_brew_js_commonjs2_brew_js_amd_brew_js_root_brew_.getDirectiveComponent;

;// CONCATENATED MODULE: ./src/mixins/LoadingStateMixin.js





var LoadingStateMixinSuper = ClassNameMixin.prototype;
function LoadingStateMixin() {
  ClassNameMixin.call(this, ['loading', 'loading-complete']);
  this.loading = false;
}
definePrototype(LoadingStateMixin, ClassNameMixin, {
  initElement: function initElement(element, state) {
    var self = this;
    LoadingStateMixinSuper.initElement.call(self, element, state);
    getDirectiveComponent(element).enableLoadingClass = true;
    state.onDispose(subscribeAsync(element, function (loading) {
      self.loading = loading || !!any(self.elements(), function (v) {
        return v !== element && getClass(v, 'loading') === true;
      });
    }));
  }
});
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
  get element() {
    return this.elements()[0] || null;
  },
  get contentElement() {
    var element = this.element;
    return element && getDirectiveComponent(element).scrollable.scrollTarget;
  },
  withOptions: function withOptions(options) {
    this.options = options;
    return this;
  },
  getCustomAttributes: function getCustomAttributes() {
    var options = this.options || {};
    return extend(ScrollableMixinSuper.getCustomAttributes.call(this), {
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
    if (self.elements()[1]) {
      _throws('ScrollableMixin only supports single element');
    }
    ScrollableMixinSuper.initElement.call(self, element, state);
    state.onDispose(app_app.on(element, {
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
    var obj = getDirectiveComponent(this.element);
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
var useAnimateMixin = /*#__PURE__*/createUseFunction(AnimateMixin);
var useAnimateSequenceMixin = /*#__PURE__*/createUseFunction(AnimateSequenceMixin);
var useClassNameToggleMixin = /*#__PURE__*/createUseFunction(ClassNameToggleMixin);
var useFlyoutMixin = /*#__PURE__*/createUseFunction(FlyoutMixin);
var useFocusStateMixin = /*#__PURE__*/createUseFunction(FocusStateMixin);
var useLoadingStateMixin = /*#__PURE__*/createUseFunction(LoadingStateMixin);
var useScrollableMixin = /*#__PURE__*/createUseFunction(ScrollableMixin);
var useScrollIntoViewMixin = /*#__PURE__*/createUseFunction(ScrollIntoViewMixin);
var useUnmanagedClassNameMixin = /*#__PURE__*/createUseFunction(UnmanagedClassNameMixin);
function useMixin(ctor) {
  return useSingleton(function () {
    return new ctor();
  }).reset();
}
function useMixinRef(mixin) {
  return mixin && mixin.getMixin().reset();
}

;// CONCATENATED MODULE: ./src/index.js

/* harmony default export */ const src = ((/* unused pure expression or super */ null && (brew)));





;// CONCATENATED MODULE: ./src/entry.js

defineGetterProperty(window, 'brew-js-react', function () {
  console.warn('window["brew-js-react"] is deprecated, access brew.react instead.');
  return brew.react;
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=brew-js-react.js.map