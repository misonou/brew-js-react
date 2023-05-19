import { createElement, useEffect, useRef, useState } from "react";
import { ViewStateProvider } from "zeta-dom-react";
import { definePrototype, extend, kv, setImmediateOnce, throwNotFunction, watch } from "./include/zeta-dom/util.js";
import { bind } from "./include/zeta-dom/domUtil.js";
import { ZetaEventContainer } from "./include/zeta-dom/events.js";
import { app } from "./app.js";
import { useViewContainerState } from "./view.js";

const emitter = new ZetaEventContainer();

function getCurrentStates() {
    return app.historyStorage.current;
}

function ViewState(key, value) {
    this.key = key;
    this.value = value;
}

definePrototype(ViewState, {
    get: function () {
        return this.value;
    },
    set: function (value) {
        var self = this;
        self.value = value;
        self.store.set(self.key, value);
    },
    onPopState: function (callback) {
        throwNotFunction(callback);
        return emitter.add(this, 'popstate', function (e) {
            callback.call(this, e.newValue);
        });
    }
});

export function useAppReady() {
    const sReady = useState(false);
    const ready = sReady[0], setReady = sReady[1];
    useEffect(function () {
        app.ready.then(function () {
            setReady(true);
        });
    }, []);
    return ready;
}

export function useRouteParam(name, defaultValue) {
    const container = useViewContainerState();
    const route = app.route;
    const value = route[name] || '';
    const ref = useRef(value);
    const forceUpdate = useState()[1];
    useEffect(function () {
        var setValue = function () {
            var current = route[name] || '';
            if (current !== ref.current) {
                if (container.active) {
                    ref.current = current;
                    forceUpdate({});
                } else {
                    watch(container, 'active', setValue);
                }
            }
        };
        // route parameter might be changed after state initialization and before useEffect hook is called
        setValue();
        if (name in route) {
            return route.watch(name, function () {
                setImmediateOnce(setValue);
            });
        }
        console.error('Route parameter ' + name + ' does not exist');
    }, [name, defaultValue]);
    ref.current = value;
    if (defaultValue !== undefined && (!value || (name === 'remainingSegments' && value === '/'))) {
        app.navigate(route.getPath(extend({}, route, kv(name, defaultValue))), true);
    }
    return value;
}

export function useRouteState(key, defaultValue, snapshotOnUpdate) {
    var container = useViewContainerState();
    var cur = getCurrentStates();
    var state = useState(cur.has(key) ? cur.get(key) : defaultValue);
    if (container.active && cur.get(key) !== state[0]) {
        if (snapshotOnUpdate && cur.has(key)) {
            app.snapshot();
            cur = getCurrentStates();
        }
        cur.set(key, state[0]);
    }
    useEffect(function () {
        if (snapshotOnUpdate) {
            return bind(window, 'popstate', function () {
                if (container.active) {
                    var cur = getCurrentStates();
                    state[1](cur.has(key) ? cur.get(key) : defaultValue);
                }
            });
        }
    }, [container, snapshotOnUpdate]);
    return state;
}

export function ViewStateContainer(props) {
    const container = useViewContainerState();
    const provider = useState(function () {
        const cache = {};
        return {
            getState: function (uniqueId, key) {
                var cur = getCurrentStates();
                var value = cur.get(key);
                var state = cache[uniqueId] || (cache[uniqueId] = new ViewState(key, value));
                if (container.active) {
                    var store = state.store;
                    if (store && ((store !== cur && cur.has(key)) || key !== state.key)) {
                        emitter.emit('popstate', state, {
                            newValue: value
                        });
                        state.value = value;
                        state.key = key;
                    }
                    state.store = cur;
                    cur.set(key, state.value);
                }
                return state;
            }
        };
    })[0];
    return createElement(ViewStateProvider, { value: provider }, props.children);
}
