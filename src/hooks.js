import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { ViewStateProvider, useMemoizedFunction, useObservableProperty, useValueTrigger } from "zeta-dom-react";
import { catchAsync, definePrototype, delay, each, equal, extend, freeze, isFunction, isPlainObject, keys, kv, mapObject, throwNotFunction } from "zeta-dom/util";
import { ZetaEventContainer } from "zeta-dom/events";
import { getQueryParam, setQueryParam } from "brew-js/util/common";
import { parsePath } from "brew-js/util/path";
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
    const value = params[name] || '';
    const notifyChange = useValueTrigger(value);
    useEffect(function () {
        var setValue = function () {
            notifyChange(container.page.params[name] || '');
        };
        // route parameter might be changed after state initialization and before useEffect hook is called
        setValue();
        return container.on('pagechange', setValue);
    }, [name]);
    if (defaultValue && container.active && (!value || (name === 'remainingSegments' && value === '/'))) {
        app.navigate(app.route.getPath(extend({}, params, kv(name, defaultValue))), true);
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

export function useQueryParam(key, value, snapshotOnUpdate) {
    if (isPlainObject(key)) {
        snapshotOnUpdate = value;
        value = key;
        key = false;
    }
    var container = useViewContext();
    var getParams = function () {
        return freeze(mapObject(key === false ? value : kv(key, value), function (v, i) {
            return getQueryParam(i, app.path) || v || '';
        }));
    };
    var ref = useRef({});
    useMemo(function () {
        ref.current = getParams();
    }, [key]);
    var current = ref.current;
    var notifyChange = useValueTrigger(current, function (current, params) {
        return equal(current, params) || !(ref.current = params);
    });
    var setParams = useMemoizedFunction(function (values) {
        if (key !== false) {
            values = kv(key, isFunction(values) ? values(current[key]) : values);
        } else if (isFunction(values)) {
            values = values(extend({}, current));
        }
        if (container.active) {
            var url = parsePath(app.path);
            var search = keys(values).reduce(function (v, i) {
                return values[i] !== current[i] ? setQueryParam(i, values[i] || null, v) : v;
            }, url.search);
            if (search !== url.search) {
                if (snapshotOnUpdate) {
                    app.snapshot();
                }
                catchAsync(app.navigate((search || '?') + url.hash, true));
                notifyChange(getParams());
            }
        }
    });
    useEffect(function () {
        return app.watch('path', function () {
            if (container.active) {
                notifyChange(getParams());
            }
        });
    }, [key]);
    return [key !== false ? current[key] : current, setParams];
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
