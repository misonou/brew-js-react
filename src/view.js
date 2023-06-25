import React from "react";
import { useAsync } from "zeta-dom-react";
import dom from "./include/zeta-dom/dom.js";
import { notifyAsync } from "./include/zeta-dom/domLock.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import { any, combineFn, defineObservableProperty, defineOwnProperty, definePrototype, each, exclude, executeOnce, extend, freeze, grep, isFunction, isThenable, isUndefinedOrNull, keys, makeArray, map, noop, pick, randomId, setImmediate, single, throwNotFunction, watch } from "./include/zeta-dom/util.js";
import { animateIn, animateOut } from "./include/brew-js/anim.js";
import { removeQueryAndHash } from "./include/brew-js/util/path.js";
import { app, onAppInit } from "./app.js";
import { ViewStateContainer } from "./hooks.js";

const root = dom.root;
const routeMap = new Map();
const usedParams = {};
const sortedViews = [];
const emitter = new ZetaEventContainer();
const rootContext = Object.freeze({ container: root, active: true });
const StateContext = React.createContext(rootContext);

var errorView;
/** @type {Partial<Zeta.ZetaEventType<"beforepageload", Brew.RouterEventMap, Element>>} */
var event = {};

onAppInit(function () {
    app.on('beforepageload', function (e) {
        event = e;
    });
});

function ViewContext(view) {
    defineOwnProperty(this, 'view', view, true);
}

definePrototype(ViewContext, {
    on: function (event, handler) {
        return emitter.add(this, event, handler);
    }
});

function ErrorBoundary() {
    React.Component.apply(this, arguments);
    this.state = {};
}
ErrorBoundary.contextType = StateContext;

definePrototype(ErrorBoundary, React.Component, {
    componentDidCatch: function (error) {
        var self = this;
        if (errorView && !self.state.error) {
            self.setState({ error });
        } else {
            // emit error in next tick as ref callback may yet to be invoked
            // if error is thrown synchronously in first render
            setImmediate(function () {
                dom.emit('error', self.context.container, { error }, true);
            });
        }
    },
    render: function () {
        var self = this;
        var props = {
            view: self.context.view,
            error: self.state.error,
            reset: self.reset.bind(self)
        };
        var onComponentLoaded = self.props.onComponentLoaded;
        if (props.error) {
            return React.createElement(errorView, { onComponentLoaded, viewProps: props });
        }
        return React.createElement(props.view, { onComponentLoaded, viewProps: self.props.viewProps });
    },
    reset: function () {
        this.setState({ error: null });
    }
});

function ViewContainer() {
    React.Component.apply(this, arguments);
    this.stateId = history.state;
}
ViewContainer.contextType = StateContext;

definePrototype(ViewContainer, React.Component, {
    componentDidMount: function () {
        /** @type {any} */
        var self = this;
        self.componentWillUnmount = combineFn(
            watch(app.route, function () {
                self.setActive(self.getViewComponent() === self.currentViewComponent);
            }),
            app.on('beforepageload', function () {
                self.stateId = history.state;
                if (self.context === rootContext) {
                    self.updateView();
                    self.forceUpdate();
                }
            })
        );
    },
    render: function () {
        /** @type {any} */
        var self = this;
        if (history.state === self.stateId && self.context.active) {
            self.updateView();
        }
        return React.createElement(React.Fragment, null, self.prevView, self.currentView);
    },
    updateView: function () {
        var self = this;
        var V = self.getViewComponent();
        if (V) {
            // ensure the current path actually corresponds to the matched view
            // when some views are not included in the list of allowed views
            var targetPath = resolvePath(V, getCurrentParams(V, true));
            if (targetPath !== removeQueryAndHash(app.path)) {
                app.navigate(targetPath, true);
            }
        }
        if (V && V !== self.currentViewComponent) {
            var prevElement = self.currentElement;
            if (prevElement) {
                self.setActive(false);
                self.prevView = self.currentView;
                self.currentElement = undefined;
                app.emit('pageleave', prevElement, { pathname: self.currentPath }, true);
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
                    animateIn(element, 'show');
                    app.emit('pageenter', element, { pathname: app.path }, true);
                });
                notifyAsync(element, promise);
            });
            var state = new ViewContext(V);
            var viewProps = freeze({
                navigationType: event.navigationType,
                viewContext: state,
                viewData: event.data || {}
            });
            var view = React.createElement(StateContext.Provider, { key: routeMap.get(V).id, value: state },
                React.createElement(ViewStateContainer, null,
                    React.createElement('div', extend({}, self.props.rootProps, { ref: initElement }),
                        React.createElement(ErrorBoundary, { onComponentLoaded, viewProps }))));
            extend(self, {
                cancelPrevious: onComponentLoaded,
                currentPath: app.path,
                currentView: view,
                currentViewComponent: V,
                setPage: defineObservableProperty(state, 'page', app.page, true),
                setActive: defineObservableProperty(state, 'active', true, true)
            });
            watch(state, 'page', function (page, previousPage) {
                emitter.emit('pagechange', state, { previousPage });
            });
            (event.waitFor || noop)(promise);
        }
        (self.setPage || noop)(app.page);
    },
    getViewComponent: function () {
        var props = this.props;
        return any(props.views, isViewMatched) || props.defaultView;
    }
});

function getCurrentParams(view, includeAll, params) {
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
    return pick(params || app.route, includeAll ? state.maxParams : state.minParams);
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
    if (factory.prototype instanceof React.Component) {
        factory = React.createElement.bind(null, factory);
    }
    return function fn(props) {
        var viewProps = props.viewProps;
        var children = !promise && factory(viewProps);
        if (isThenable(children)) {
            promise = children;
            children = null;
        }
        var state = useAsync(function () {
            return promise.then(function (s) {
                return React.createElement(s.default, viewProps);
            });
        }, !!promise)[1];
        if (!promise || !state.loading) {
            props.onComponentLoaded();
            if (state.error) {
                throw state.error;
            }
        }
        return children || state.value || React.createElement(React.Fragment);
    };
}

export function useViewContext() {
    return React.useContext(StateContext);
}

export function isViewMatched(view) {
    return matchViewParams(view, app.route);
}

export function matchView(path, views) {
    var route = app.route;
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
    return React.createElement(ViewContainer, { rootProps, views, defaultView });
}

export function resolvePath(view, params) {
    var state = routeMap.get(view);
    if (!state) {
        return '/';
    }
    var newParams = extend(getCurrentParams(view), getCurrentParams(view, true, params || {}), state.params);
    return app.route.getPath(newParams);
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
