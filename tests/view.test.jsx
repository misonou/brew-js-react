import React from "react";
import { act, render, screen } from "@testing-library/react";
import { useObservableProperty, useViewState } from "zeta-dom-react";
import { isViewMatched, linkTo, matchView, navigateTo, redirectTo, registerView, renderView } from "src/view";
import { delay, mockFn, verifyCalls } from "@misonou/test-utils";
import dom from "zeta-dom/dom";
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
                return (<div>foo</div>)
            }
        }
    }, { view: 'foo' })

    Bar = registerView(async () => {
        return {
            default: () => {
                return (<div>bar</div>)
            }
        }
    }, { view: 'bar' })

    Baz = registerView(async () => {
        return {
            default: () => {
                return (<div>baz</div>)
            }
        }
    }, { view: 'foo', baz: /./ })

    BarBaz = registerView(async () => {
        return {
            default: () => {
                return (<div>b_a_r_b_a_z</div>)
            }
        }
    }, { view: 'bar', remainingSegments: '/baz' })

    Test = registerView(async () => {
        return {
            default: () => {
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
        const obj = { error: null };
        const BarError = registerView(async () => {
            return {
                default: () => {
                    const error = useObservableProperty(obj, 'error');
                    if (error) {
                        throw error;
                    }
                    return (<div>bar</div>);
                }
            }
        }, { view: 'bar' });
        const { container } = render(<div>{renderView(BarError)}</div>);
        await screen.findByText('bar');

        const error = new Error();
        const cb = mockFn();
        dom.on(container, 'error', cb);
        await actAwaitSetImmediate(() => obj.error = error);
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0].error).toBe(error);
    });

    it('should catch and emit rendering error for view component registered without import', async () => {
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
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0].error).toBe(error);
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
});
