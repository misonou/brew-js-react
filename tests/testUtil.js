import { jest } from "@jest/globals";
import brew from "brew-js/core";
import { app } from "brew-js/app";
import router from "brew-js/extension/router";
import i18n from "brew-js/extension/i18n";
import { } from 'regenerator-runtime/runtime';
import { noop } from "zeta-dom/util";

const consoleGroupCollapsed = console.groupCollapsed;
const consoleWarn = console.warn;
const consoleLog = console.log;
const consoleError = console.error;

var cleanup = [];

export const root = document.documentElement;
export const body = document.body;
export const mockFn = jest.fn;
export const _ = expect.anything();

export function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds || 10);
    });
}

export async function after(callback) {
    callback();
    await delay();
}

export function initApp(callback) {
    brew.with(router, i18n)(callback || noop);
    return app.ready;
}

export function defunctAfterTest(callback) {
    var enabled = true;
    cleanup.push(() => {
        enabled = false;
    });
    return function (...args) {
        if (enabled) {
            return callback(...args);
        }
    };
}

export function verifyCalls(cb, args) {
    expect(cb).toBeCalledTimes(args.length);
    args.forEach((v, i) => {
        expect(cb).toHaveBeenNthCalledWith(i + 1, ...v);
    });
}

beforeAll(() => {
    console.groupCollapsed = mockFn();
    console.log = mockFn();
    console.warn = mockFn();
    console.error = mockFn();
});
afterAll(() => {
    console.groupCollapsed = consoleGroupCollapsed;
    console.log = consoleLog;
    console.warn = consoleWarn;
    console.error = consoleError;
});

afterEach(() => {
    cleanup.splice(0).forEach(v => v());
});
