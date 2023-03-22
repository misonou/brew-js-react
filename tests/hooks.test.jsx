import React, { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useRouteParam, useRouteState, ViewStateContainer } from "src/hooks";
import { registerView, renderView } from "src/view";
import { cleanup, mockFn } from "@misonou/test-utils";
import { useViewState } from "zeta-dom-react";
import initAppBeforeAll from "./harness/initAppBeforeAll";
import composeAct from "./harness/composeAct";

const { actAwaitSetImmediate } = composeAct(act);

const app = initAppBeforeAll(app => {
    app.useRouter({
        baseUrl: '/',
        routes: [
            '/{view}/{sub?}/*',
            '/*'
        ]
    });
});

beforeEach(async () => {
    await app.navigate(app.initialPath);
});

describe('useRouteParam', () => {
    it('should not throw for inexist route parameter', () => {
        expect(() => renderHook(() => useRouteParam('xxx'))).not.toThrow();
    });

    it('should redirect to path with default route parameter value', async () => {
        const { result } = renderHook(() => useRouteParam('view', 'foo'));
        expect(result.current).toBe('');

        await act(async () => void await app.watchOnce('path'));
        expect(result.current).toBe('foo');
        expect(app.path).toBe('/foo');
    });

    it('should redirect to path with default remainingSegments parameter value', async () => {
        await app.navigate('/view/sub');

        const { result } = renderHook(() => useRouteParam('remainingSegments', '/foo'));
        expect(result.current).toBe('/');

        await act(async () => void await app.watchOnce('path'));
        expect(result.current).toBe('/foo');
        expect(app.path).toBe('/view/sub/foo');
    });

    it('should cause component to re-render after navigate event', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useRouteParam('view'));
        const cb = mockFn();
        cleanup(app.on('navigate', cb));

        app.route.view = 'foo';
        expect(result.all.length).toBe(1);

        await waitForNextUpdate();
        expect(cb).toBeCalledTimes(1);
    });

    it('should cause component to re-render exactly once when multiple parameter changed', async () => {
        const { result, waitForNextUpdate } = renderHook(() => [useRouteParam('view'), useRouteParam('sub')]);
        expect(result.all.length).toBe(1);

        app.navigate('/foo/bar');
        await waitForNextUpdate();
        expect(result.all.length).toBe(2);
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
        act(() => result.current[1]('bar'));

        await app.navigate('/foo');
        unmount();

        await app.back();
        const { result: result2 } = renderHook(() => useRouteState('view', 'foo'));
        expect(result2.current[0]).toEqual('bar');
    });

    it('should snapshot upon value changing if snapshotOnUpdate is true', async () => {
        const sym = Symbol();
        const stateId = history.state;
        const { result, unmount } = renderHook(() => useRouteState(sym, 'foo', true));

        await actAwaitSetImmediate(() => result.current[1]('bar'));
        expect(history.state).not.toBe(stateId);
        unmount();
    });

    it('should retain previous state when navigated back if snapshotOnUpdate is true', async () => {
        const sym = Symbol();
        const stateId = history.state;
        const { result, unmount } = renderHook(() => useRouteState(sym, 'foo', true));

        await actAwaitSetImmediate(() => result.current[1]('bar'));
        expect(history.state).not.toBe(stateId);

        await act(async () => void await app.back());
        expect(history.state).toBe(stateId);
        expect(result.current[0]).toBe('foo');
        unmount();
    });

    it('should accept symbol as key', async () => {
        const sym = Symbol();
        const { result, unmount } = renderHook(() => useRouteState(sym, 'foo'));
        act(() => result.current[1]('bar'));

        await app.navigate('/foo');
        unmount();

        await app.back();
        const { result: result2 } = renderHook(() => useRouteState(sym, 'foo'));
        expect(result2.current[0]).toEqual('bar');
    });

    it('should not persist values when component is about to unmount', async () => {
        const cb = mockFn();
        const Foo = registerView(async () => {
            return {
                default: () => {
                    const [value, setValue] = useRouteState('value', 'foo');
                    useRouteParam('view');
                    React.useEffect(() => setValue('foo1'), []);
                    React.useEffect(() => () => cb('foo unmount', history.state), []);
                    cb(value, history.state);
                    return (<div>{value}</div>);
                }
            }
        }, { view: 'foo' });
        const Bar = registerView(async () => {
            return {
                default: () => {
                    const [value, setValue] = useRouteState('value', 'bar');
                    useRouteParam('view');
                    React.useEffect(() => setValue('bar1'), []);
                    React.useEffect(() => () => cb('bar unmount', history.state), []);
                    cb(value, history.state);
                    return (<div>{value}</div>);
                }
            }
        }, { view: 'bar' });

        const { unmount } = render(<div>{renderView(Foo, Bar)}</div>)
        const { id: stateId1 } = await app.navigate('/foo');
        await screen.findByText('foo1');
        expect(cb.mock.calls).toEqual([
            ['foo', stateId1],
            ['foo1', stateId1]
        ]);

        cb.mockClear();
        const { id: stateId2 } = await app.navigate('/bar');
        await screen.findByText('bar1');
        if (process.env.REACT_VERSION === '18') {
            expect(cb.mock.calls).toEqual([
                ['bar', stateId2],
                ['foo unmount', stateId2],
                ['bar1', stateId2]
            ]);
        } else {
            expect(cb.mock.calls).toEqual([
                ['foo unmount', stateId2],
                ['bar', stateId2],
                ['bar1', stateId2]
            ]);
        }

        cb.mockClear();
        await app.back();
        await screen.findByText('foo1');
        if (process.env.REACT_VERSION === '18') {
            expect(cb.mock.calls).toEqual([
                ['foo1', stateId1],
                ['bar unmount', stateId1],
            ]);
        } else {
            expect(cb.mock.calls).toEqual([
                ['bar unmount', stateId1],
                ['foo1', stateId1]
            ]);
        }
        unmount();
    });
});

describe('ViewStateContainer', () => {
    it('should invoke onPopState when traversing through history', async () => {
        const cb = mockFn();
        const Component = function () {
            const state = useViewState('foo');
            useEffect(() => {
                state.set('foo')
                state.onPopState(cb);
            }, [state]);
            return (<div>{state.get()}</div>);
        };
        const { rerender } = render(<Component />, { wrapper: ViewStateContainer });

        await app.navigate('/foo');
        rerender(<Component />);
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0]).toEqual([undefined]);

        cb.mockClear();
        await app.back();
        rerender(<Component />);
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0]).toEqual(['foo']);
    });

    it('should invoke onPopState when key has changed', async () => {
        const cb = mockFn();
        const Component = function ({ stateKey }) {
            const state = useViewState(stateKey);
            useEffect(() => {
                state.set('foo')
                state.onPopState(cb);
            }, [state]);
            return (<div>{state.get()}</div>);
        };
        const { rerender } = render(<Component stateKey="foo" />, { wrapper: ViewStateContainer });

        rerender(<Component stateKey="bar" />);
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0]).toEqual([undefined]);

        cb.mockClear();
        rerender(<Component stateKey="foo" />);
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0]).toEqual(['foo']);
    });
});
