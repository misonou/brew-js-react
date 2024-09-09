import { combineFn, throwNotFunction } from "zeta-dom/util";
import { install } from "brew-js/app";
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

install('react', function (app_) {
    // @ts-ignore: type inference issue
    app = app_;
    combineFn(appInitCallabcks)(app);
});

defaults.react = true;
