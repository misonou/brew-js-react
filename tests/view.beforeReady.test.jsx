import React from "react";
import brew from "brew-js/core";
import router from "brew-js/extension/router";
import { createObjectStorage } from "brew-js/util/storage";
import { render } from "@testing-library/react";
import { randomId, watchOnce } from "zeta-dom/util";
import { registerView, renderView } from "src/view";

beforeAll(async () => {
    var sessionId = randomId();
    var stateId = randomId();
    var store = createObjectStorage(sessionStorage, 'brew.router./');
    store.set('g', {});
    store.set('c', stateId);
    store.set('s', [
        [stateId, '/bar', 1, false, null, sessionId],
    ]);
    store.set(sessionId, { bar: 'bar' });
    history.replaceState(stateId, '');
});

describe('renderView', () => {
    it('should not cause navigation before app ready', async () => {
        const app = brew.with(router)(app => {
            app.useRouter({
                routes: [
                    '/{view}',
                    '/*'
                ]
            });
        });
        const Foo = registerView(() => <div>foo</div>, { view: 'foo' });
        const Bar = registerView(() => <div>bar</div>, { view: 'bar' });
        render(<div>{renderView(Foo, Bar)}</div>);
        await expect(watchOnce(app, 'path')).resolves.toBe('/bar');
    });
});
