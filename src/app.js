import brew from "brew-js";

/** @type {Brew.AppInstance<Brew.WithRouter & Brew.WithI18n>} */
export var app;

brew.install('react', function (app_) {
    // @ts-ignore: type inference issue
    app = app_;
});

brew.defaults.react = true;
