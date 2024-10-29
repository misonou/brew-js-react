import { Component, createContext, createElement, useContext, useLayoutEffect } from "react";
import { createAsyncScope, useAsync } from "zeta-dom-react";
import dom, { reportError } from "zeta-dom/dom";
import { ZetaEventContainer } from "zeta-dom/events";
import { always, any, arrRemove, catchAsync, createPrivateStore, defineObservableProperty, defineOwnProperty, definePrototype, delay, each, exclude, executeOnce, extend, fill, freeze, grep, isArray, isFunction, isPlainObject, isThenable, isUndefinedOrNull, keys, makeArray, map, noop, pick, randomId, setImmediate, single, throwNotFunction, watch } from "zeta-dom/util";
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
var event = { waitFor: noop };

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

export function ViewContext(view, page, parent) {
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
defineOwnProperty(ViewContext, 'root', rootContext, true);

definePrototype(ViewContext, {
    getChildren: function () {
        return map(_(this).children, function (v) {
            return v.currentContext;
        });
    },
    setErrorView: function (errorView, error) {
        var wrapper = _(this).wrapper;
        return wrapper && errorView && !wrapper.setState({ error, errorView });
    },
    on: function (event, handler) {
        return emitter.add(this, event, handler);
    }
});

function ErrorBoundary(props) {
    Component.call(this, props);
    this.state = {};
    _(props.context).wrapper = this;
}

definePrototype(ErrorBoundary, Component, {
    componentDidMount: function () {
        var self = this;
        self.componentWillUnmount = watch(self.props.context, 'page', function () {
            self.state.errorView = null;
            self.forceUpdate();
        });
    },
    componentDidCatch: function (error) {
        var self = this;
        if (errorView && self.state.errorView !== errorView) {
            self.setState({ error, errorView });
        } else {
            self.props.onLoad();
            reportError(error, self.props.context.container);
        }
    },
    render: function () {
        var self = this;
        var context = self.props.context;
        if (!context.container) {
            setImmediate(function () {
                extend(self, createAsyncScope(context.container));
                dom.on(context.container, 'error', function (e) {
                    return emitter.emit(e, context, { error: e.error }, false);
                });
                self.forceUpdate();
            });
            return null;
        }
        var errorView = self.state.errorView;
        if (errorView) {
            self.props.onLoad();
            return createElement(self.Provider, null, createElement(self.state.errorView, {
                view: context.view,
                error: self.state.error,
                reset: self.reset.bind(self)
            }));
        }
        var onError = self.componentDidCatch.bind(self);
        var viewProps = {
            errorHandler: self.errorHandler,
            navigationType: event.navigationType,
            viewContext: context,
            viewData: context.page.data || {}
        };
        return createElement(self.Provider, null, createElement(context.view, extend({ viewProps, onError }, self.props)));
    },
    reset: function () {
        this.setState({ errorView: null });
    }
});

function ViewContainer() {
    Component.apply(this, arguments);
    this.views = [];
}
ViewContainer.contextType = StateContext;

definePrototype(ViewContainer, Component, {
    componentDidMount: function () {
        var self = this;
        var parent = _(self.context).children;
        var unwatch = watch(app.route, function () {
            self.setActive(self.getViewComponent() === (self.currentContext || '').view);
        });
        self.componentWillUnmount = function () {
            self.setActive(false);
            arrRemove(parent, self);
            unwatch();
            setImmediate(function () {
                if (self.currentContext && !self.currentContext.active) {
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
        self.onRender();
        return self.views;
    },
    updateView: function () {
        var self = this;
        var V = self.getViewComponent();
        var viewChanged = V !== (self.currentContext || '').view;
        if (V && (viewChanged || !(self.children || '')[0])) {
            // ensure the current path actually corresponds to the matched view
            // when some views are not included in the list of allowed views
            var targetPath = resolvePath(V, app.route);
            if (targetPath !== removeQueryAndHash(app.path)) {
                app.navigate(targetPath, true);
                return;
            }
        }
        var state = routeMap.get(V) || {};
        if ((self.views[2] || '').key === state.id) {
            return;
        }
        self.views[2] = null;
        self.abort();
        if (!V || !viewChanged) {
            self.setActive(true);
            self.setPage(app.page);
            return;
        }
        event.waitFor(new Promise(function (resolve) {
            var context = new ViewContext(V, app.page, self.context);
            var rootProps = self.props.rootProps;
            var initElement = executeOnce(function (element) {
                defineOwnProperty(context, 'container', element, true);
                self.currentContext = self.currentContext || context;
            });
            var onLoad = executeOnce(function () {
                var element = context.container;
                var promise = self.unmountView();
                self.unmountView = executeOnce(function () {
                    state.rendered--;
                    self.setActive(false);
                    app.emit('pageleave', element, { pathname: context.page.path, view: V }, true);
                    return animateOut(element, 'show').then(function () {
                        self.views[0] = null;
                        self.forceUpdate();
                    });
                });
                always(promise, delay).then(function () {
                    app.emit('pageenter', element, { pathname: context.page.path, view: V }, true);
                });
                self.views.shift();
                self.currentContext = context;
                extend(self, _(context));
                state.rendered++;
                animateIn(element, 'show', '[brew-view]', true);
                resolve();
            });
            context.on('error', function () {
                return (self.props.rootProps.onError || noop).apply(this, arguments);
            });
            self.abort = resolve;
            self.views[2] = createElement(StateContext.Provider, { key: state.id, value: context },
                createElement(ViewStateContainer, null,
                    createElement('div', extend(exclude(rootProps, ['loader', 'onError']), { ref: initElement, 'brew-view': '' }),
                        createElement(ErrorBoundary, { onLoad, context, self, loader: rootProps.loader }))));
        }));
    },
    getViewComponent: function () {
        var props = this.props;
        return any(props.views, function (v) {
            return matchViewParams(v, app.route);
        }) || props.defaultView;
    }
});
fill(ViewContainer.prototype, 'abort onRender setActive setPage unmountView', noop);

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
            useLayoutEffect(props.onLoad, []);
            return children;
        }
        var component = useAsync(function () {
            return promise.then(null, function (error) {
                promise = null;
                props.onError(error);
            });
        })[0];
        if (component) {
            props.onLoad();
        }
        return component ? createElement(component.default, props.viewProps) : (props.self.currentContext === props.context && props.loader) || null;
    };
}

export function useViewContext() {
    return useContext(StateContext);
}

export function isViewMatched(view) {
    var route = app.route;
    return matchViewParams(view, route) && resolvePath(view, route) === route.toString();
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
    errorView = throwNotFunction(factory);
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
