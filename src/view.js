import React from "react";
import { useAsync } from "zeta-dom-react";
import { any, definePrototype, equal, exclude, extend, keys, makeArray, noop, pick, setImmediate } from "./include/zeta-dom/util.js";
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
                rootProps: exclude(self.props, ['views']),
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
        var views = this.props.views;
        return any(views, isViewMatched) || void redirectTo(views[0]);
    }
});

export function isViewMatched(view) {
    var params = routeMap.get(view);
    return !!params && equal(params, pick(app.route, keys(params)));
}

export function registerView(factory, routeParams) {
    var Component = function (props) {
        var childProps = exclude(props, ['rootProps', 'onComponentLoaded']);
        var Component = useAsync(factory)[0];
        return React.createElement('div', extend({}, props.rootProps, {
            ref: function (element) {
                if (element && Component) {
                    (props.onComponentLoaded || noop)(element);
                }
            },
            children: Component && React.createElement(Component.default, childProps)
        }));
    };
    routeMap.set(Component, routeParams);
    return Component;
}

export function renderView() {
    var views = makeArray(arguments);
    var props;
    if (views[0] && typeof views[0] !== 'function') {
        props = views.shift();
    }
    return React.createElement(ViewContainer, extend({}, props, { views }));
}

export function linkTo(view, params) {
    return app.route.getPath(extend({}, app.route, params, routeMap.get(view)));
}

export function navigateTo(view, params) {
    return app.navigate(linkTo(view, params));
}

export function redirectTo(view, params) {
    return app.navigate(linkTo(view, params), true);
}
