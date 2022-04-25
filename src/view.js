import React from "react";
import { useAsync } from "zeta-dom-react";
import { any, definePrototype, each, exclude, extend, isFunction, keys, makeArray, noop, pick, setImmediate } from "./include/zeta-dom/util.js";
import { animateIn, animateOut } from "./include/brew-js/anim.js";
import { app } from "./app.js";

const routeMap = new Map();

function ViewContainer() {
    /** @type {any} */
    var self = this;
    React.Component.apply(self, arguments);
    self.mounted = false;
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
            self.currentView = React.createElement(V, {
                key: app.route.view,
                rootProps: self.props.rootProps,
                onComponentLoaded: function (element) {
                    self.currentElement = element;
                    setImmediate(function () {
                        return animateIn(element, 'show');
                    });
                }
            });
        }
        return React.createElement(React.Fragment, null, self.prevView, self.currentView);
    },
    getViewComponent: function () {
        var props = this.props;
        return any(props.views, isViewMatched) || void redirectTo(props.defaultView);
    }
});

export function isViewMatched(view) {
    var params = routeMap.get(view);
    return !!params && !any(params.matchers, function (v, i) {
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
        if (v instanceof RegExp) {
            routeParams[i] = v.test.bind(v);
        }
    });
    routeMap.set(Component, {
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
    return app.route.getPath(extend({}, app.route, params, (routeMap.get(view) || {}).params));
}

export function navigateTo(view, params) {
    return app.navigate(linkTo(view, params));
}

export function redirectTo(view, params) {
    return app.navigate(linkTo(view, params), true);
}
