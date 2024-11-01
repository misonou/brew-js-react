import React, { useEffect, useState } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useAsync, useObservableProperty, useViewState } from "zeta-dom-react";
import { isViewMatched, isViewRendered, linkTo, matchView, navigateTo, redirectTo, registerErrorView, registerView, renderView, useViewContainerState, useViewContext, ViewContext } from "src/view";
import { body, delay, mockFn, verifyCalls, _, cleanup, root } from "@misonou/test-utils";
import dom from "zeta-dom/dom";
import { addAnimateIn, addAnimateOut } from "brew-js/anim";
import { subscribeAsync } from "zeta-dom/domLock";
import initAppBeforeAll, { waitForPageLoad } from "./harness/initAppBeforeAll";
import composeAct from "./harness/composeAct";
import { useRouteParam } from "src/hooks";
import { jest } from "@jest/globals";

const { actAwaitSetImmediate } = composeAct(act);

const app = initAppBeforeAll(app => {
    app.useRouter({
        baseUrl: '/',
        routes: [
            '/{dummy:dummy}/{view:test}/a/{params1?}/{params2?}',
            '/{dummy:dummy}/{view:test}/b/{params3?}',
            '/{dummy:dummy}/{view:foo}/{baz?}',
            '/{dummy:dummy}/{view}/*',
            '/{dummy:dummy}',
            '/{var2}/a/{var1}',
            '/{var1:var1}',
            '/*'
        ]
    });
});

async function dummyImport() {
    return {
        default: () => {
            return (<div></div>);
        }
    };
}

const viewCallback = mockFn();

/** @type {import("src/view").ViewComponent<{}>} */
let Foo;
/** @type {import("src/view").ViewComponent<{}>} */
let Bar;
/** @type {import("src/view").ViewComponent<{}>} */
let Baz;
/** @type {import("src/view").ViewComponent<{}>} */
let BarBaz;
/** @type {import("src/view").ViewComponent<{}>} */
let Test;
/** @type {import("src/view").ViewComponent<{}>} */
let Var1;
/** @type {import("src/view").ViewComponent<{}>} */
let Var2;

beforeAll(async () => {
    Foo = registerView(async () => {
        return {
            default: () => {
                viewCallback(Foo);
                return (<div>foo</div>)
            }
        }
    }, { view: 'foo' })

    Bar = registerView(async () => {
        return {
            default: () => {
                viewCallback(Bar);
                return (<div>bar</div>)
            }
        }
    }, { view: 'bar' })

    Baz = registerView(async () => {
        return {
            default: () => {
                viewCallback(Baz);
                return (<div>baz</div>)
            }
        }
    }, { view: 'foo', baz: /./ })

    BarBaz = registerView(async () => {
        return {
            default: () => {
                viewCallback(BarBaz);
                return (<div>b_a_r_b_a_z</div>)
            }
        }
    }, { view: 'bar', remainingSegments: '/baz' })

    Test = registerView(async () => {
        return {
            default: () => {
                viewCallback(Test);
                return (<div>test</div>)
            }
        }
    }, { view: 'test' });

    Var1 = registerView(async () => {
        return {
            default: () => {
                useObservableProperty(app.route, 'var2');
                var state = useViewState('var');
                if (!state.get()) {
                    state.set('var1');
                }
                viewCallback(Var1);
                return (<div>{state.get() || 'var1'}</div>);
            }
        }
    }, { var1: 'var1' });

    Var2 = registerView(async () => {
        return {
            default: () => {
                useObservableProperty(app.route, 'var2');
                var state = useViewState('var');
                if (!state.get()) {
                    state.set('var2');
                }
                viewCallback(Var2);
                return (<div>{state.get() || 'var2'}</div>);
            }
        }
    }, { var1: 'var1', var2: 'xxx' });
});

beforeEach(async () => {
    await app.navigate('/dummy');
});

describe('matchView', () => {
    it('should return view that best matches given path', () => {
        expect(matchView('/dummy/foo', [Foo])).toBe(Foo);
        expect(matchView('/dummy/foo/baz', [Foo])).toBe(Foo);
        expect(matchView('/dummy/foo/baz', [Foo, Baz])).toBe(Baz);

        expect(matchView('/dummy/foo', Foo)).toBe(Foo);
        expect(matchView('/dummy/foo/baz', Foo, Baz)).toBe(Baz);
    });

    it('should return undefined if no views are matched', () => {
        expect(matchView('/dummy/bar', [Foo])).toBeUndefined();
    });

    it('should return view that best matches current path', async () => {
        await app.navigate('/dummy/foo');
        expect(matchView([Foo])).toBe(Foo);

        await app.navigate('/dummy/foo/baz');
        expect(matchView([Foo])).toBe(Foo);
        expect(matchView([Foo, Baz])).toBe(Baz);

        expect(matchView(Foo)).toBe(Foo);
        expect(matchView(Foo, Baz)).toBe(Baz);
    });
});

describe('isViewMatched', () => {
    it('should match route params with regex', async () => {
        const BazRegex = registerView(async () => {
            return {
                default: () => {
                    return (<div>baz_regex</div>)
                }
            }
        }, { view: 'foo', baz: /^\d+$/ });

        await app.navigate('/dummy/foo/baz');
        expect(isViewMatched(Baz)).toBe(true);
        expect(isViewMatched(BazRegex)).toBe(false);
    });

    it('should match route params with callback', async () => {
        const bazCallback = mockFn(v => v === 'baz');
        const BazCb = registerView(async () => {
            return {
                default: () => {
                    return (<div>baz_cb</div>)
                }
            }
        }, { view: 'foo', baz: bazCallback });

        await app.navigate('/dummy/foo/baz');
        expect(isViewMatched(BazCb)).toBe(true);
        verifyCalls(bazCallback, [['baz']]);
        bazCallback.mockClear();

        await app.navigate('/dummy/foo/baz2');
        expect(isViewMatched(BazCb)).toBe(false);
        verifyCalls(bazCallback, [['baz2']]);
    });

    it('should match null', async () => {
        const FooBazNull = registerView(async () => {
            return {
                default: () => {
                    return (<div>foo_baz_empty</div>)
                }
            }
        }, { view: 'foo', baz: null });

        await app.navigate('/dummy/foo');
        expect(isViewMatched(FooBazNull)).toBe(true);
    });

    it('should match null with empty string', async () => {
        const FooBazEmpty = registerView(async () => {
            return {
                default: () => {
                    return (<div>foo_baz_empty</div>)
                }
            }
        }, { view: 'foo', baz: '' });

        await app.navigate('/dummy/foo');
        expect(isViewMatched(FooBazEmpty)).toBe(true);
    });

    it('should match null with empty regex', async () => {
        const FooBazEmptyRegex = registerView(async () => {
            return {
                default: () => {
                    return (<div>foo_baz_empty_regex</div>)
                }
            }
        }, { view: 'foo', baz: /^$/ });

        await app.navigate('/dummy/foo');
        expect(isViewMatched(FooBazEmptyRegex)).toBe(true);
    });

    it('should not match non-null value with null', async () => {
        const FooBazNull = registerView(async () => {
            return {
                default: () => {
                    return (<div>foo_baz_empty</div>)
                }
            }
        }, { view: 'foo', baz: null });

        await app.navigate('/dummy/foo/baz');
        expect(isViewMatched(FooBazNull)).toBe(false);
    });

    it('should not match non-null value with empty string', async () => {
        const FooBazEmpty = registerView(async () => {
            return {
                default: () => {
                    return (<div>foo_baz_empty</div>)
                }
            }
        }, { view: 'foo', baz: '' });

        await app.navigate('/dummy/foo/baz');
        expect(isViewMatched(FooBazEmpty)).toBe(false);
    });

    it('should not match when resolved path differs from current', async () => {
        await app.navigate('/dummy/foo');
        expect(isViewMatched(Baz)).toBe(false);
    });
});

describe('isViewRendered', () => {
    it('should return boolean whether a view is rendered', async () => {
        const { unmount } = render(<div>{renderView(Foo, Bar)}</div>);
        await navigateTo(Foo);
        expect(isViewRendered(Foo)).toBe(true);
        expect(isViewRendered(Bar)).toBe(false);

        await navigateTo(Bar);
        expect(isViewRendered(Foo)).toBe(false);
        expect(isViewRendered(Bar)).toBe(true);

        unmount();
        await 0;
        expect(isViewRendered(Foo)).toBe(false);
        expect(isViewRendered(Bar)).toBe(false);
    });
});

describe('registerErrorView', () => {
    it('should throw when value is not callable', () => {
        expect(() => registerErrorView(null)).toThrow();
        expect(() => registerErrorView(undefined)).toThrow();
        expect(() => registerErrorView(1)).toThrow();
        expect(() => registerErrorView(true)).toThrow();
        expect(() => registerErrorView("true")).toThrow();
        expect(() => registerErrorView([])).toThrow();
    });
});

describe('renderView', () => {
    it('should render matched view', async () => {
        await app.navigate('/dummy/bar');
        const { asFragment } = render(<div>{renderView(Foo, Bar)}</div>)
        await screen.findByText('bar');
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render functional component registered without import', async () => {
        const FooSync = registerView(() => <div>foo</div>, { view: 'foo' });
        const { asFragment } = render(<div>{renderView(FooSync)}</div>);
        await screen.findByText('foo');
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render class component registered without import', async () => {
        const FooSync = registerView(class extends React.Component { render() { return <div>foo</div> } }, { view: 'foo' });
        const { asFragment } = render(<div>{renderView(FooSync)}</div>);
        await screen.findByText('foo');
        expect(asFragment()).toMatchSnapshot();
    });

    it('should throw if component is not registered', () => {
        expect(() => renderView(function () { })).toThrow();
    });

    it('should cause redirection to the first match view if none was matched', async () => {
        const { asFragment } = render(<div>{renderView(Foo, Bar, Baz)}</div>)
        await screen.findByText('foo');
        expect(asFragment()).toMatchSnapshot();
        expect(app.path).toBe('/dummy/foo');
    });

    it('should render matched view when nested', async () => {
        const Outer = registerView(() => renderView(Foo, Baz), { view: 'foo' });
        const { asFragment } = render(<div>{renderView(Outer)}</div>)
        await screen.findByText('foo');
        await waitForPageLoad();

        await app.navigate('/dummy/foo/baz');
        await screen.findByText('baz');
        await delay();
        expect(asFragment()).toMatchSnapshot();
    });

    it('should set current context to ref', async () => {
        let ref = { set current(value) { } };
        let setCurrent = jest.spyOn(ref, 'current', 'set');

        const { rerender, unmount } = render(<div>{renderView({ ref }, Foo, Bar)}</div>)
        await waitFor(() => expect(setCurrent).toBeCalled());
        expect(ViewContext.root.getChildren()[0].view).toBe(Foo);
        expect(setCurrent).toHaveBeenLastCalledWith(ViewContext.root.getChildren()[0]);

        await waitForPageLoad();
        app.navigate('/dummy/bar');
        await waitForPageLoad();
        expect(ViewContext.root.getChildren()[0].view).toBe(Bar);
        expect(setCurrent).toHaveBeenLastCalledWith(ViewContext.root.getChildren()[0]);

        ref = {};
        rerender(<div>{renderView({ ref }, Foo, Bar)}</div>)
        expect(ref.current).toMatchObject({ view: Bar });
        unmount();
    });

    it('should pass props to view container', async () => {
        const { asFragment } = render(<div>{renderView({ className: 'foo' }, Foo)}</div>)
        await screen.findByText('foo');
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render loader while first view component is being loaded', async () => {
        const FooDelay = registerView(async () => {
            await delay(100);
            return { default: () => <div>foo</div> };
        }, { view: 'foo' });
        const { asFragment, unmount } = render(<div>{renderView({ loader: <div>loading</div> }, FooDelay)}</div>);
        await screen.findByText('loading');
        expect(asFragment()).toMatchSnapshot();

        await screen.findByText('foo');
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });

    it('should match views with more params first', async () => {
        await app.navigate('/dummy/foo/baz');
        const { asFragment } = render(<div>{renderView(Foo, Bar, Baz)}</div>)
        await screen.findByText('baz');
        expect(asFragment()).toMatchSnapshot();
        expect(app.path).toBe('/dummy/foo/baz');
    });

    it('should keep extra segments after view being matched', async () => {
        await app.navigate('/dummy/bar/baz');
        render(<div>{renderView(Bar)}</div>);
        await screen.findByText('bar');
        expect(app.path).toBe('/dummy/bar/baz');
    });

    it('should redirect to minimum path of matching view', async () => {
        const Baz2 = registerView(async () => {
            return {
                default: () => {
                    return (<div>baz</div>)
                }
            }
        }, { view: 'foo', baz: 'xxx' });

        await app.navigate('/dummy/foo/baz');
        var { unmount } = render(<div>{renderView(Foo, Baz2)}</div>);
        await screen.findByText('foo');
        await waitForPageLoad();
        expect(app.path).toBe('/dummy/foo');
        unmount();

        await app.navigate('/dummy/test/a/p1/p2');
        var { unmount } = render(<div>{renderView(Test, Foo)}</div>);
        await screen.findByText('test');
        expect(app.path).toBe('/dummy/test/a/p1/p2');
        unmount();

        await app.navigate('/dummy/test/a/p1');
        var { unmount } = render(<div>{renderView(Test, Foo)}</div>);
        await screen.findByText('test');
        expect(app.path).toBe('/dummy/test/a/p1');
        unmount();

        await app.navigate('/dummy/test/b/p3');
        var { unmount } = render(<div>{renderView(Test, Foo)}</div>);
        await screen.findByText('test');
        expect(app.path).toBe('/dummy/test/b/p3');
        unmount();

        await app.navigate('/var1/a/var2');
        var { unmount } = render(<div>{renderView(Var1, Var2)}</div>);
        await screen.findByText('var1');
        expect(app.path).toBe('/var1');
        unmount();
    });

    it('should delay navigation completion until view component is rendered', async () => {
        await app.navigate('/dummy/foo');

        const BarParent = registerView(() => {
            return (<div>{renderView(BarBaz)}</div>);
        }, { view: 'bar' });
        const { unmount } = render(<div>{renderView(BarParent, Foo)}</div>);
        await waitForPageLoad();

        await expect(app.navigate('/dummy')).resolves.toMatchObject({
            path: '/dummy/bar/baz',
            redirected: true,
            originalPath: '/dummy'
        });
        unmount();
    });

    it('should discard pending view if matched view is reverted', async () => {
        const cb = mockFn();
        const Bar = registerView(async () => {
            app.navigate('/dummy/foo', true);
            await delay(50);
            return {
                default: () => (cb(), <div>bar</div>)
            };
        }, { view: 'bar' });
        const { asFragment, unmount } = render(<div>{renderView(Foo, Bar)}</div>);
        await waitForPageLoad();

        await expect(app.navigate('/dummy/bar')).resolves.toMatchObject({ path: '/dummy/foo' });
        await delay(100);
        expect(asFragment()).toMatchSnapshot();
        expect(cb).not.toBeCalled();
        unmount();
    });

    it('should discard pending view if matched view is reverted without navigation', async () => {
        const cb = mockFn();
        const Bar2 = registerView(async () => {
            rerender(<div>{renderView(Bar)}</div>)
            await delay(50);
            return {
                default: () => (cb(), <div>bar2</div>)
            };
        }, { view: 'bar', remainingSegments: '/baz' });

        const { asFragment, rerender, unmount } = render(<div>{renderView(Bar, Bar2)}</div>);
        await waitForPageLoad();
        expect(app.path).toBe('/dummy/bar');

        rerender(<div>{renderView(Bar2)}</div>)
        await delay(100);

        expect(app.path).toBe('/dummy/bar/baz');
        expect(asFragment()).toMatchSnapshot();
        expect(cb).not.toBeCalled();

        const { result } = renderHook(() => useViewContext());
        expect(result.current.getChildren()[0].active).toBe(true);
        unmount();
    });

    it('should not halt navigation when matched view is updated twice', async () => {
        const { rerender, unmount } = render(<div>{renderView(Foo, Bar)}</div>);
        await screen.findByText('foo');
        await waitForPageLoad();
        viewCallback.mockClear();

        const promise = app.navigate('/dummy/bar/baz');
        await new Promise((resolve) => {
            cleanup(app.on('beforepageload', resolve));
        });
        expect(viewCallback).not.toBeCalled();

        rerender(<div>{renderView(BarBaz)}</div>);
        await promise;
        verifyCalls(viewCallback, [[BarBaz]]);
        unmount();
    });

    it('should not trigger redirection when app is about to navigate', async () => {
        const Component = function ({ view }) {
            return renderView(view);
        };
        const promise = app.navigate('/dummy/bar');
        const { rerender } = render(<Component view={Foo} />);
        await actAwaitSetImmediate(() => rerender(<Component view={Bar} />));

        await expect(promise).resolves.toEqual(expect.objectContaining({ path: '/dummy/bar' }));
        expect(app.path).toBe('/dummy/bar');
    });

    it('should not carry view state across different views when redirection is triggered', async () => {
        await app.navigate('/xxx/a/var1');
        var { unmount } = render(<div>{renderView(Var1, Var2)}</div>);
        await screen.findByText('var2');
        await actAwaitSetImmediate(() => app.navigate('/var1/a/var1'));
        expect(app.path).toBe('/var1');
        await screen.findByText('var1');
        unmount();
    });

    it('should render view component after view container is mounted', async () => {
        const Foo = registerView(({ viewContext }) => {
            expect(viewContext.container).toBeTruthy();
            return <div>foo</div>;
        }, { view: 'foo' });
        const { unmount } = render(<div>{renderView(Foo)}</div>);

        await waitForPageLoad();
        expect.assertions(1);
        unmount();
    });

    it('should catch and emit importing error', async () => {
        const error = new Error();
        const BarError = registerView(async () => {
            throw error;
        }, { view: 'bar' });

        const onError = mockFn();
        const { container, unmount } = render(<div>{renderView({ onError }, BarError)}</div>);
        dom.on(container, 'error', onError);
        dom.on(root, 'error', onError);

        await waitForPageLoad();
        verifyCalls(onError, [
            [expect.objectContaining({ error, currentTarget: ViewContext.root.getChildren()[0] }), _],
            [expect.objectContaining({ error, currentTarget: container }), _],
            [expect.objectContaining({ error, currentTarget: root }), _],
        ]);
        unmount();
    });

    it('should catch and emit rendering error', async () => {
        const error = new Error();
        const BarError = registerView(async () => {
            return {
                default: () => {
                    throw error;
                }
            }
        }, { view: 'bar' });

        const onError = mockFn();
        const { container, unmount } = render(<div>{renderView({ onError }, BarError)}</div>);
        dom.on(container, 'error', onError);
        dom.on(root, 'error', onError);

        await waitForPageLoad();
        verifyCalls(onError, [
            [expect.objectContaining({ error, currentTarget: ViewContext.root.getChildren()[0] }), _],
            [expect.objectContaining({ error, currentTarget: container }), _],
            [expect.objectContaining({ error, currentTarget: root }), _],
        ]);
        unmount();
    });

    it('should catch and emit rendering error for view component registered without import', async () => {
        let error, setError;
        const BarError = registerView(() => {
            [error, setError] = useState(null);
            if (error) {
                throw error;
            }
            return (<div>bar</div>);
        }, { view: 'bar' });

        const onError = mockFn();
        const { container, unmount } = render(<div>{renderView({ onError }, BarError)}</div>);
        dom.on(container, 'error', onError);
        dom.on(root, 'error', onError);

        await screen.findByText('bar');
        await actAwaitSetImmediate(() => setError(new Error()));
        verifyCalls(onError, [
            [expect.objectContaining({ error, currentTarget: ViewContext.root.getChildren()[0] }), _],
            [expect.objectContaining({ error, currentTarget: container }), _],
            [expect.objectContaining({ error, currentTarget: root }), _],
        ]);
        unmount();
    });

    it('should catch and render error view', async () => {
        const error = new Error();
        const reset = mockFn();
        const receivedProps = {};
        registerErrorView((props) => {
            Object.assign(receivedProps, props);
            reset.mockImplementationOnce(props.reset);
            return <div>error</div>;
        });

        const obj = { error: null };
        const BarError = registerView(() => {
            const error = useObservableProperty(obj, 'error');
            if (error) {
                throw error;
            }
            return (<div>bar</div>);
        }, { view: 'bar' });

        const onError = mockFn();
        const { container } = render(<div>{renderView({ onError }, BarError)}</div>);
        dom.on(container, 'error', onError);
        dom.on(root, 'error', onError);

        await screen.findByText('bar');
        await actAwaitSetImmediate(() => obj.error = error);
        await screen.findByText('error');
        expect(onError).not.toBeCalled();
        expect(receivedProps).toMatchObject({
            view: BarError,
            error: error
        });

        obj.error = null;
        act(() => reset());
        await screen.findByText('bar');
    });

    it('should catch and emit rendering error thrown from error view', async () => {
        const error = new Error();
        const obj = { error: null };
        registerErrorView(() => {
            const error = useObservableProperty(obj, 'error');
            if (error) {
                throw error;
            }
            return (<div>error</div>);
        });

        const BarError = registerView(async () => {
            throw new Error();
        }, { view: 'bar' });

        const onError = mockFn();
        const { container, asFragment, unmount } = render(<div>{renderView({ onError }, BarError)}</div>);
        dom.on(container, 'error', onError);
        dom.on(root, 'error', onError);

        await screen.findByText('error');
        await actAwaitSetImmediate(() => obj.error = error);
        verifyCalls(onError, [
            [expect.objectContaining({ error, currentTarget: ViewContext.root.getChildren()[0] }), _],
            [expect.objectContaining({ error, currentTarget: container }), _],
            [expect.objectContaining({ error, currentTarget: root }), _],
        ]);
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });

    it('should invoke onError callback correctly with nested container', async () => {
        const onError = mockFn();
        const FooOuter = registerView(() => {
            return (
                <div>{renderView({ onError }, Foo)}</div>
            );
        }, { view: 'foo' });
        const { unmount } = render(<div>{renderView({ onError }, FooOuter)}</div>);
        await screen.findByText('foo');

        const outer = ViewContext.root.getChildren()[0];
        const inner = outer.getChildren()[0];
        dom.reportError(new Error(), inner.container);
        verifyCalls(onError, [
            [expect.objectContaining({ currentTarget: inner }), inner],
            [expect.objectContaining({ currentTarget: outer }), outer],
        ]);
        unmount();
    });

    it('should invoke onError callback supplied in the last render', async () => {
        const cb1 = mockFn();
        const cb2 = mockFn();
        const { rerender, unmount } = render(<div>{renderView({ onError: cb1 }, Foo)}</div>);
        await screen.findByText('foo');

        rerender(<div>{renderView({ onError: cb2 }, Foo)}</div>);
        dom.reportError(new Error(), screen.getByText('foo'));
        expect(cb1).not.toBeCalled();
        expect(cb2).toBeCalled();
        unmount();
    });

    it('should render error view when requested', async () => {
        const setErrorView = mockFn();
        const errorView = (props) => {
            return <div data-testid="error">error: {props.error.message}</div>
        };
        const Foo = registerView(({ viewContext }) => {
            setErrorView.mockImplementation((v, e) => viewContext.setErrorView(v, e));
            return <div>foo</div>;
        }, { view: 'foo' });

        const { asFragment, unmount } = render(<div>{renderView(Foo)}</div>);
        await screen.findByText('foo');

        expect(setErrorView(errorView, new Error('bar'))).toBe(true);
        await screen.findByTestId('error');
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });

    it('should reset from error view on page change', async () => {
        let error, setError;
        const BarError = registerView(() => {
            [error, setError] = useState(null);
            if (error) {
                throw error;
            }
            return (<div>bar</div>);
        }, { view: 'bar' });
        const { unmount } = render(<div>{renderView(BarError)}</div>);
        await screen.findByText('bar');

        registerErrorView(() => {
            return (<div>error</div>);
        });
        await actAwaitSetImmediate(() => setError(new Error()));
        await screen.findByText('error');

        await expect(app.navigate('/dummy/bar/baz')).resolves.toMatchObject({ navigated: true });
        await screen.findByText('bar');
        unmount();
    });

    it('should retry importing component', async () => {
        const cb = mockFn(async () => {
            throw new Error();
        });
        const cbReset = mockFn();
        registerErrorView(({ reset }) => {
            cbReset.mockImplementation(reset);
            return <div>error</div>;
        });
        const BarError = registerView(cb, { view: 'bar' });
        const { unmount } = render(<div>{renderView(BarError)}</div>);

        await waitForPageLoad();
        expect(cb).toBeCalledTimes(1);

        cbReset();
        await waitFor(() => expect(cb).toBeCalledTimes(2));
        unmount();
    });

    it('should notify asynchronous operation on view container', async () => {
        const Foo = registerView(async () => {
            await delay(10);
            return {
                default: () => {
                    return <div>foo</div>;
                }
            };
        }, { view: 'foo' });
        const cb = mockFn(() => screen.queryByText('foo'));
        const container = document.createElement('div');
        body.appendChild(container);
        dom.on(container, 'asyncStart', cb);
        dom.on(container, 'asyncEnd', cb);
        subscribeAsync(container);

        const { unmount } = render(<div>{renderView(Foo)}</div>, { container });
        await waitFor(() => expect(cb).toBeCalledTimes(2));
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'asyncStart' }), _],
            [expect.objectContaining({ type: 'asyncEnd' }), _],
        ]);
        unmount();
    });

    it('should not trigger async event if component is not async import', async () => {
        const Foo = registerView(() => <div>foo</div>, { view: 'foo' });
        const cb = mockFn();
        const container = document.createElement('div');
        body.appendChild(container);
        dom.on(container, 'asyncStart', cb);
        dom.on(container, 'asyncEnd', cb);
        subscribeAsync(container);

        const { unmount } = render(<div>{renderView(Foo)}</div>, { container });
        await waitForPageLoad();
        expect(cb).not.toBeCalled();
        unmount();
    });

    it('should emit pageenter event after view component is rendered', async () => {
        const { container, unmount } = render(<div>{renderView(Foo)}</div>);
        const pageenter = mockFn(() => screen.queryByText('foo'));
        dom.on(container, 'pageenter', pageenter);

        await waitFor(() => expect(pageenter).toBeCalled());
        verifyCalls(pageenter, [
            [expect.objectContaining({ type: 'pageenter', view: Foo }), _]
        ]);
        expect(pageenter.mock.results[0].value).toBeTruthy();
        unmount();
    });

    it('should emit pageenter event after effect is invoked', async () => {
        const cb = mockFn();
        const Foo = registerView(() => {
            useEffect(() => cb('effect'));
            return (<></>);
        }, { view: 'foo' });
        const { container, unmount } = render(<div>{renderView(Foo)}</div>);
        dom.on(container, 'pageenter', () => cb('pageenter'));

        await waitFor(() => expect(cb).toBeCalledTimes(2));
        verifyCalls(cb, [
            ['effect'],
            ['pageenter']
        ]);
        unmount();
    });

    it('should emit pageleave event before view component is unmounted', async () => {
        const { container, unmount } = render(<div>{renderView(Foo, Bar)}</div>);
        const pageleave = mockFn(() => screen.queryByText('foo'));
        dom.on(container, 'pageleave', pageleave);

        const element = await screen.findByText('foo');
        await waitForPageLoad();
        await actAwaitSetImmediate(() => app.navigate('/dummy/bar'));
        verifyCalls(pageleave, [
            [expect.objectContaining({ type: 'pageleave', view: Foo }), _]
        ]);
        expect(pageleave.mock.results[0].value).toBe(element);
        unmount();
    });

    it('should trigger intro animation after view component is rendered', async () => {
        const cb = mockFn(() => screen.queryByText('bar'));
        addAnimateIn('animate-in-qpfsq', cb);

        const BarAnim = registerView(async () => ({
            default: function () {
                return <div animate-in="" animate-in-qpfsq="">bar</div>;
            }
        }), { view: 'bar' });
        const { unmount } = render(<div>{renderView(BarAnim)}</div>);
        await screen.findByText('bar');
        await delay();
        expect(cb).toBeCalledTimes(1);
        unmount();
    });

    it('should trigger outro animation before view component is unmounted', async () => {
        let resolve;
        const promise = new Promise(resolve_ => resolve = resolve_);
        const cb = mockFn().mockReturnValue(promise);
        addAnimateOut('animate-out-e3vpv', cb);

        const BarAnim = registerView(async () => ({
            default: function () {
                return <div animate-out="" animate-out-e3vpv="">bar</div>;
            }
        }), { view: 'bar' });
        const { unmount } = render(<div>{renderView(BarAnim, Foo)}</div>);
        await screen.findByText('bar');
        await waitForPageLoad();

        await actAwaitSetImmediate(() => app.navigate('/dummy/foo'));
        expect(cb).toBeCalledTimes(1);
        screen.getByText('bar');

        await actAwaitSetImmediate(() => resolve());
        expect(screen.queryByText('bar')).toBe(null);
        unmount();
    });

    it('should persist view data in history', async () => {
        const BarTest = registerView(function Component({ viewData }) {
            return <div>{viewData.text}</div>;
        }, { view: 'bar' });
        const { asFragment, unmount } = render(<div>{renderView(Foo, BarTest)}</div>);
        await screen.findByText('foo');
        await waitForPageLoad();

        await navigateTo(BarTest, null, { text: 'BarTest' });
        await screen.findByText('BarTest');
        await delay();
        expect(asFragment()).toMatchSnapshot();

        history.back();
        await screen.findByText('foo');

        history.forward();
        await screen.findByText('BarTest');
        unmount();
    });

    it('should clear view data when navigation is redirected', async () => {
        const BarTest = registerView(function Component({ viewData }) {
            return <div>{viewData.text || 'bar'}</div>;
        }, { view: 'bar' });
        const { asFragment, unmount } = render(<div>{renderView(Foo, BarTest)}</div>);
        await screen.findByText('foo');
        await waitForPageLoad();

        const promise = navigateTo(BarTest, null, { text: 'baz' });
        await app.navigate('/dummy/foo', true);
        await expect(promise).resolves.toMatchObject({ path: '/dummy/foo' });

        await app.navigate('/dummy/bar');
        await delay();
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });

    it('should clear view data when navigation is aborted', async () => {
        const BarTest = registerView(function Component({ viewData }) {
            return <div>{viewData.text || 'bar'}</div>;
        }, { view: 'bar' });
        const { asFragment, unmount } = render(<div>{renderView(Foo, BarTest)}</div>);
        await screen.findByText('foo');
        await waitForPageLoad();

        const promise = navigateTo(BarTest, null, { text: 'baz' });
        await app.navigate('/dummy/foo');
        await expect(promise).rejects.toBeTruthy();

        await app.navigate('/dummy/bar');
        await delay();
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });

    it('should retrieve view data when view container is mounted after navigation', async () => {
        const BarTest = registerView(function Component({ viewData }) {
            return <div>{viewData.text || 'bar'}</div>;
        }, { view: 'bar' });

        await app.navigate('/dummy/bar', false, { text: 'baz' });
        const { asFragment, unmount } = render(<div>{renderView(BarTest)}</div>);

        await screen.findByText('baz');
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });

    it('should update after parent view component', async () => {
        const Parent = registerView(() => {
            const view = useRouteParam('view');
            return (<div>{renderView(view === 'bar' ? Bar : Foo)}</div>);
        }, { view: /./ });

        const { unmount } = render(<div>{renderView(Parent)}</div>);
        await screen.findByText('foo');
        await waitForPageLoad();

        await expect(app.navigate('/dummy/bar')).resolves.toMatchObject({
            path: '/dummy/bar',
            redirected: false
        });
        unmount();
    });

    it('should not update when parent view component has become inactive', async () => {
        const FooParent = registerView(() => {
            const [, setState] = useState(0);
            useEffect(() => {
                return app.on('pageleave', function () {
                    // force ViewContainer.render to be called again before unmount
                    setState(1);
                })
            }, []);
            return (<div>{renderView(Foo)}</div>);
        }, { view: 'foo' });
        const BarParent = registerView(() => {
            return (<div>{renderView(Bar)}</div>);
        }, { view: 'bar' });

        const { unmount } = render(<div>{renderView(FooParent, BarParent)}</div>);
        await screen.findByText('foo');
        await waitForPageLoad();

        await expect(app.navigate('/dummy/bar')).resolves.toMatchObject({
            path: '/dummy/bar',
            redirected: false
        });
        unmount();
    });

    it('should re-render view after pagechange event', async () => {
        const cb = mockFn();
        const Foo = registerView(({ viewContext, viewData }) => {
            cb('render', viewContext.page.path, viewData);
            useEffect(() => {
                return viewContext.on('pagechange', () => cb('pagechange'));
            }, []);
            return <div>foo</div>;
        }, { view: /./ });

        const { unmount } = render(<div>{renderView(Foo)}</div>);
        await screen.findByText('foo');
        verifyCalls(cb, [
            ['render', '/dummy', {}]
        ]);
        cb.mockClear();

        // wait previous navigation settled
        await delay();
        await app.navigate('/dummy/bar');
        await waitFor(() => expect(cb).toBeCalledTimes(2));
        verifyCalls(cb, [
            ['pagechange'],
            ['render', '/dummy/bar', {}]
        ]);
        cb.mockClear();

        // wait previous navigation settled
        await delay();
        await app.navigate('/dummy/bar', null, { foo: 'bar' });
        await waitFor(() => expect(cb).toBeCalledTimes(2));
        verifyCalls(cb, [
            ['pagechange'],
            ['render', '/dummy/bar', { foo: 'bar' }]
        ]);
        cb.mockClear();

        // snapshot should not cause re-render
        await app.snapshot();
        expect(cb).not.toBeCalled();
        unmount();
    });

    it('should re-render view after pagechange event for view registered by async import', async () => {
        const cb = mockFn();
        const Foo = registerView(async () => {
            return {
                default: ({ viewContext, viewData }) => {
                    cb('render', viewContext.page.path, viewData);
                    useEffect(() => {
                        return viewContext.on('pagechange', () => cb('pagechange'));
                    }, []);
                    return <div>foo</div>;
                }
            };
        }, { view: /./ });

        const { unmount } = render(<div>{renderView(Foo)}</div>);
        await screen.findByText('foo');
        verifyCalls(cb, [
            ['render', '/dummy', {}]
        ]);
        cb.mockClear();

        // wait previous navigation settled
        await delay();
        await app.navigate('/dummy/bar');
        await waitFor(() => expect(cb).toBeCalledTimes(2));
        verifyCalls(cb, [
            ['pagechange'],
            ['render', '/dummy/bar', {}]
        ]);
        cb.mockClear();

        // wait previous navigation settled
        await delay();
        await app.navigate('/dummy/bar', null, { foo: 'bar' });
        await waitFor(() => expect(cb).toBeCalledTimes(2));
        verifyCalls(cb, [
            ['pagechange'],
            ['render', '/dummy/bar', { foo: 'bar' }]
        ]);
        cb.mockClear();

        // snapshot should not cause re-render
        await app.snapshot();
        expect(cb).not.toBeCalled();
        unmount();
    });

    it('should pass error handler that catch async error', async () => {
        const cb = mockFn();
        const Foo = registerView(function Component({ errorHandler }) {
            useEffect(() => {
                return errorHandler.catch(cb);
            }, []);
            useAsync(() => Promise.reject(new Error()));
            return <div>foo</div>;
        }, { view: 'foo' });

        const { unmount } = render(<div>{renderView(Foo)}</div>);
        await waitFor(() => expect(cb).toBeCalledTimes(1));
        unmount();
    });
});

describe('linkTo', () => {
    it('should return path that will render specified view with params', () => {
        expect(linkTo(Foo, { baz: 'baz' })).toBe('/dummy/foo');
        expect(linkTo(Baz, { baz: 'baz' })).toBe('/dummy/foo/baz');
        expect(linkTo(Bar, { remainingSegments: '/buzz' })).toBe('/dummy/bar/buzz');
        expect(linkTo(BarBaz)).toBe('/dummy/bar/baz');
        expect(linkTo(Test, { params1: 'baz' })).toBe('/dummy/test/a/baz');
        expect(linkTo(Test, { params1: 'baz', params2: 'bee' })).toBe('/dummy/test/a/baz/bee');
        expect(linkTo(Test, { params3: 'baz' })).toBe('/dummy/test/b/baz');
        expect(linkTo(Var1, { var2: 'xxx' })).toBe('/var1');
    });

    it('should accept array containing params, query and hash', () => {
        expect(linkTo(Baz, [{ baz: 'baz' }, '?q=value'])).toBe('/dummy/foo/baz?q=value');
        expect(linkTo(Baz, [{ baz: 'baz' }, 'q=value'])).toBe('/dummy/foo/baz?q=value');
        expect(linkTo(Baz, [{ baz: 'baz' }, , '#hash'])).toBe('/dummy/foo/baz#hash');
        expect(linkTo(Baz, [{ baz: 'baz' }, , 'hash'])).toBe('/dummy/foo/baz#hash');
        expect(linkTo(Baz, [{ baz: 'baz' }, '', 'hash'])).toBe('/dummy/foo/baz#hash');
        expect(linkTo(Baz, [{ baz: 'baz' }, 'q=value', 'hash'])).toBe('/dummy/foo/baz?q=value#hash');
        expect(linkTo(Baz, [{ baz: 'baz' }, 'q=value', ''])).toBe('/dummy/foo/baz?q=value');

        expect(linkTo(BarBaz, [, '?q=value'])).toBe('/dummy/bar/baz?q=value');
        expect(linkTo(BarBaz, [, 'q=value'])).toBe('/dummy/bar/baz?q=value');
        expect(linkTo(BarBaz, [, , '#hash'])).toBe('/dummy/bar/baz#hash');
        expect(linkTo(BarBaz, [, , 'hash'])).toBe('/dummy/bar/baz#hash');
        expect(linkTo(BarBaz, [, '', 'hash'])).toBe('/dummy/bar/baz#hash');
        expect(linkTo(BarBaz, [, 'q=value', 'hash'])).toBe('/dummy/bar/baz?q=value#hash');
        expect(linkTo(BarBaz, [, 'q=value', ''])).toBe('/dummy/bar/baz?q=value');

        expect(linkTo(BarBaz, [, { q: 'value' }])).toBe('/dummy/bar/baz?q=value');
        expect(linkTo(BarBaz, [, new URLSearchParams({ q: 'value' })])).toBe('/dummy/bar/baz?q=value');
    });

    it('should return minimum path matching the specified view', async () => {
        await app.navigate('/dummy/foo/baz');
        expect(linkTo(Foo)).toBe('/dummy/foo');
        await app.navigate('/dummy/bar/baz');
        expect(linkTo(Bar)).toBe('/dummy/bar');
    });

    it('should return path with remaining segments normalized', async () => {
        expect(linkTo(Bar, { remainingSegments: 'buzz' })).toBe('/dummy/bar/buzz');
    });

    it('should return path without remaining segments if matched route does not allow', async () => {
        expect(linkTo(Baz, { baz: 'baz', remainingSegments: '/buzz' })).toBe('/dummy/foo/baz');
    });

    it('should not override constant parameters passed to registerView', async () => {
        const BazNull = registerView(dummyImport, { view: 'foo', baz: null });
        const BarBazNull = registerView(dummyImport, { view: 'bar', remainingSegments: null });

        expect(linkTo(Foo, { view: 'bar' })).toBe('/dummy/foo');
        expect(linkTo(BazNull, { baz: 'baz' })).toBe('/dummy/foo');
        expect(linkTo(BarBaz, { remainingSegments: '/buzz' })).toBe('/dummy/bar/baz');
        expect(linkTo(BarBazNull, { remainingSegments: '/buzz' })).toBe('/dummy/bar');
    });

    it('should return root path for views not being registered', () => {
        function Component() {
            return <></>;
        }
        expect(linkTo(Component)).toBe('/');
    });
});

describe('navigateTo', () => {
    it('should navigate to path that will render specified view with params', async () => {
        await expect(navigateTo(Baz, { baz: 'baz' })).resolves.toEqual(expect.objectContaining({
            navigated: true,
            path: '/dummy/foo/baz'
        }));
    });

    it('should accept query and hash', async () => {
        await navigateTo(Baz, [{ baz: 'baz' }, 'q=value', 'hash']);
        expect(app.path).toBe('/dummy/foo/baz?q=value#hash');
    });

    it('should pass data to view component', async () => {
        const BarTest = registerView(function Component({ viewData }) {
            return <div data-testid="test">{viewData.text}</div>;
        }, { view: 'bar' });
        const { asFragment, unmount } = render(<div>{renderView(Foo, BarTest)}</div>);
        await screen.findByText('foo');
        await waitForPageLoad();

        await navigateTo(BarTest, null, { text: 'BarTest' });
        await screen.findByTestId('test');
        await delay();
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });
});

describe('redirectTo', () => {
    it('should redirect to path that will render specified view with params', async () => {
        await app.navigate('/dummy/foo');
        const previousPath = app.previousPath;

        await expect(redirectTo(Baz, { baz: 'baz' })).resolves.toEqual(expect.objectContaining({
            navigated: true,
            path: '/dummy/foo/baz'
        }));
        expect(app.previousPath).toBe(previousPath);
    });

    it('should accept query and hash', async () => {
        await redirectTo(Baz, [{ baz: 'baz' }, 'q=value', 'hash']);
        expect(app.path).toBe('/dummy/foo/baz?q=value#hash');
    });

    it('should pass data to view component', async () => {
        const BarTest = registerView(function Component({ viewData }) {
            return <div data-testid="test">{viewData.text}</div>;
        }, { view: 'bar' });
        const { asFragment, unmount } = render(<div>{renderView(Foo, BarTest)}</div>);
        await screen.findByText('foo');
        await waitForPageLoad();

        await redirectTo(BarTest, null, { text: 'BarTest' });
        await screen.findByTestId('test');
        await delay();
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });
});

describe('useViewContainerState', () => {
    it('should return correct state outside view container', () => {
        const { result } = renderHook(() => useViewContainerState())
        expect(result.current).toMatchObject({
            container: root,
            active: true,
            view: null,
            page: app.page
        });
        expect(result.current.on).toBeInstanceOf(Function);
    });

    it('should return whether the component is inside the active view container', async () => {
        let fooResult, barResultInFoo, barResult;
        const Foo = registerView(async () => ({
            default: function () {
                fooResult = useViewContainerState();
                barResultInFoo = barResult;
                return <div>foo</div>;
            }
        }), { view: 'foo' });
        const Bar = registerView(async () => ({
            default: function () {
                barResult = useViewContainerState();
                return <div>bar</div>;
            }
        }), { view: 'bar' });

        render(<div>{renderView(Foo, Bar)}</div>);
        await screen.findByText('foo');
        await waitForPageLoad();
        expect(fooResult).toMatchObject({ view: Foo, active: true });

        await actAwaitSetImmediate(() => app.navigate('/dummy/bar'));
        expect(fooResult.active).toBe(false);
        expect(barResultInFoo).toBeUndefined();
    });
});

describe('ViewContext', () => {
    it('should return correct view for root context', () => {
        const { result, unmount } = renderHook(() => useViewContext());
        expect(result.current).toEqual(expect.objectContaining({
            parent: null,
            active: true,
            container: root,
            page: app.page
        }));
        unmount();
    });

    it('should return current page info', async () => {
        const cb = mockFn();
        const Foo = registerView(function ({ viewContext }) {
            cb(viewContext.page);
            return (<></>);
        }, { view: 'foo' });

        const { unmount } = render(<div>{renderView(Foo)}</div>)
        await app.navigate('/dummy/foo');
        expect(cb).toBeCalledWith(app.page);
        unmount();
    });

    it('should return parent and child view context', async () => {
        let rootContext;
        const cb = mockFn();
        const Foo = registerView(function ({ viewContext }) {
            cb(viewContext);
            return (<></>);
        }, { view: 'foo' });
        const Root = () => {
            rootContext = useViewContext();
            return (<div>{renderView(Foo)}</div>);
        };
        const { unmount } = render(<Root />);
        await app.navigate('/dummy/foo');
        expect(cb).toBeCalledTimes(1);

        const childContext = cb.mock.calls[0][0];
        expect(childContext.parent).toBe(rootContext);
        expect(rootContext.getChildren()).toEqual([childContext]);
        unmount();
    });

    it('should return last page info when the view is going to be unmounted', async () => {
        const cb = mockFn();
        const Foo = registerView(function ({ viewContext }) {
            useEffect(() => {
                return () => cb(viewContext.page, app.page);
            }, []);
            return (<></>);
        }, { view: 'foo' });
        const Bar = registerView(function () {
            return (<></>);
        }, { view: 'bar' })

        const { unmount } = render(<div>{renderView(Foo, Bar)}</div>)
        await app.navigate('/dummy/foo');

        const previousPage = app.page;
        await app.navigate('/dummy/bar');
        await delay();

        expect(app.page).not.toBe(previousPage);
        expect(cb).toBeCalledWith(previousPage, app.page);
        unmount();
    });

    it('should fire pagechange event when the same view is rendered for a newly navigated path', async () => {
        const cb = mockFn();
        const Foo = registerView(function ({ viewContext }) {
            useEffect(() => {
                return viewContext.on('pagechange', cb);
            }, []);
            return (<></>);
        }, { view: 'foo' });

        const { unmount } = render(<div>{renderView(Foo)}</div>)
        await app.navigate('/dummy/foo');

        const previousPage = app.page;
        await app.navigate('/dummy/foo/sub');
        expect(cb).toBeCalledWith(expect.objectContaining({
            type: 'pagechange',
            page: app.page,
            previousPage: previousPage,
            navigationType: 'navigate'
        }), _);
        unmount();
    });

    it('should fire pagechange event for root context', async () => {
        const cb = mockFn();
        const { result, unmount } = renderHook(() => useViewContext());
        cleanup(result.current.on('pagechange', cb));

        const previousPage = app.page;
        await app.navigate('/dummy/foo');
        expect(cb).toBeCalledWith(expect.objectContaining({
            type: 'pagechange',
            page: app.page,
            previousPage: previousPage,
            navigationType: 'navigate'
        }), _);
        unmount();
    });

    it('should not fire pagechange event when the view is going to be unmounted', async () => {
        const cb = mockFn();
        const Foo = registerView(function ({ viewContext }) {
            useEffect(() => {
                return viewContext.on('pagechange', cb);
            }, []);
            return (<></>);
        }, { view: 'foo' });
        const Bar = registerView(function () {
            return (<></>);
        }, { view: 'bar' })

        const { unmount } = render(<div>{renderView(Foo, Bar)}</div>)
        await app.navigate('/dummy/foo');

        const previousPage = app.page;
        await app.navigate('/dummy/bar');

        expect(app.page).not.toBe(previousPage);
        expect(cb).not.toBeCalled();
        unmount();
    });

    it('should fire pagechange event with correct navigation type', async () => {
        const cb = mockFn();
        const Foo = registerView(function ({ viewContext }) {
            useEffect(() => {
                return viewContext.on('pagechange', cb);
            }, []);
            return (<></>);
        }, { view: 'foo' });

        const { unmount } = render(<div>{renderView(Foo)}</div>)
        await app.navigate('/dummy/foo');
        await app.navigate('/dummy/foo/sub');

        const previousPage = app.page;
        await app.back();

        expect(cb).toHaveBeenLastCalledWith(expect.objectContaining({
            type: 'pagechange',
            page: app.page,
            previousPage: previousPage,
            navigationType: 'back_forward'
        }), _);
        unmount();
    });

    it('should defer navigation', async () => {
        await app.navigate('/dummy/foo');

        const pagechange = mockFn();
        const resolve = mockFn();
        const Foo = registerView(({ viewContext }) => {
            useEffect(() => {
                return viewContext.on('pagechange', function (e) {
                    pagechange();
                    e.waitFor(delay(100).then(() => {
                        expect(resolve).not.toBeCalled();
                        resolve('waitFor complete');
                    }));
                });
            });
            return <></>;
        }, { view: 'foo' });

        const { unmount } = render(<div>{renderView(Foo)}</div>);
        const promise = app.navigate('/dummy/foo/baz').then(() => {
            resolve('navigate complete');
        });

        await waitFor(() => expect(pagechange).toBeCalled());
        expect(resolve).not.toBeCalled();

        await promise;
        verifyCalls(resolve, [
            ['waitFor complete'],
            ['navigate complete']
        ]);
        unmount();
    });

    it('should set active property to false when container is unmounted', async () => {
        let context;
        const Foo = registerView(({ viewContext }) => {
            context = viewContext;
            return <div>foo</div>;
        }, { view: 'foo' });

        const { unmount } = render(<div>{renderView(Foo)}</div>);
        await screen.findByText('foo');

        expect(context.active).toBe(true);
        unmount();
        expect(context.active).toBe(false);
    });
});
