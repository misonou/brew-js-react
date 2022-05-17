import React from "react";
import { useAsync } from "zeta-dom-react";
import dom from "./include/zeta-dom/dom.js";
import { any, defineGetterProperty, definePrototype, each, extend, isFunction, keys, makeArray, noop, pick, randomId, setImmediate } from "./include/zeta-dom/util.js";
import { animateIn, animateOut } from "./include/brew-js/anim.js";
import { app } from "./app.js";
import { ViewStateContainer } from "./hooks.js";

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
            self.forceUpdate();
        }
    });
}

definePrototype(ViewContainer, React.Component, {
    componentDidMount: function () {
        this.mounted = true;
    },
    componentDidCatch: function (error) {
        dom.emit('error', this.parentElement || dom.root, { error }, true);
    },
    render: function () {
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
                                return animateIn(element, 'show');
                            });
                        }
                    })));
            defineGetterProperty(providerProps.value, 'active', function () {
                return self.currentView === view;
            });
            self.currentView = view;
        }
        return React.createElement(React.Fragment, null, self.prevView, self.currentView);
    },
    getViewComponent: function () {
        var props = this.props;
        return any(props.views, isViewMatched) || (history.state === stateId && void redirectTo(props.defaultView));
    }
});

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
        var Component = useAsync(factory)[0];
        return React.createElement('div', extend({}, props.rootProps, {
            ref: function (element) {
                if (element && Component) {
                    (props.onComponentLoaded || noop)(element);
                }
            },
            children: Component && React.createElement(Component.default)
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
    var viewParams = (routeMap.get(view) || {}).params;
    var newParams = {};
    for (var i in app.route) {
        if (viewParams && i in viewParams) {
            newParams[i] = viewParams[i];
        } else if (params && i in params) {
            newParams[i] = params[i];
        } else if (!usedParams[i]) {
            newParams[i] = app.route[i];
        }
    }
    return app.route.getPath(newParams);
}

export function navigateTo(view, params) {
    return app.navigate(linkTo(view, params));
}

export function redirectTo(view, params) {
    return app.navigate(linkTo(view, params), true);
}
