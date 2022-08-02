import React, { useRef } from "react";
import { useAsync } from "zeta-dom-react";
import dom from "./include/zeta-dom/dom.js";
import { notifyAsync } from "./include/zeta-dom/domLock.js";
import { any, combineFn, defineObservableProperty, definePrototype, each, exclude, extend, grep, isFunction, keys, makeArray, map, noop, pick, randomId, setImmediate, single, watch } from "./include/zeta-dom/util.js";
import { animateIn, animateOut } from "./include/brew-js/anim.js";
import { removeQueryAndHash } from "./include/brew-js/util/path.js";
import { app } from "./app.js";
import { ViewStateContainer } from "./hooks.js";

const root = dom.root;
const routeMap = new Map();
const usedParams = {};
const sortedViews = [];
const StateContext = React.createContext(Object.freeze({ active: true }));

function ViewContainer() {
    React.Component.apply(this, arguments);
    this.stateId = history.state;
}

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
                self.forceUpdate();
            })
        );
    },
    componentDidCatch: function (error) {
        dom.emit('error', this.parentElement || root, { error }, true);
    },
    render: function () {
        /** @type {any} */
        var self = this;
        if (history.state !== self.stateId) {
            return self.lastChild || null;
        }
        var V = self.getViewComponent();
        if (V) {
            // ensure the current path actually corresponds to the matched view
            // when some views are not included in the list of allowed views
            var targetPath = linkTo(V, getCurrentParams(V, true));
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
            var resolve;
            var promise = new Promise(function (resolve_) {
                resolve = resolve_;
            });
            var state = { view: V };
            var view = React.createElement(StateContext.Provider, { key: routeMap.get(V).id, value: state },
                React.createElement(ViewStateContainer, null,
                    React.createElement(V, {
                        rootProps: self.props.rootProps,
                        onComponentLoaded: function (element) {
                            self.currentElement = element;
                            self.parentElement = element.parentElement;
                            setImmediate(function () {
                                resolve();
                                animateIn(element, 'show');
                                app.emit('pageenter', element, { pathname: app.path }, true);
                            });
                        }
                    })));
            extend(self, {
                currentPath: app.path,
                currentView: view,
                currentViewComponent: V,
                setActive: defineObservableProperty(state, 'active', true, true)
            });
            notifyAsync(self.parentElement || root, promise);
        }
        var child = React.createElement(React.Fragment, null, self.prevView, self.currentView);
        self.lastChild = child;
        return child;
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
            state.maxParams = keys(extend.apply(0, [{}].concat(matched.map(function (v) {
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

export function useViewContainerState() {
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
    var Component = function (props) {
        var state = useAsync(factory);
        var ref = useRef();
        if (state[0] || state[1].error) {
            (props.onComponentLoaded || noop)(ref.current);
        }
        return React.createElement('div', extend({}, props.rootProps, {
            ref: ref,
            children: state[0] && React.createElement(state[0].default)
        }));
    };
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
            return typeof v === 'string';
        })
    });
    sortedViews.push(Component);
    sortedViews.sort(sortViews);
    return Component;
}

export function renderView() {
    var views = makeArray(arguments);
    var rootProps = isFunction(views[0]) ? {} : views.shift();
    var defaultView = views[0];
    views.sort(sortViews);
    return React.createElement(ViewContainer, { rootProps, views, defaultView });
}

export function linkTo(view, params) {
    var state = routeMap.get(view);
    if (!state) {
        return '/';
    }
    var newParams = extend(getCurrentParams(view), getCurrentParams(view, true, params), state.params);
    return app.route.getPath(newParams);
}

export function navigateTo(view, params) {
    return app.navigate(linkTo(view, params));
}

export function redirectTo(view, params) {
    return app.navigate(linkTo(view, params), true);
}
