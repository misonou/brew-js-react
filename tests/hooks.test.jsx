import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useRouteParam } from "src/hooks";
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
