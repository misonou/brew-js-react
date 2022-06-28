import React from "react";
import { render, screen } from "@testing-library/react";
import { isViewMatched, linkTo, registerView, renderView } from "src/view";
import { initApp, mockFn, verifyCalls } from "./testUtil";
import { async } from "regenerator-runtime";

/** @type {Brew.AppInstance<Brew.WithRouter>} */
let app;
/** @type {import("src/view").ViewComponent<{}>} */
let Foo;
/** @type {import("src/view").ViewComponent<{}>} */
let Bar;
/** @type {import("src/view").ViewComponent<{}>} */
let Baz;
/** @type {import("src/view").ViewComponent<{}>} */
let Test;

let bazCallback = mockFn(v => v === 'baz');

beforeAll(async () => {
    app = await initApp(app => {
        app.useRouter({
            baseUrl: '/',
            routes: [
                '/{dummy}/{view:test}/a/{params1?}/{params2?}',
                '/{dummy}/{view:test}/b/{params3?}',
                '/{dummy}/{view:foo}/{baz?}',
                '/{dummy}/{view}/*',
                '/{dummy}',
                '/*'
            ]
        });
    });

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

    Test = registerView(async () => {
        return {
            default: () => {
                return (<div>test</div>)
            }
        }
    }, { view: 'test' });
});

beforeEach(async () => {
    await app.navigate('/dummy');
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
    });

    it('should not trigger redirection when app is about to navigate', async () => {
        const Component = function ({ view }) {
            return renderView(view);
        };
        const promise = app.navigate('/dummy/bar');
        const { rerender } = render(<Component view={Foo} />);
        rerender(<Component view={Bar} />);

        await expect(promise).resolves.toBeTruthy();
        expect(app.path).toBe('/dummy/bar');
    });
});

describe('linkTo', () => {
    it('should return path that will render specified view with params', () => {
        expect(linkTo(Foo, { baz: 'baz' })).toBe('/dummy/foo/baz');
        expect(linkTo(Test, { params1: 'baz' })).toBe('/dummy/test/a/baz');
        expect(linkTo(Test, { params1: 'baz', params2: 'bee' })).toBe('/dummy/test/a/baz/bee');
        expect(linkTo(Test, { params3: 'baz' })).toBe('/dummy/test/b/baz');
    });

    it('should return minimum path matching the specified view', async () => {
        await app.navigate('/dummy/foo/baz');
        expect(linkTo(Foo)).toBe('/dummy/foo');
    });
});
