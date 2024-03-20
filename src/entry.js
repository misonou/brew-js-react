import { defineGetterProperty } from "zeta-dom/util";

defineGetterProperty(window, 'brew-js-react', function () {
    console.warn('window["brew-js-react"] is deprecated, access brew.react instead.');
    return brew.react;
});

export * from "./index.js";
