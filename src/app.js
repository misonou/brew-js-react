import { combineFn, throwNotFunction } from "./include/zeta-dom/util.js";
import { install } from "./include/brew-js/app.js";
import defaults from "./include/brew-js/defaults.js";

/** @type {Brew.AppInstance<Brew.WithRouter & Brew.WithI18n>} */
export var app;

const appInitCallabcks = [];

export function onAppInit(callback) {
    appInitCallabcks.push(throwNotFunction(callback));
}

install('react', function (app_) {
    // @ts-ignore: type inference issue
    app = app_;
    combineFn(appInitCallabcks)(app);
});

defaults.react = true;
