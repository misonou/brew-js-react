import React from "react";
import { render, screen } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useRouteParam, useRouteState } from "src/hooks";
import { registerView, renderView } from "src/view";
import { defunctAfterTest, initApp, mockFn } from "./testUtil";

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

    it('should cause component to re-render after navigate event', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useRouteParam('view'));
        const cb = mockFn();
        defunctAfterTest(app.on('navigate', cb));

        app.route.view = 'foo';
        expect(result.all.length).toBe(1);

        await waitForNextUpdate();
        expect(cb).toBeCalledTimes(1);
    });

    it('should not cause component to re-render when the parent view is going to unmount', async () => {
        const cb = mockFn();
        const Foo = registerView(async () => {
            return {
                default: () => {
                    cb();
                    useRouteParam('view');
                    return (<div>foo</div>);
                }
            }
        }, { view: 'foo' });
        const Bar = registerView(async () => {
            return {
                default: () => {
                    useRouteParam('view');
                    return (<div>bar</div>);
                }
            }
        }, { view: 'bar' });

        const { unmount } = render(<div>{renderView(Foo, Bar)}</div>)
        await app.navigate('/foo');
        await screen.findByText('foo');
        expect(cb).toBeCalledTimes(1);

        await app.navigate('/bar');
        expect(cb).toBeCalledTimes(1);
        unmount();
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
