import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useRouteParam, useRouteState } from "src/hooks";
import { initApp } from "./testUtil";

/** @type {Brew.AppInstance<Brew.WithRouter>} */
let app;

beforeAll(async () => {
    app = await initApp(app => {
        app.useRouter({
            baseUrl: '/',
            routes: [
                '/{view}/*',
                '/*'
            ]
        });
    });
});

beforeEach(async () => {
    await app.navigate(app.initialPath);
});

describe('useRouteParam', () => {
    it('should redirect to path with default route parameter value', async () => {
        const { result } = renderHook(() => useRouteParam('view', 'foo'));
        expect(result.current).toBe('');

        await act(async () => void await app.watchOnce('path'));
        expect(result.current).toBe('foo');
        expect(app.path).toBe('/foo');
    });
});

describe('useRouteState', () => {
    it('should retain previous state when navigated back', async () => {
        const { result, unmount } = renderHook(() => useRouteState('view', 'foo'));
        result.current[1]('bar');

        await app.navigate('/foo');
        unmount();

        await app.back();
        const { result: result2 } = renderHook(() => useRouteState('view', 'foo'));
        expect(result2.current[0]).toEqual('bar');
    });

    it('should accept symbol as key', async () => {
        const sym = Symbol();
        const { result, unmount } = renderHook(() => useRouteState(sym, 'foo'));
        result.current[1]('bar');

        await app.navigate('/foo');
        unmount();

        await app.back();
        const { result: result2 } = renderHook(() => useRouteState(sym, 'foo'));
        expect(result2.current[0]).toEqual('bar');
    });
});
