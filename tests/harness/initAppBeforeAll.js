import brew from "brew-js/core";
import Router from "brew-js/extension/router";
import I18n from "brew-js/extension/i18n";
import Scrollable from "brew-js/extension/scrollable";
import { waitFor } from "@testing-library/dom";
import { delay } from "@misonou/test-utils";

let loading = false;

/**
 * @param {(app: Brew.AppInstance<Brew.WithI18n & Brew.WithRouter & Brew.WithScrollable>) => void} callback
 */
export default function initAppBeforeAll(callback) {
    const app = brew.with(Router, I18n, Scrollable)(callback);
    beforeAll(() => app.ready);
    app.on('beforepageload', () => {
        loading = true;
    });
    app.on('pageload', () => {
        loading = false;
    });
    return app;
}

export async function waitForPageLoad() {
    await delay();
    return waitFor(() => {
        if (loading) {
            throw new Error();
        }
    });
}
