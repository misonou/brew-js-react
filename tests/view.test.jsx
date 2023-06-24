import React, { useEffect, useState } from "react";
import { act, render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useObservableProperty, useViewState } from "zeta-dom-react";
import { isViewMatched, linkTo, matchView, navigateTo, redirectTo, registerErrorView, registerView, renderView, useViewContainerState, useViewContext } from "src/view";
import { body, delay, mockFn, verifyCalls, _, cleanup } from "@misonou/test-utils";
import dom from "zeta-dom/dom";
import { addAnimateIn, addAnimateOut } from "brew-js/anim";
import { subscribeAsync } from "zeta-dom/domLock";
import initAppBeforeAll from "./harness/initAppBeforeAll";
import composeAct from "./harness/composeAct";

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

    it('should pass props to view container', async () => {
        const { asFragment } = render(<div>{renderView({ className: 'foo' }, Foo)}</div>)
        await screen.findByText('foo');
        expect(asFragment()).toMatchSnapshot();
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

    it('should not halt navigation when matched view is updated twice', async () => {
        const { rerender, unmount } = render(<div>{renderView(Foo, Bar)}</div>);
        await screen.findByText('foo');
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

    it('should catch and emit importing error', async () => {
        const error = new Error();
        const cb = mockFn();
        const BarError = registerView(async () => {
            throw error;
        }, { view: 'bar' });
        const { container, unmount } = render(<div>{renderView(BarError)}</div>);
        dom.on(container, 'error', cb);

        await delay();
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0].error).toBe(error);
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
        const { container } = render(<div>{renderView(BarError)}</div>);

        const cb = mockFn();
        dom.on(container, 'error', cb);
        await delay();
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0].error).toBe(error);
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
        const { container } = render(<div>{renderView(BarError)}</div>);
        await screen.findByText('bar');

        const cb = mockFn();
        dom.on(container, 'error', cb);
        await actAwaitSetImmediate(() => setError(new Error()));
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0].error).toBe(error);
    });

    it('should catch and render error view', async () => {
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
        const { container } = render(<div>{renderView(BarError)}</div>);
        await screen.findByText('bar');

        const error = new Error();
        const cb = mockFn();
        dom.on(container, 'error', cb);
        await actAwaitSetImmediate(() => obj.error = error);
        await screen.findByText('error');
        expect(cb).not.toBeCalled();
        expect(receivedProps).toMatchObject({
            view: BarError,
            error: error
        });

        obj.error = null;
        act(() => reset());
        await screen.findByText('bar');
    });

    it('should catch and emit rendering error thrown from error view', async () => {
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
        const { container, asFragment } = render(<div>{renderView(BarError)}</div>);
        await screen.findByText('error');

        const error = new Error();
        const cb = mockFn();
        dom.on(container, 'error', cb);
        await actAwaitSetImmediate(() => obj.error = error);
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0].error).toBe(error);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should notify asynchronous operation on view container', async () => {
        const cb = mockFn(() => screen.queryByText('foo'));
        const container = document.createElement('div');
        body.appendChild(container);
        dom.on(container, 'asyncStart', cb);
        dom.on(container, 'asyncEnd', cb);
        subscribeAsync(container);

        const { unmount } = render(<div>{renderView(Foo)}</div>, { container });
        const element = await screen.findByText('foo');
        verifyCalls(cb, [
            [expect.objectContaining({ type: 'asyncStart' }), _],
            [expect.objectContaining({ type: 'asyncEnd' }), _],
        ]);
        expect(cb.mock.results[0].value).toBe(null);
        expect(cb.mock.results[1].value).toBe(element);
        unmount();
    });

    it('should emit pageenter event after view component is rendered', async () => {
        const { container, unmount } = render(<div>{renderView(Foo)}</div>);
        const pageenter = mockFn(() => screen.queryByText('foo'));
        dom.on(container, 'pageenter', pageenter);

        const element = await screen.findByText('foo');
        expect(pageenter).toBeCalledTimes(1);
        expect(pageenter.mock.results[0].value).toBe(element);
        unmount();
    });

    it('should emit pageleave event before view component is unmounted', async () => {
        const { container, unmount } = render(<div>{renderView(Foo, Bar)}</div>);
        const pageleave = mockFn(() => screen.queryByText('foo'));
        dom.on(container, 'pageleave', pageleave);

        const element = await screen.findByText('foo');
        await actAwaitSetImmediate(() => app.navigate('/dummy/bar'));
        expect(pageleave).toBeCalledTimes(1);
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

        await navigateTo(BarTest, null, { text: 'BarTest' });
        await screen.findByText('BarTest');
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

        const promise = navigateTo(BarTest, null, { text: 'baz' });
        await app.navigate('/dummy/foo', true);
        await expect(promise).resolves.toMatchObject({ path: '/dummy/foo' });

        await app.navigate('/dummy/bar');
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });

    it('should clear view data when navigation is aborted', async () => {
        const BarTest = registerView(function Component({ viewData }) {
            return <div>{viewData.text || 'bar'}</div>;
        }, { view: 'bar' });
        const { asFragment, unmount } = render(<div>{renderView(Foo, BarTest)}</div>);
        await screen.findByText('foo');

        const promise = navigateTo(BarTest, null, { text: 'baz' });
        await app.navigate('/dummy/foo');
        await expect(promise).rejects.toBeTruthy();

        await app.navigate('/dummy/bar');
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });

    it('should retrieve view data when view container is mounted after navigation', async () => {
        const BarTest = registerView(function Component({ viewData }) {
            return <div>{viewData.text || 'bar'}</div>;
        }, { view: 'bar' });

        await app.navigate('/dummy/foo', false, { text: 'baz' });
        const { asFragment, unmount } = render(<div>{renderView(BarTest)}</div>);

        await screen.findByText('baz');
        expect(asFragment()).toMatchSnapshot();
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

    it('should pass data to view component', async () => {
        const BarTest = registerView(function Component({ viewData }) {
            return <div data-testid="test">{viewData.text}</div>;
        }, { view: 'bar' });
        const { asFragment, unmount } = render(<div>{renderView(Foo, BarTest)}</div>);
        await screen.findByText('foo');

        await navigateTo(BarTest, null, { text: 'BarTest' });
        await screen.findByTestId('test');
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

    it('should pass data to view component', async () => {
        const BarTest = registerView(function Component({ viewData }) {
            return <div data-testid="test">{viewData.text}</div>;
        }, { view: 'bar' });
        const { asFragment, unmount } = render(<div>{renderView(Foo, BarTest)}</div>);
        await screen.findByText('foo');

        await redirectTo(BarTest, null, { text: 'BarTest' });
        await screen.findByTestId('test');
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });
});

describe('useViewContainerState', () => {
    it('should return active outside view container', () => {
        const { result } = renderHook(() => useViewContainerState())
        expect(result.current).toMatchObject({ active: true });
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
        expect(fooResult).toMatchObject({ view: Foo, active: true });

        await actAwaitSetImmediate(() => app.navigate('/dummy/bar'));
        expect(fooResult.active).toBe(false);
        expect(barResultInFoo).toBeUndefined();
    });
});

describe('ViewContext', () => {
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
            previousPage
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
});
