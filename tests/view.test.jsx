import React from "react";
import { render, screen } from "@testing-library/react";
import { linkTo, registerView, renderView } from "src/view";
import { initApp } from "./testUtil";

/** @type {Brew.AppInstance<Brew.WithRouter>} */
let app;
/** @type {import("src/view").ViewComponent<{}>} */
let Foo;
/** @type {import("src/view").ViewComponent<{}>} */
let Bar;

beforeAll(async () => {
    app = await initApp(app => {
        app.useRouter({
            baseUrl: '/',
            routes: [
                '/{view:foo}/{baz?}',
                '/{view}/*',
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
});

beforeEach(async () => {
    await app.navigate(app.initialPath);
});

describe('renderView', () => {
    it('should render matched view', async () => {
        await app.navigate('/bar');
        const { asFragment } = render(<div>{renderView(Foo, Bar)}</div>)
        await screen.findByText('bar');
        expect(asFragment()).toMatchSnapshot();
    });

    it('should cause redirection to the first match view if none was matched', async () => {
        const { asFragment } = render(<div>{renderView(Foo, Bar)}</div>)
        await screen.findByText('foo');
        expect(asFragment()).toMatchSnapshot();
        expect(app.path).toBe('/foo');
    });

    it('should pass props to view container', async () => {
        const { asFragment } = render(<div>{renderView({ className: 'foo' }, Foo)}</div>)
        await screen.findByText('foo');
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('linkTo', () => {
    it('should return path that will render specified view with params', () => {
        expect(linkTo(Foo, { baz: 'baz' })).toBe('/foo/baz');
    });
});
