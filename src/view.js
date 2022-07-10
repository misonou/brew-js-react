import React, { useRef } from "react";
import { useAsync } from "zeta-dom-react";
import dom from "./include/zeta-dom/dom.js";
import { notifyAsync } from "./include/zeta-dom/domLock.js";
import { any, defineGetterProperty, definePrototype, each, either, extend, grep, isFunction, keys, makeArray, map, noop, pick, randomId, setImmediate, single } from "./include/zeta-dom/util.js";
import { animateIn, animateOut } from "./include/brew-js/anim.js";
import { app } from "./app.js";
import { ViewStateContainer } from "./hooks.js";

const root = dom.root;
const routeMap = new Map();
const usedParams = {};
const StateContext = React.createContext(Object.freeze({ active: true }));

let stateId;

function ViewContainer() {
    /** @type {any} */
    var self = this;
    React.Component.apply(self, arguments);
    self.mounted = false;
    if (!stateId) {
        stateId = history.state;
        app.on('navigate', function () {
            stateId = history.state;
        });
    }
    self.componentWillUnmount = app.on('navigate', function () {
        if (self.mounted && self.getViewComponent()) {
            self.isForceUpdate = true;
            self.forceUpdate();
        }
    });
}

definePrototype(ViewContainer, React.Component, {
    componentDidMount: function () {
        this.mounted = true;
    },
    componentDidCatch: function (error) {
        dom.emit('error', this.parentElement || root, { error }, true);
    },
    render: function () {
        /** @type {any} */
        var self = this;
        var resolve;
        var promise = new Promise(function (_resolve) {
            resolve = _resolve;
        });
        var V = self.getViewComponent();
        if (V && V !== self.currentViewComponent) {
            self.currentViewComponent = V;
            if (self.currentView && self.currentElement) {
                var prevPath = self.currentPath;
                var prevElement = self.currentElement;
                self.prevView = self.currentView;
                self.currentElement = undefined;
                app.emit('pageleave', prevElement, { pathname: prevPath }, true);
                animateOut(prevElement, 'show').then(function () {
                    self.prevView = undefined;
                    self.forceUpdate();
                });
            }
            var providerProps = {
                key: routeMap.get(V).id,
                value: {}
            };
            var view = React.createElement(StateContext.Provider, providerProps,
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
            defineGetterProperty(providerProps.value, 'active', function () {
                return self.currentView === view;
            });
            self.currentPath = app.path;
            self.currentView = view;
        } else {
            if (self.isForceUpdate) {
                self.isForceUpdate = false;
                app.emit('pageenter', self.currentElement, { pathname: app.path }, true);
            }
            resolve();
        }
        notifyAsync(self.parentElement || root, promise);
        return React.createElement(React.Fragment, null, self.prevView, self.currentView);
    },
    getViewComponent: function () {
        var props = this.props;
        var matched = any(props.views, isViewMatched) || props.defaultView;
        if (history.state === stateId) {
            // ensure the current path actually corresponds to the matched view
            // when some views are not included in the list of allowed views
            var targetPath = linkTo(matched, getCurrentParams(matched, true));
            if (targetPath !== app.path) {
                app.navigate(targetPath, true);
                return;
            }
        }
        return matched;
    }
});

function getCurrentParams(view, includeAll) {
    var state = routeMap.get(view);
    if (!state.maxParams) {
        var matched = map(app.routes, function (v) {
            var route = app.parseRoute(v);
            var matched = route.length && !any(state.matchers, function (v, i) {
                var pos = route.params[i];
                return (v ? !(pos >= 0) : pos < route.minLength) || (!isFunction(v) && !route.match(i, v));
            });
            return matched ? route : null;
        });
        if (matched[1]) {
            matched = grep(matched, function (v) {
                return !single(v.params, function (v, i) {
                    return usedParams[i] && !state.matchers[i];
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
    return pick(app.route, includeAll ? state.maxParams : state.minParams);
}

export function useViewContainerState() {
    return React.useContext(StateContext);
}

export function isViewMatched(view) {
    var params = routeMap.get(view);
    return !!params && false === any(params.matchers, function (v, i) {
        var value = app.route[i] || '';
        return isFunction(v) ? !v(value) : (v || '') !== value;
    });
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
    return Component;
}

export function renderView() {
    var views = makeArray(arguments);
    var rootProps = isFunction(views[0]) ? {} : views.shift();
    var defaultView = views[0];
    views.sort(function (a, b) {
        return (routeMap.get(b) || {}).matchCount - (routeMap.get(a) || {}).matchCount;
    });
    return React.createElement(ViewContainer, { rootProps, views, defaultView });
}

export function linkTo(view, params) {
    var state = routeMap.get(view);
    if (!state) {
        return '/';
    }
    var newParams = extend(getCurrentParams(view), params, state.params);
    return app.route.getPath(newParams);
}

export function navigateTo(view, params) {
    return app.navigate(linkTo(view, params));
}

export function redirectTo(view, params) {
    return app.navigate(linkTo(view, params), true);
}
