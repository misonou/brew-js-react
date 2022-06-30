import { useObservableProperty } from "zeta-dom-react";
import waterpipe from "./include/external/waterpipe.js"
import { extend, keys, makeArray, single } from "./include/zeta-dom/util.js";
import { app } from "./app.js";

const empty = Object.create(null);
const toPrimitive = typeof Symbol === 'function' && Symbol.toPrimitive;

function TString(toString) {
    this.toString = toString;
}

if (toPrimitive) {
    TString.prototype[toPrimitive] = function () {
        return this.toString();
    };
}

function createCallback(translate) {
    var callback = function (key, data) {
        var result = translate(key, data, true);
        return result !== undefined ? result : key;
    };
    return extend(callback, {
        html: function (id, data) {
            return { __html: translate(id, data) };
        },
        lazy: function (id, data) {
            return new TString(translate.bind(0, id, data, true));
        }
    });
}

export function useLanguage() {
    return useObservableProperty(app, 'language');
}

export function makeTranslation(resources, defaultLang) {
    const re = new RegExp('^(' + Object.keys(resources[defaultLang]).join('|') + ')\\.');
    const cache = {};

    function getTranslation(prefix, name, data, noEncode, lang) {
        var str = ((resources[lang] || empty)[prefix] || empty)[name];
        if (typeof str === 'string') {
            if (str && (!noEncode || data !== undefined)) {
                return waterpipe(str, data, { noEncode });
            }
            return str;
        }
        if (lang !== defaultLang) {
            return getTranslation(prefix, name, data, noEncode, defaultLang);
        }
    }

    function translate(key, data, noEncode) {
        var prefix = re.test(key) ? RegExp.$1 : '';
        var name = prefix ? key.slice(RegExp.lastMatch.length) : key;
        return getTranslation(prefix, name, data, noEncode, app.language);
    }

    function getTranslationCallback() {
        var prefix = makeArray(arguments);
        var key = prefix.join(' ');
        return cache[key] || (cache[key] = createCallback(function (key, data, noEncode) {
            var lang = app.language;
            return single(prefix, function (v) {
                return getTranslation(v, key, data, noEncode, lang);
            });
        }));
    }

    function useTranslation() {
        var language = useLanguage();
        var t = getTranslationCallback.apply(0, arguments);
        return { language, t };
    }

    cache[''] = createCallback(translate);
    return {
        translate: cache[''],
        getTranslation: getTranslationCallback,
        useTranslation: useTranslation,
        keys: function (prefix) {
            return keys(resources[defaultLang][prefix] || empty);
        }
    };
}
