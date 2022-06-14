import { createElement, useEffect, useRef, useState } from "react";
import { ViewStateProvider } from "zeta-dom-react";
import { extend, kv, setImmediateOnce } from "./include/zeta-dom/util.js";
import { app } from "./app.js";
import { useViewContainerState } from "./view.js";

const states = {};

function getCurrentStates() {
    return states[history.state] || (states[history.state] = {});
}

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
            if (container.active && current !== ref.current) {
                ref.current = current;
                forceUpdate({});
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
    if (!value && defaultValue !== undefined) {
        app.navigate(route.getPath(extend({}, route, kv(name, defaultValue))), true);
    }
    return value;
}

export function useRouteState(key, defaultValue) {
    const container = useViewContainerState();
    const cur = getCurrentStates();
    const state = useState(key in cur ? cur[key] : defaultValue);
    if (container.active) {
        cur[key] = state[0];
    }
    return state;
}

export function ViewStateContainer(props) {
    const container = useViewContainerState();
    const provider = useState(function () {
        const cache = {};
        return {
            getState: function (uniqueId, key) {
                var cur = getCurrentStates();
                var state = cache[uniqueId] || (cache[uniqueId] = {
                    value: cur[key] && cur[key].value,
                    get: function () {
                        return state.value;
                    },
                    set: function (value) {
                        state.value = value;
                    }
                });
                if (container.active) {
                    cur[key] = state;
                }
                return state;
            }
        };
    })[0];
    return createElement(ViewStateProvider, { value: provider }, props.children);
}
