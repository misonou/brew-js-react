import { expectTypeOf } from "expect-type";
import { navigateTo, registerView, ViewComponent, ViewProps } from "src/view";

declare const ReactContent: JSX.Element;
declare const _: unknown;

type A = { a: number };
type B = { b: number };

// -------------------------------------
// view.d.ts

expectTypeOf(registerView(() => ReactContent, {})).toEqualTypeOf<ViewComponent<{}>>();
expectTypeOf(registerView(() => ReactContent, {})).not.toEqualTypeOf<ViewComponent<A>>();
expectTypeOf(registerView((_1: ViewProps<A>) => ReactContent, {})).toEqualTypeOf<ViewComponent<A>>();
expectTypeOf(registerView((_1: ViewProps<A>) => ReactContent, {})).not.toEqualTypeOf<ViewComponent<B>>();

expectTypeOf(registerView(() => <Promise<{ default: (() => JSX.Element) }>>_, {})).toEqualTypeOf<ViewComponent<{}>>();
expectTypeOf(registerView(() => <Promise<{ default: (() => JSX.Element) }>>_, {})).not.toEqualTypeOf<ViewComponent<A>>();
expectTypeOf(registerView(() => <Promise<{ default: ((_1: ViewProps<A>) => JSX.Element) }>>_, {})).toEqualTypeOf<ViewComponent<A>>();
expectTypeOf(registerView(() => <Promise<{ default: ((_1: ViewProps<A>) => JSX.Element) }>>_, {})).not.toEqualTypeOf<ViewComponent<B>>();

registerView<ViewProps<A>>(props => {
    expectTypeOf(props.viewData).toEqualTypeOf<Readonly<Partial<A>>>();
    return ReactContent;
}, {});

navigateTo(<ViewComponent<A>>_, null, { a: 1 });
// @ts-expect-error
navigateTo(<ViewComponent<A>>_, null, { a: "str" });
// @ts-expect-error
navigateTo(<ViewComponent<A>>_, null, { b: 1 });
