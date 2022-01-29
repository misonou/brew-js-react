import { useObservableProperty } from "zeta-dom-react";
import waterpipe from "./include/external/waterpipe.js"
import { extend, makeArray, single } from "./include/zeta-dom/util.js";
import { app } from "./app.js";

const empty = Object.create(null);

export function useLanguage() {
    return useObservableProperty(app, 'language');
}

export function makeTranslation(resources, defaultLang) {
    const re = new RegExp('^(' + Object.keys(resources[defaultLang]).join('|') + ')\\.');
    const cache = {};

    function getTranslation(prefix, name, data) {
        var str = ((resources[app.language] || empty)[prefix] || empty)[name] || ((resources[defaultLang] || empty)[prefix] || empty)[name] || '';
        return str && data !== undefined ? waterpipe(str, data) : str;
    }

    function createCallback(translate) {
        return extend(translate, {
            html: function (id, data) {
                return { __html: translate(id, data) };
            }
        });
    }

    function translate(key, data) {
        var prefix = re.test(key) ? RegExp.$1 : '';
        var name = prefix ? key.slice(RegExp.lastMatch.length) : key;
        return getTranslation(prefix, name, data) || key;
    }

    function useTranslation() {
        var prefix = makeArray(arguments);
        var language = useLanguage();
        var t = translate;
        if (prefix[0]) {
            var key = prefix.join(' ');
            t = cache[key] || (cache[key] = createCallback(function (key, data) {
                return single(prefix, function (v) {
                    return getTranslation(v, key, data);
                }) || key;
            }));
        }
        return { language, t };
    }

    return {
        translate: createCallback(translate),
        useTranslation
    };
}
