import React, { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { addAnimateOut } from "brew-js/anim";
import { useRouteParam, useRouteState, ViewStateContainer } from "src/hooks";
import { registerView, renderView } from "src/view";
import { cleanup, delay, mockFn } from "@misonou/test-utils";
import { useUpdateTrigger, useViewState } from "zeta-dom-react";
import initAppBeforeAll, { waitForPageLoad } from "./harness/initAppBeforeAll";
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

    it('should redirect to path determined by parent view container', async () => {
        const View = registerView(function () {
            useRouteParam('sub', 'bar');
            return (<>foo</>);
        }, { view: 'foo' });
        const { unmount } = render(<div>{renderView(View)}</div>);
        await waitForPageLoad();
        expect(app.path).toBe('/foo/bar');
        unmount();
    });

    it('should not redirect when the parent view is going to unmount', async () => {
        const Foo = registerView(async () => {
            return {
                default: ({ viewContext }) => {
                    const update = useUpdateTrigger();
                    useRouteParam('sub', 'baz');
                    useEffect(() => {
                        addAnimateOut('animate-out-e3vpv', () => delay(100));
                        return app.on(viewContext.container, 'pageleave', update);
                    }, []);
                    return (<div animate-out="" animate-out-e3vpv="">foo</div>);
                }
            }
        }, { view: 'foo' });
        const Bar = registerView(async () => {
            return {
                default: () => {
                    return (<div>bar</div>);
                }
            }
        }, { view: 'bar' });
        const { unmount } = render(<div>{renderView(Foo, Bar)}</div>);
        await waitForPageLoad();

        await expect(app.navigate('/bar')).resolves.toMatchObject({
            path: '/bar',
            redirected: false
        });
        unmount();
    });

    it('should return previous value when the parent view is going to unmount', async () => {
        const cb = mockFn();
        const Foo = registerView(async () => {
            return {
                default: ({ viewContext }) => {
                    const update = useUpdateTrigger();
                    cb(useRouteParam('sub', 'baz'));
                    useEffect(() => {
                        addAnimateOut('animate-out-gujno', () => delay(100));
                        return app.on(viewContext.container, 'pageleave', update);
                    }, []);
                    return (<div animate-out="" animate-out-gujno="">foo</div>);
                }
            }
        }, { view: 'foo' });
        const Bar = registerView(async () => {
            return {
                default: () => {
                    return (<div>bar</div>);
                }
            }
        }, { view: 'bar' });
        const { unmount } = render(<div>{renderView(Foo, Bar)}</div>);
        await waitForPageLoad();

        await app.navigate('/bar');
        expect(cb).lastCalledWith('baz');
        unmount();
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
        await delay();
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
                    React.useEffect(() => () => cb('foo unmount'), []);
                    React.useEffect(() => cb(value), [value]);
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
                    React.useEffect(() => () => cb('bar unmount'), []);
                    React.useEffect(() => cb(value), [value]);
                    return (<div>{value}</div>);
                }
            }
        }, { view: 'bar' });
        await app.navigate('/foo');

        const { unmount } = render(<div>{renderView(Foo, Bar)}</div>)
        await screen.findByText('foo1');
        expect(cb.mock.calls).toEqual([
            ['foo'],
            ['foo1']
        ]);

        cb.mockClear();
        await app.navigate('/bar');
        await screen.findByText('bar1');
        try {
            expect(cb.mock.calls).toEqual([
                ['bar'],
                ['foo unmount'],
                ['bar1']
            ]);
        } catch {
            expect(cb.mock.calls).toEqual([
                ['foo unmount'],
                ['bar'],
                ['bar1']
            ]);
        }

        cb.mockClear();
        await app.back();
        await screen.findByText('foo1');
        try {
            expect(cb.mock.calls).toEqual([
                ['foo1'],
                ['bar unmount'],
            ]);
        } catch {
            expect(cb.mock.calls).toEqual([
                ['bar unmount'],
                ['foo1']
            ]);
        }
        unmount();
    });
});

describe('ViewStateContainer', () => {
    it('should bring current value to new state', async () => {
        const cb = mockFn();
        const Component = function () {
            const state = useViewState('foo');
            useEffect(() => {
                state.set('foo');
            }, [state]);
            cb(state.get());
            return (<div>{state.get()}</div>);
        };
        const { rerender } = render(<Component />, { wrapper: ViewStateContainer });

        cb.mockClear();
        await app.navigate('/foo');
        rerender(<Component />);
        expect(cb).toBeCalledWith('foo');
    });

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
        expect(cb).not.toBeCalled();

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
