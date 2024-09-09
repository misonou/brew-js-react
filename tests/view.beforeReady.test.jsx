import React from "react";
import brew from "brew-js/core";
import router from "brew-js/extension/router";
import { createObjectStorage } from "brew-js/util/storage";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { randomId } from "zeta-dom/util";
import { isViewRendered, registerView, renderView, useViewContext } from "src/view";

var app;

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
    await 0;

    app = brew.with(router)(app => {
        app.useRouter({
            routes: [
                '/{view}',
                '/*'
            ]
        });
        app.beforeInit(() => new Promise(() => { }));
    });
});

describe('ViewContext', () => {
    it('should return page object before app ready', () => {
        const { result } = renderHook(() => useViewContext());
        expect(result.current.active).toBe(false);
        expect(result.current.page).toBe(app.page);
    });
});

describe('renderView', () => {
    it('should not render view before app ready', async () => {
        const Foo = registerView(() => <div>foo</div>, { view: 'foo' });
        const Bar = registerView(() => <div>bar</div>, { view: 'bar' });
        render(<div>{renderView(Foo, Bar)}</div>);
        expect(app.path).toBe('/bar');
        expect(isViewRendered(Bar)).toBe(false);
    });
});
