import { Component, Fragment, createContext, createElement, useContext, useEffect } from "react";
import { createAsyncScope, useAsync } from "zeta-dom-react";
import dom, { reportError } from "zeta-dom/dom";
import { ZetaEventContainer } from "zeta-dom/events";
import { any, arrRemove, catchAsync, createPrivateStore, defineObservableProperty, defineOwnProperty, definePrototype, each, exclude, executeOnce, extend, freeze, grep, isArray, isFunction, isPlainObject, isThenable, isUndefinedOrNull, keys, makeArray, map, noop, pick, randomId, setImmediate, single, throwNotFunction, watch } from "zeta-dom/util";
import { animateIn, animateOut } from "brew-js/anim";
import { toQueryString } from "brew-js/util/common";
import { removeQueryAndHash } from "brew-js/util/path";
import { app, onAppInit } from "./app.js";
import { ViewStateContainer } from "./hooks.js";

const _ = createPrivateStore();
const root = dom.root;
const routeMap = new Map();
const usedParams = {};
const sortedViews = [];
const emitter = new ZetaEventContainer();
const rootContext = freeze(extend(new ViewContext(), { container: root }));
const rootState = _(rootContext);
const StateContext = createContext(rootContext);

var errorView;
/** @type {Partial<Zeta.ZetaEventType<"beforepageload", Brew.RouterEventMap, Element>>} */
var event = {};

onAppInit(function () {
    app.on('beforepageload', function (e) {
        rootState.setPage(app.page);
        rootState.setActive(true);
        event = e;
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
    rootState.setPage(app.page);
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
            navigationType: event.navigationType,
            waitFor: event.waitFor
        });
    });
}

definePrototype(ViewContext, {
    getChildren: function () {
        return map(_(this).children, function (v) {
            return v.currentContext;
        });
    },
    on: function (event, handler) {
        return emitter.add(this, event, handler);
    }
});

function ErrorBoundary() {
    Component.apply(this, arguments);
    this.state = {};
}
ErrorBoundary.contextType = StateContext;

definePrototype(ErrorBoundary, Component, {
    componentDidMount: function () {
        var self = this;
        self.componentWillUnmount = watch(self.context, 'page', function () {
            self.state.error = null;
            self.forceUpdate();
        });
    },
    componentDidCatch: function (error) {
        var self = this;
        if (errorView && !self.state.error) {
            self.setState({ error });
        } else {
            // ensure promise sent to beforepageload event is resolved
            self.props.onLoad();
            reportError(error, self.context.container);
        }
    },
    render: function () {
        var self = this;
        var context = self.context;
        if (!context.container) {
            setImmediate(function () {
                self.forceUpdate();
            });
            return null;
        }
        var error = self.state.error;
        var scope = self.scope || (self.scope = createAsyncScope(context.container));
        var childProps = {
            onLoad: self.props.onLoad,
            onError: self.componentDidCatch.bind(self),
            viewProps: error ? {
                view: context.view,
                error: error,
                reset: self.reset.bind(self)
            } : {
                errorHandler: scope.errorHandler,
                navigationType: event.navigationType,
                viewContext: context,
                viewData: context.page.data || {}
            }
        };
        return createElement(scope.Provider, null, createElement(error ? errorView : context.view, childProps));
    },
    reset: function () {
        this.setState({ error: null });
    }
});

function ViewContainer() {
    Component.apply(this, arguments);
}
ViewContainer.contextType = StateContext;

definePrototype(ViewContainer, Component, {
    setActive: noop,
    componentDidMount: function () {
        var self = this;
        var parent = _(self.context).children;
        var unwatch = watch(app.route, function () {
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
    render: function () {
        /** @type {any} */
        var self = this;
        if (self.context.active) {
            self.updateView();
        }
        (self.onRender || noop)();
        return createElement(Fragment, null, self.prevView, self.currentView);
    },
    updateView: function () {
        var self = this;
        var V = self.getViewComponent();
        var viewChanged = V !== self.currentViewComponent;
        if (V && (viewChanged || !(self.children || '')[0])) {
            // ensure the current path actually corresponds to the matched view
            // when some views are not included in the list of allowed views
            var targetPath = resolvePath(V, app.route);
            if (targetPath !== removeQueryAndHash(app.path)) {
                app.navigate(targetPath, true);
                return;
            }
        }
        if (V && viewChanged) {
            (self.unmountView || noop)(true);

            var context = new ViewContext(V, app.page, self.context);
            var state = routeMap.get(V);
            var onLoad;
            var promise = new Promise(function (resolve) {
                onLoad = resolve;
            });
            var unmountView = onLoad;
            var initElement = executeOnce(function (element) {
                context.container = element;
                promise.then(function () {
                    if (self.currentContext === context) {
                        unmountView = function () {
                            self.prevView = self.currentView;
                            app.emit('pageleave', element, { pathname: context.page.path, view: V }, true);
                            animateOut(element, 'show').then(function () {
                                self.prevView = undefined;
                                self.forceUpdate();
                            });
                        };
                        animateIn(element, 'show', '[brew-view]', true);
                        app.emit('pageenter', element, { pathname: context.page.path, view: V }, true);
                    }
                });
            });
            var view = createElement(StateContext.Provider, { key: state.id, value: context },
                createElement(ViewStateContainer, null,
                    createElement('div', extend({}, self.props.rootProps, { ref: initElement, 'brew-view': '' }),
                        createElement(ErrorBoundary, { onLoad }))));
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
            (event.waitFor || noop)(promise);
        }
        (self.setPage || noop)(app.page);
    },
    getViewComponent: function () {
        var props = this.props;
        return any(props.views, isViewMatched) || props.defaultView;
    }
});

function normalizePart(value, part) {
    return isUndefinedOrNull(value) || value === '' || value === part ? '' : value[0] === part ? value : part + value;
}

function getCurrentParams(view, params) {
    var state = routeMap.get(view);
    if (!state.maxParams) {
        var matchers = exclude(state.matchers, ['remainingSegments']);
        var matched = map(app.routes, function (v) {
            var route = app.parseRoute(v);
            var matched = route.length && !any(matchers, function (v, i) {
                var pos = route.params[i];
                return (v ? !(pos >= 0) : pos < route.minLength) || (!isFunction(v) && !route.match(i, v));
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
            state.maxParams = keys(extend.apply(0, [{ remainingSegments: true }].concat(matched.map(function (v) {
                return v.params;
            }))));
            state.minParams = map(last.params, function (v, i) {
                return state.params[i] || v >= last.minLength ? null : i;
            });
        }
    }
    return extend(pick(app.route, state.minParams), params && pick(params, state.maxParams), state.params);
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
        var children = promise || factory(props.viewProps);
        if (isThenable(children)) {
            promise = children;
            catchAsync(promise);
        } else {
            useEffect(props.onLoad, []);
            return children;
        }
        var component = useAsync(function () {
            return promise.then(null, props.onError);
        })[0];
        useEffect(function () {
            if (component) {
                props.onLoad();
            }
        }, [component]);
        return component ? createElement(component.default, props.viewProps) : null;
    };
}

export function useViewContext() {
    return useContext(StateContext);
}

export function isViewMatched(view) {
    return matchViewParams(view, app.route);
}

export function isViewRendered(view) {
    return !!(routeMap.get(view) || '').rendered;
}

export function matchView() {
    var views = makeArray(arguments);
    var route = app.route;
    if (typeof views[0] === 'string') {
        route = route.parse(views.shift());
    }
    views = views[0] ? (isArray(views[0]) ? makeArray(views[0]) : views).sort(sortViews) : sortedViews;
    return any(views, function (v) {
        return matchViewParams(v, route);
    }) || undefined;
}

export function registerView(factory, routeParams) {
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
        matchCount: keys(routeParams).length,
        matchers: routeParams,
        params: pick(routeParams, function (v) {
            return isUndefinedOrNull(v) || typeof v === 'string';
        })
    });
    sortedViews.push(Component);
    sortedViews.sort(sortViews);
    return Component;
}

export function registerErrorView(factory) {
    errorView = createViewComponent(factory);
}

export function renderView() {
    var views = makeArray(arguments);
    var rootProps = isFunction(views[0]) ? {} : views.shift();
    var defaultView = views[0];
    each(views, function (i, v) {
        if (!routeMap.has(v)) {
            throw new Error('Invalid argument to renderView: ' + (isFunction(v) ? v.name : v));
        }
    });
    views.sort(sortViews);
    return createElement(ViewContainer, { rootProps, views, defaultView });
}

export function resolvePath(view, params) {
    var suffix = '';
    if (isArray(params)) {
        suffix = normalizePart(isPlainObject(params[1]) ? toQueryString(params[1]) : params[1], '?') + normalizePart(params[2], '#');
        params = params[0];
    }
    return (routeMap.has(view) ? app.route.getPath(getCurrentParams(view, params)) : '/') + suffix;
}

export function linkTo(view, params) {
    return app.toHref(resolvePath(view, params));
}

export function navigateTo(view, params, data, replace) {
    return app.navigate(resolvePath(view, params), replace, data && freeze(extend({}, data)));
}

export function redirectTo(view, params, data) {
    return navigateTo(view, params, data, true);
}

export {
    useViewContext as useViewContainerState
}
