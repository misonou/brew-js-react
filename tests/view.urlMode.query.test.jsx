import { useObservableProperty, useViewState } from "zeta-dom-react";
import { linkTo, registerView } from "src/view";
import { _ } from "@misonou/test-utils";
import initAppBeforeAll from "./harness/initAppBeforeAll";

function serializeQueryString(params) {
    return location.pathname + '?' + new URLSearchParams(params).toString();
}

const app = initAppBeforeAll(app => {
    app.useRouter({
        urlMode: 'query',
        queryParam: 'path',
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

describe('linkTo', () => {
    it('should return path that will render specified view with params', () => {
        expect(linkTo(Foo, { baz: 'baz' })).toBe(serializeQueryString({ path: '/dummy/foo' }));
        expect(linkTo(Baz, { baz: 'baz' })).toBe(serializeQueryString({ path: '/dummy/foo/baz' }));
        expect(linkTo(Bar, { remainingSegments: '/buzz' })).toBe(serializeQueryString({ path: '/dummy/bar/buzz' }));
        expect(linkTo(BarBaz)).toBe(serializeQueryString({ path: '/dummy/bar/baz' }));
        expect(linkTo(Test, { params1: 'baz' })).toBe(serializeQueryString({ path: '/dummy/test/a/baz' }));
        expect(linkTo(Test, { params1: 'baz', params2: 'bee' })).toBe(serializeQueryString({ path: '/dummy/test/a/baz/bee' }));
        expect(linkTo(Test, { params3: 'baz' })).toBe(serializeQueryString({ path: '/dummy/test/b/baz' }));
        expect(linkTo(Var1, { var2: 'xxx' })).toBe(serializeQueryString({ path: '/var1' }));
    });

    it('should return minimum path matching the specified view', async () => {
        await app.navigate('/dummy/foo/baz');
        expect(linkTo(Foo)).toBe(serializeQueryString({ path: '/dummy/foo' }));
        await app.navigate('/dummy/bar/baz');
        expect(linkTo(Bar)).toBe(serializeQueryString({ path: '/dummy/bar' }));
    });

    it('should return path with remaining segments normalized', async () => {
        expect(linkTo(Bar, { remainingSegments: 'buzz' })).toBe(serializeQueryString({ path: '/dummy/bar/buzz' }));
    });

    it('should return path without remaining segments if matched route does not allow', async () => {
        expect(linkTo(Baz, { baz: 'baz', remainingSegments: '/buzz' })).toBe(serializeQueryString({ path: '/dummy/foo/baz' }));
    });

    it('should not override constant parameters passed to registerView', async () => {
        const BazNull = registerView(() => (<div></div>), { view: 'foo', baz: null });
        const BarBazNull = registerView(() => (<div></div>), { view: 'bar', remainingSegments: null });

        expect(linkTo(Foo, { view: 'bar' })).toBe(serializeQueryString({ path: '/dummy/foo' }));
        expect(linkTo(BazNull, { baz: 'baz' })).toBe(serializeQueryString({ path: '/dummy/foo' }));
        expect(linkTo(BarBaz, { remainingSegments: '/buzz' })).toBe(serializeQueryString({ path: '/dummy/bar/baz' }));
        expect(linkTo(BarBazNull, { remainingSegments: '/buzz' })).toBe(serializeQueryString({ path: '/dummy/bar' }));
    });

    it('should return root path for views not being registered', () => {
        function Component() {
            return <></>;
        }
        expect(linkTo(Component)).toBe(serializeQueryString({ path: '/' }));
    });
});
