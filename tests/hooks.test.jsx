import React, { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { addAnimateOut } from "brew-js/anim";
import { useQueryParam, useRouteParam, useRouteState, ViewStateContainer } from "src/hooks";
import { registerView, renderView } from "src/view";
import { after, cleanup, delay, mockFn } from "@misonou/test-utils";
import { useUpdateTrigger, useViewState } from "zeta-dom-react";
import { catchAsync } from "zeta-dom/util";
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
        const sym = Symbol();
        const stateId = history.state;
        const { result, unmount } = renderHook(() => useRouteState(sym, 'foo'));

        await app.navigate('/foo');
        expect(history.state).not.toBe(stateId);
        act(() => result.current[1]('baz'));

        await act(async () => void await app.back());
        await delay();
        expect(history.state).toBe(stateId);
        expect(result.current[0]).toBe('foo');

        history.forward();
        await new Promise(resolve => cleanup(app.on('pageload', resolve)));
        await delay();
        expect(result.current[0]).toBe('baz');
        unmount();
    });

    it('should retain previous state when navigated back between snapshots', async () => {
        const sym = Symbol();
        const stateId = history.state;
        const { result, unmount } = renderHook(() => useRouteState(sym, 'foo'));

        await actAwaitSetImmediate(() => app.snapshot());
        expect(history.state).not.toBe(stateId);
        act(() => result.current[1]('bar'));

        await act(async () => void await app.back());
        await delay();
        expect(history.state).toBe(stateId);
        expect(result.current[0]).toBe('foo');

        // jsdom does not behave correctly when calling history.back()
        // history.forward();
        // await new Promise(resolve => cleanup(bind(window, 'popstate', resolve)));
        // await delay(100);
        // expect(result.current[0]).toBe('bar');
        unmount();
    });

    it('should retain previous state when remounted with the same key', async () => {
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
        await waitFor(() => expect(cb).toBeCalledTimes(3));
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
        await waitFor(() => expect(cb).toBeCalledTimes(2));
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

    it('should persist values in every page', async () => {
        const { result, unmount } = renderHook(() => useRouteState('foo', 'bar'));
        const current = app.historyStorage.current;

        await app.navigate('/foo');
        expect(app.historyStorage.current).not.toBe(current);
        expect(app.historyStorage.current.get('foo')).toBe('bar');
        expect(result.all.length).toBe(1);
        unmount()
    });
});

describe('useQueryParam', () => {
    it('should return default value if param is not present', () => {
        const { result, unmount } = renderHook(() => useQueryParam('foo', 'bar'));
        expect(result.current[0]).toBe('bar');
        unmount();
    });

    it('should return existing value if param is present', () => {
        app.navigate('?foo=baz');

        const { result, unmount } = renderHook(() => useQueryParam('foo', 'bar'));
        expect(result.current[0]).toBe('baz');
        unmount();
    });

    it('should accept dictionary as initial state', () => {
        const dict = {
            foo: 'bar',
            baz: 'baz'
        };
        const { result, unmount } = renderHook(() => useQueryParam(dict));
        expect(result.current[0]).toEqual(dict);
        unmount();
    });

    it('should update query parameter', () => {
        const { result, unmount } = renderHook(() => useQueryParam('foo', ''));
        result.current[1]('bar');
        expect(location.search).toBe('?foo=bar');
        unmount();
    });

    it('should update multiple query parameters', () => {
        const { result, unmount } = renderHook(() => useQueryParam({
            foo: '',
            baz: ''
        }));
        result.current[1]({
            foo: 'bar',
            baz: 'baz'
        });
        expect(location.search).toBe('?foo=bar&baz=baz');
        unmount();
    });

    it('should accept function for updating', () => {
        const cb = mockFn().mockReturnValue('bar');
        const { result, unmount } = renderHook(() => useQueryParam('foo', ''));
        result.current[1](cb);
        expect(location.search).toBe('?foo=bar');
        expect(cb).toBeCalledWith('');
        unmount();
    });

    it('should accept function for updating multiple query parameters', () => {
        const cb = mockFn().mockReturnValue({
            foo: 'bar',
            baz: 'baz'
        });
        const { result, unmount } = renderHook(() => useQueryParam({
            foo: '',
            baz: ''
        }));
        result.current[1](cb);
        expect(location.search).toBe('?foo=bar&baz=baz');
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0]).toEqual({
            foo: '',
            baz: ''
        });
        unmount();
    });

    it('should not update query string when the parent view is going to unmount', async () => {
        const cb = mockFn();
        const Foo = registerView(() => {
            const [, setParam] = useQueryParam('foo', '');
            cb.mockReset().mockImplementation(setParam);
            return (<div>foo</div>);
        }, { view: 'foo' });
        const Bar = registerView(() => {
            useRouteParam('view');
            return (<div>bar</div>);
        }, { view: 'bar' });

        const { unmount } = render(<div>{renderView(Foo, Bar)}</div>)
        await app.navigate('/foo');

        catchAsync(app.navigate('/bar'));
        await delay();
        cb('bar');
        expect(app.path).toBe('/bar');
        unmount();
    });

    it('should not create snapshot when value is set', () => {
        const { result, unmount } = renderHook(() => useQueryParam('foo', ''));
        const stateId = history.state;
        const page = app.page;

        result.current[1]('bar');
        expect(location.search).toBe('?foo=bar');
        expect(history.state).toBe(stateId);
        expect(app.page).toBe(page);
        unmount();
    });

    it('should create snapshot when snapshotOnUpdate is true', () => {
        const { result, unmount } = renderHook(() => useQueryParam('foo', '', true));
        const stateId = history.state;
        const page = app.page;

        result.current[1]('bar');
        expect(location.search).toBe('?foo=bar');
        expect(history.state).not.toBe(stateId);
        expect(app.page).toBe(page);
        unmount();
    });

    it('should cause component to re-render when query param changed', async () => {
        const { result, waitForNextUpdate, unmount } = renderHook(() => useQueryParam('foo', ''));
        app.navigate('?foo=bar');
        await waitForNextUpdate();
        expect(result.current[0]).toEqual('bar');
        unmount();
    });

    it('should not cause component to re-render when mentioned query param did not changed', async () => {
        const { result, unmount } = renderHook(() => useQueryParam('foo', ''));
        app.navigate('?baz=baz');
        await delay(100);
        expect(result.all.length).toBe(1);
        unmount();
    });

    it('should not cause component to re-render when the parent view is going to unmount', async () => {
        const cb = mockFn();
        const Foo = registerView(() => {
            cb();
            useQueryParam('foo', '');
            return (<div>foo</div>);
        }, { view: 'foo' });
        const Bar = registerView(() => {
            useRouteParam('view');
            return (<div>bar</div>);
        }, { view: 'bar' });

        const { unmount } = render(<div>{renderView(Foo, Bar)}</div>)
        await app.navigate('/foo');
        await screen.findByText('foo');
        expect(cb).toBeCalledTimes(1);

        await app.navigate('/bar?foo=bar');
        expect(cb).toBeCalledTimes(1);
        unmount();
    });

    it('should update current path correctly when new query string is empty', async () => {
        await app.navigate('/foo');

        const { result, unmount } = renderHook(() => useQueryParam('foo', ''));
        result.current[1]('bar');
        expect(app.path).toBe('/foo?foo=bar');

        result.current[1]('');
        await delay();
        expect(app.path).toBe('/foo');
        unmount();
    });

    it('should restore previous values when navigated back', async () => {
        const { result, waitForNextUpdate, unmount } = renderHook(() => useQueryParam('foo', '', true));
        act(() => result.current[1]('bar'));
        expect(location.search).toBe('?foo=bar');
        expect(result.current[0]).toBe('bar');

        await 0;
        app.back();
        await waitForNextUpdate();
        expect(location.search).toBe('');
        expect(result.current[0]).toBe('');
        unmount();
    });

    it('should return correct value when supplied key has changed', async () => {
        app.navigate('?foo=bar&baz=baz');

        const { result, rerender, unmount } = renderHook(({ name }) => useQueryParam(name, 'xxx', true), {
            initialProps: { name: 'foo' }
        });
        expect(result.current[0]).toBe('bar');
        rerender({ name: 'baz' });
        expect(result.current[0]).toBe('baz');
        rerender({ name: 'xxx' });
        expect(result.current[0]).toBe('xxx');
        unmount();
    });

    it('should invoke callback with correct value and update query string correctly when supplied key has changed', async () => {
        const cb = mockFn().mockReturnValue('baz');
        const { result, rerender, unmount } = renderHook(({ name }) => useQueryParam(name, '', true), {
            initialProps: { name: 'foo' }
        });
        rerender({ name: 'baz' });

        act(() => result.current[1](cb));
        expect(cb).toBeCalledWith('');
        expect(location.search).toBe('?baz=baz');
        unmount();
    });
});

describe('ViewStateContainer', () => {
    it('should bring current value to new state', async () => {
        const Component = function () {
            const state = useViewState('foo');
            useEffect(() => {
                state.set('foo');
            }, [state]);
            return (<div>{state.get()}</div>);
        };
        const { unmount } = render(<Component />, { wrapper: ViewStateContainer });
        const current = app.historyStorage.current;
        expect(app.historyStorage.current.get('foo')).toBe('foo');

        await app.navigate('/foo');
        expect(app.historyStorage.current).not.toBe(current);
        expect(app.historyStorage.current.get('foo')).toBe('foo');
        unmount();
    });

    it('should not bring value for disposed view state', async () => {
        const Inner = function () {
            const state = useViewState('foo');
            useEffect(() => {
                state.set('foo');
            }, [state]);
            return null;
        };
        const Component = function ({ renderHook }) {
            return renderHook ? <Inner /> : null;
        };
        const { rerender, unmount } = render(<Component renderHook />, { wrapper: ViewStateContainer });
        const current = app.historyStorage.current;
        expect(app.historyStorage.current.get('foo')).toBe('foo');

        await after(() => rerender(<Component renderHook={false} />));
        await app.navigate('/foo');
        expect(app.historyStorage.current).not.toBe(current);
        expect(app.historyStorage.current.has('foo')).toBe(false);
        unmount();
    });

    it('should create snapshot to store new state if snapshot flag is true', async () => {
        const Component = function () {
            const state = useViewState('foo');
            useEffect(() => {
                state.set('bar', true);
            }, [state]);
            return (<div>{state.get()}</div>);
        };
        const current = app.historyStorage.current;
        current.set('foo', 'foo');

        const { unmount } = render(<Component />, { wrapper: ViewStateContainer });
        expect(app.historyStorage.current).not.toBe(current);
        expect(app.historyStorage.current.get('foo')).toBe('bar');
        unmount();
    });

    it('should not create snapshot to store new state if value did not change', async () => {
        const Component = function () {
            const state = useViewState('foo');
            useEffect(() => {
                state.set('foo', true);
            }, [state]);
            return (<div>{state.get()}</div>);
        };
        const current = app.historyStorage.current;
        current.set('foo', 'foo');

        const { unmount } = render(<Component />, { wrapper: ViewStateContainer });
        expect(app.historyStorage.current).toBe(current);
        expect(app.historyStorage.current.get('foo')).toBe('foo');
        unmount();
    });

    it('should not create snapshot to store new state if value was not present', async () => {
        const Component = function () {
            const state = useViewState('foo');
            useEffect(() => {
                state.set('foo', true);
            }, [state]);
            return (<div>{state.get()}</div>);
        };
        const current = app.historyStorage.current;

        const { unmount } = render(<Component />, { wrapper: ViewStateContainer });
        expect(app.historyStorage.current).toBe(current);
        expect(app.historyStorage.current.get('foo')).toBe('foo');
        unmount();
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
        const { unmount } = render(<Component />, { wrapper: ViewStateContainer });

        await app.navigate('/foo');
        expect(cb).not.toBeCalled();

        cb.mockClear();
        await app.back();
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0]).toEqual(['foo']);
        unmount();
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
        const { rerender, unmount } = render(<Component stateKey="foo" />, { wrapper: ViewStateContainer });

        rerender(<Component stateKey="bar" />);
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0]).toEqual([undefined]);

        cb.mockClear();
        rerender(<Component stateKey="foo" />);
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0]).toEqual(['foo']);
        unmount();
    });
});
