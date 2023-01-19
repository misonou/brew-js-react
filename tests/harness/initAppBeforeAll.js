import brew from "brew-js/core";
import Router from "brew-js/extension/router";
import I18n from "brew-js/extension/i18n";

/**
 * @param {(app: Brew.AppInstance<Brew.WithI18n & Brew.WithRouter>) => void} callback
 */
export default function initAppBeforeAll(callback) {
    const app = brew.with(Router, I18n)(callback);
    beforeAll(() => app.ready);
    return app;
}
