import { install } from "./include/brew-js/app.js";
import defaults from "./include/brew-js/defaults.js";

/** @type {Brew.AppInstance<Brew.WithRouter & Brew.WithI18n>} */
export var app;

install('react', function (app_) {
    // @ts-ignore: type inference issue
    app = app_;
});

defaults.react = true;
