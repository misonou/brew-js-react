import { useEffect, useState } from "react";
import { useObservableProperty } from "zeta-dom-react";
import { extend, kv } from "./include/zeta-dom/util.js";
import { app } from "./app.js";

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

export function useLanguage() {
    return useObservableProperty(app, 'language');
}

export function useRouteParam(name, defaultValue) {
    const sValue = useState(app.route[name]);
    const value = sValue[0], setValue = sValue[1];
    useEffect(function () {
        var current = app.route[name];
        // route parameter might be changed after state initialization and before useEffect hook is called
        setValue(current);
        return app.route.watch(name, setValue);
    }, [name, defaultValue]);
    if (!value && defaultValue !== undefined) {
        app.navigate(app.route.getPath(extend({}, app.route, kv(name, defaultValue))), true);
    }
    return value || '';
}
