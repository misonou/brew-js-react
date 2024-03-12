import { createElement, useEffect, useRef, useState } from "react";
import { ViewStateProvider, useObservableProperty, useUpdateTrigger } from "zeta-dom-react";
import { definePrototype, delay, each, extend, kv, setImmediateOnce, throwNotFunction, watch } from "zeta-dom/util";
import { ZetaEventContainer } from "zeta-dom/events";
import { app } from "./app.js";
import { useViewContext } from "./view.js";

const emitter = new ZetaEventContainer();

function getCurrentStates() {
    return app.historyStorage.current;
}

function ViewState(key, dispose) {
    this.key = key;
    this.store = getCurrentStates();
    this.dispose = dispose;
}

definePrototype(ViewState, {
    get: function () {
        return this.store.get(this.key);
    },
    set: function (value, snapshot) {
        this.store = updatePersistedValue(this.store, this.key, value, snapshot);
    },
    onPopState: function (callback) {
        throwNotFunction(callback);
        return emitter.add(this, 'popstate', function (e) {
            callback.call(this, e.newValue);
        });
    }
});

function updatePersistedValue(cur, key, value, snapshot) {
    if (cur.get(key) !== value) {
        if (snapshot && cur.has(key)) {
            app.snapshot();
            cur = getCurrentStates();
        }
        cur.set(key, value);
    }
    return cur;
}

function updateViewState(state, key, store) {
    var newValue = state.get();
    if (key !== state.key || (store !== state.store && store.has(key))) {
        newValue = store.get(key);
        emitter.emit('popstate', state, { newValue });
    }
    state.key = key;
    state.store = store;
    store.set(key, newValue);
}

function useViewContextWithEffect(callback, deps) {
    const container = useViewContext();
    useEffect(function () {
        return app.on('beforepageload popstate', function () {
            if (container.active) {
                callback(getCurrentStates());
            }
        });
    }, deps);
    return container;
}

export function useAppReady() {
    return useAppReadyState().ready;
}

export function useAppReadyState() {
    const readyState = useObservableProperty(app, 'readyState');
    return {
        ready: readyState === 'ready',
        error: readyState === 'error'
    };
}

export function useRouteParam(name, defaultValue) {
    const container = useViewContext();
    const params = container.page.params;
    const route = app.route;
    const value = params[name] || '';
    const ref = useRef(value);
    const forceUpdate = useUpdateTrigger();
    useEffect(function () {
        var setValue = function () {
            var current = route[name] || '';
            if (current !== ref.current) {
                if (container.active) {
                    ref.current = current;
                    forceUpdate();
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
    if (defaultValue && container.active && (!value || (name === 'remainingSegments' && value === '/'))) {
        app.navigate(route.getPath(extend({}, params, kv(name, defaultValue))), true);
    }
    return value;
}

export function useRouteState(key, defaultValue, snapshotOnUpdate) {
    var cur = getCurrentStates();
    var state = useState(cur && cur.has(key) ? cur.get(key) : defaultValue);
    var container = useViewContextWithEffect(function (cur) {
        state[1](function (oldValue) {
            return cur.has(key) ? cur.get(key) : (cur.set(key, oldValue), oldValue);
        });
    }, [key]);
    if (!cur) {
        // delay app ready to ensure that beforepageload event can be caught
        app.beforeInit(delay(1));
    } else if (container.active) {
        updatePersistedValue(cur, key, state[0], snapshotOnUpdate);
    }
    return state;
}

export function ViewStateContainer(props) {
    const cache = useState({})[0];
    const container = useViewContextWithEffect(function (cur) {
        each(cache, function (i, v) {
            updateViewState(v, v.key, cur);
        });
    }, []);
    const provider = useState(function () {
        return {
            getState: function (uniqueId, key) {
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
    return createElement(ViewStateProvider, { value: provider }, props.children);
}
