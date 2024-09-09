import { combineFn, throwNotFunction } from "zeta-dom/util";
import { addExtension, install } from "brew-js/app";
import defaults from "brew-js/defaults";

/** @type {Brew.AppInstance<Brew.WithRouter & Brew.WithI18n>} */
export var app;

const appInitCallabcks = [];

export function onAppInit(callback) {
    if (app) {
        callback(app);
    } else {
        appInitCallabcks.push(throwNotFunction(callback));
    }
}

const extension = addExtension(true, 'react2', ['?router', '?i18n'], function (app_) {
    app = app_;
    combineFn(appInitCallabcks)(app);
});

install('react', extension);
defaults.react = true;
