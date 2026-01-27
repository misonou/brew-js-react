import { expectTypeOf } from "expect-type";
import { createDialog, DialogOptions, DialogOptionsStrict, DialogRenderComponentProps, DialogState, openDialog } from "src/dialog";
import { makeTranslation, Translate, Translation } from "src/i18n";
import { Mixin, MixinProps, StaticAttributeMixin } from "src/mixin";
import { navigateTo, registerView, ViewComponent, ViewProps } from "src/view";
import { Stringifiable } from "zeta-dom-react";

declare const ReactContent: JSX.Element;
declare const _: unknown;

type Func<T, R> = (value: T) => R;
type FuncOp<T, R> = (value?: T) => R;
type A = { a: number };
type B = { b: number };

// -------------------------------------
// dialog.d.ts

declare const onRender: React.VFC<{}>;
declare const onCommit: Func<any, any>;

// infer return type by explicit T (with onCommit)
expectTypeOf(createDialog<void>({ onRender, onCommit })).toEqualTypeOf<DialogState<void>>();
expectTypeOf(createDialog<undefined>({ onRender, onCommit })).toEqualTypeOf<DialogState<void>>();
expectTypeOf(createDialog<boolean>({ onRender, onCommit })).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog<boolean | undefined>({ onRender, onCommit })).toEqualTypeOf<DialogState<boolean>>();

// infer return type by explicit T (without onCommit)
expectTypeOf(createDialog<void>({ onRender })).toEqualTypeOf<DialogState<void>>();
expectTypeOf(createDialog<undefined>({ onRender })).toEqualTypeOf<DialogState<void>>();
expectTypeOf(createDialog<boolean>({ onRender })).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog<boolean | undefined>({ onRender })).toEqualTypeOf<DialogState<boolean>>();

// infer return type by explicit T and V (with onCommit)
expectTypeOf(createDialog<boolean, string>({ onRender, onCommit })).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog<boolean, void>({ onRender, onCommit })).toEqualTypeOf<DialogState<boolean>>();

// infer return type by explicit T and V (without onCommit)
expectTypeOf(createDialog<boolean, string>({ onRender })).toEqualTypeOf<DialogState<boolean | string>>();
expectTypeOf(createDialog<boolean, void>({ onRender })).toEqualTypeOf<DialogState<boolean>>();

// infer return type by onCommit
expectTypeOf(createDialog({ onRender, onCommit: <Func<boolean, void>>_ })).toEqualTypeOf<DialogState<void>>();
expectTypeOf(createDialog({ onRender, onCommit: <Func<boolean, string>>_ })).toEqualTypeOf<DialogState<string>>();
expectTypeOf(createDialog({ onRender, onCommit: <FuncOp<boolean, void>>_ })).toEqualTypeOf<DialogState<void>>();
expectTypeOf(createDialog({ onRender, onCommit: <FuncOp<boolean, string>>_ })).toEqualTypeOf<DialogState<string>>();

// infer return type by explicit optional onCommit
expectTypeOf(createDialog({ onRender, onCommit: <Func<boolean, void> | undefined>_ })).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog({ onRender, onCommit: <Func<boolean, string> | undefined>_ })).toEqualTypeOf<DialogState<boolean | string>>();
expectTypeOf(createDialog({ onRender, onCommit: <FuncOp<boolean, void> | undefined>_ })).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog({ onRender, onCommit: <FuncOp<boolean, string> | undefined>_ })).toEqualTypeOf<DialogState<boolean | string>>();

// infer return type by DialogOptions
expectTypeOf(createDialog(<DialogOptions<boolean>>_)).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog(<DialogOptions<boolean, void>>_)).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog(<DialogOptions<boolean, string>>_)).toEqualTypeOf<DialogState<boolean | string>>();
expectTypeOf(createDialog(<DialogOptionsStrict<boolean, void>>_)).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog(<DialogOptionsStrict<boolean, string>>_)).toEqualTypeOf<DialogState<boolean>>();

// infer return type by DialogRenderComponentProps
expectTypeOf(createDialog<boolean>({ onRender: (_1: DialogRenderComponentProps<boolean>) => ReactContent })).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog<boolean, void>({ onRender: (_1: DialogRenderComponentProps<boolean, void>) => ReactContent })).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog<boolean, string>({ onRender: (_1: DialogRenderComponentProps<boolean, string>) => ReactContent })).toEqualTypeOf<DialogState<boolean | string>>();
expectTypeOf(createDialog<boolean>({ onCommit, onRender: (_1: DialogRenderComponentProps<boolean>) => ReactContent })).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog<boolean, void>({ onCommit, onRender: (_1: DialogRenderComponentProps<boolean, void>) => ReactContent })).toEqualTypeOf<DialogState<boolean>>();
expectTypeOf(createDialog<boolean, string>({ onCommit, onRender: (_1: DialogRenderComponentProps<boolean, string>) => ReactContent })).toEqualTypeOf<DialogState<boolean | string>>();

// DialogState.open
expectTypeOf(createDialog<void>({ onRender }).open()).toEqualTypeOf<Promise<undefined>>();
expectTypeOf(createDialog<undefined>({ onRender }).open()).toEqualTypeOf<Promise<undefined>>();
expectTypeOf(createDialog<boolean>({ onRender }).open()).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(createDialog<unknown>({ onRender }).open()).toEqualTypeOf<Promise<any>>();

// DialogState.close
expectTypeOf(createDialog<void>({ onRender }).close()).toEqualTypeOf<Promise<void>>();
expectTypeOf(createDialog<boolean>({ onRender }).close()).toEqualTypeOf<Promise<void>>();
expectTypeOf(createDialog<boolean>({ onRender }).close(undefined)).toEqualTypeOf<Promise<void>>();
expectTypeOf(createDialog<boolean>({ onRender }).close(true)).toEqualTypeOf<Promise<void>>();
// @ts-expect-error: incorrect argument type
createDialog<boolean>({ onRender }).close("");

// DialogOptions
// @ts-check: backward compatibility - single type argument should imply optional commit argument
createDialog<boolean>({ ...<DialogOptions<boolean>>_ });

// infer argument type of onCommit from explicit T and V
// @ts-check: backward compatibility - single type argument should imply optional commit argument
createDialog<boolean>({
    onRender,
    onCommit(value) {
        expectTypeOf(value).toEqualTypeOf<boolean | undefined>();
    }
});
createDialog<void, boolean>({
    onRender,
    onCommit(value) {
        expectTypeOf(value).toEqualTypeOf<boolean>();
    }
});
createDialog<boolean, string>({
    onRender,
    onCommit(value) {
        expectTypeOf(value).toEqualTypeOf<string>();
        return true;
    }
});
createDialog<boolean, void>({
    onRender,
    onCommit(value) {
        expectTypeOf(value).toEqualTypeOf<void>();
        return true;
    }
});
createDialog<boolean, void>({
    onRender,
    // @ts-expect-error: incorrect type
    onCommit(value) {
        expectTypeOf(value).toEqualTypeOf<void>();
        return "true";
    }
});

// infer argument type of onRender (required onCommit)
createDialog({
    onCommit: <Func<boolean, void>>_,
    onRender(props) {
        props.commitDialog(true);
        // @ts-expect-error: expect parameter
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog("true");
        return ReactContent;
    }
});
createDialog({
    onCommit: <FuncOp<boolean, void>>_,
    onRender(props) {
        props.commitDialog(true);
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog("true");
        return ReactContent;
    }
});
createDialog({
    onCommit: <Func<void, void>>_,
    onRender(props) {
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog(true);
        return ReactContent;
    }
});
// @ts-check: commit argument can be any type if onCommit does not take arguments
createDialog({
    onCommit: <(() => true)>_,
    onRender(props) {
        props.commitDialog();
        props.commitDialog(true);
        props.commitDialog("true");
        return ReactContent;
    }
});
// @ts-check: backward compatibility - single type argument should imply optional commit argument
createDialog<boolean>({
    onCommit,
    onRender(props) {
        props.commitDialog(true);
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog("true");
        return ReactContent;
    }
});
createDialog<boolean, string>({
    onCommit,
    onRender(props) {
        props.commitDialog("");
        // @ts-expect-error: incorrect type
        props.commitDialog(true);
        return ReactContent;
    }
});
createDialog<boolean, void>({
    onCommit,
    onRender(props) {
        props.commitDialog(undefined);
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog(true);
        return ReactContent;
    }
});
createDialog<boolean, undefined>({
    onCommit,
    onRender(props) {
        props.commitDialog(undefined);
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog(true);
        return ReactContent;
    }
});

// infer argument type of onRender (optional onCommit)
createDialog({
    onCommit: <Func<boolean, void> | undefined>_,
    onRender(props) {
        props.commitDialog(true);
        // @ts-expect-error: expect parameter
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog("true");
        return ReactContent;
    }
});
createDialog({
    onCommit: <FuncOp<boolean, void> | undefined>_,
    onRender(props) {
        props.commitDialog(true);
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog("true");
        return ReactContent;
    }
});
createDialog({
    onCommit: <Func<void, void> | undefined>_,
    onRender(props) {
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog(true);
        return ReactContent;
    }
});
// @ts-check: commit argument can be any type if onCommit does not take arguments
createDialog({
    onCommit: <(() => true) | undefined>_,
    onRender(props) {
        props.commitDialog();
        props.commitDialog(true);
        props.commitDialog("true");
        return ReactContent;
    }
});
// @ts-check: commit argument can be any type if it's type cannot be inferred
createDialog({
    onRender(props) {
        props.commitDialog();
        props.commitDialog(true);
        props.commitDialog("true");
        return ReactContent;
    }
});
// @ts-check: backward compatibility - single type argument should imply optional commit argument
createDialog<boolean>({
    onRender(props) {
        props.commitDialog(true);
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog("true");
        return ReactContent;
    }
});
createDialog<boolean, string>({
    onRender(props) {
        props.commitDialog("");
        // @ts-expect-error: incorrect type
        props.commitDialog(true);
        return ReactContent;
    }
});
createDialog<boolean, void>({
    onRender(props) {
        props.commitDialog(undefined);
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog(true);
        return ReactContent;
    }
});
createDialog<boolean, undefined>({
    onRender(props) {
        props.commitDialog(undefined);
        props.commitDialog();
        // @ts-expect-error: incorrect type
        props.commitDialog(true);
        return ReactContent;
    }
});

// infer child property for wrapper
createDialog({
    onRender,
    wrapper(props) {
        expectTypeOf(props).toMatchTypeOf<React.PropsWithChildren<{}>>();
        return ReactContent;
    }
});

// infer properties from extended type
createDialog(<DialogOptions<boolean> & { extraProp: boolean }>{
    extraProp: true,
    wrapper(props) {
        expectTypeOf(props).toMatchTypeOf<{ extraProp: Boolean }>();
        return ReactContent;
    },
    onRender(props) {
        expectTypeOf(props).toMatchTypeOf<{ extraProp: Boolean }>();
        return ReactContent;
    }
});

// infer return type by explicit T (with onCommit)
expectTypeOf(openDialog<void>({ onRender, onCommit })).toEqualTypeOf<Promise<undefined>>();
expectTypeOf(openDialog<undefined>({ onRender, onCommit })).toEqualTypeOf<Promise<undefined>>();
expectTypeOf(openDialog<boolean>({ onRender, onCommit })).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog<boolean | undefined>({ onRender, onCommit })).toEqualTypeOf<Promise<boolean | undefined>>();

// infer return type by explicit T (without onCommit)
expectTypeOf(openDialog<void>({ onRender })).toEqualTypeOf<Promise<undefined>>();
expectTypeOf(openDialog<undefined>({ onRender })).toEqualTypeOf<Promise<undefined>>();
expectTypeOf(openDialog<boolean>({ onRender })).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog<boolean | undefined>({ onRender })).toEqualTypeOf<Promise<boolean | undefined>>();

// infer return type by explicit T and V (with onCommit)
expectTypeOf(openDialog<boolean, string>({ onRender, onCommit })).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog<boolean, void>({ onRender, onCommit })).toEqualTypeOf<Promise<boolean | undefined>>();

// infer return type by explicit T and V (without onCommit)
expectTypeOf(openDialog<boolean, string>({ onRender })).toEqualTypeOf<Promise<boolean | string | undefined>>();
expectTypeOf(openDialog<boolean, void>({ onRender })).toEqualTypeOf<Promise<boolean | undefined>>();

// infer return type by onCommit
expectTypeOf(openDialog({ onRender, onCommit: <Func<boolean, void>>_ })).toEqualTypeOf<Promise<undefined>>();
expectTypeOf(openDialog({ onRender, onCommit: <Func<boolean, string>>_ })).toEqualTypeOf<Promise<string | undefined>>();
expectTypeOf(openDialog({ onRender, onCommit: <FuncOp<boolean, void>>_ })).toEqualTypeOf<Promise<undefined>>();
expectTypeOf(openDialog({ onRender, onCommit: <FuncOp<boolean, string>>_ })).toEqualTypeOf<Promise<string | undefined>>();

// infer return type by explicit optional onCommit
expectTypeOf(openDialog({ onRender, onCommit: <Func<boolean, void> | undefined>_ })).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog({ onRender, onCommit: <Func<boolean, string> | undefined>_ })).toEqualTypeOf<Promise<boolean | string | undefined>>();
expectTypeOf(openDialog({ onRender, onCommit: <FuncOp<boolean, void> | undefined>_ })).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog({ onRender, onCommit: <FuncOp<boolean, string> | undefined>_ })).toEqualTypeOf<Promise<boolean | string | undefined>>();

// infer return type by DialogOptions
expectTypeOf(openDialog(<DialogOptions<boolean>>_)).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog(<DialogOptions<boolean, void>>_)).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog(<DialogOptions<boolean, string>>_)).toEqualTypeOf<Promise<boolean | string | undefined>>();
expectTypeOf(openDialog(<DialogOptionsStrict<boolean, void>>_)).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog(<DialogOptionsStrict<boolean, string>>_)).toEqualTypeOf<Promise<boolean | undefined>>();

// infer return type by DialogRenderComponentProps
expectTypeOf(openDialog<boolean>({ onRender: (_1: DialogRenderComponentProps<boolean>) => ReactContent })).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog<boolean, void>({ onRender: (_1: DialogRenderComponentProps<boolean, void>) => ReactContent })).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog<boolean, string>({ onRender: (_1: DialogRenderComponentProps<boolean, string>) => ReactContent })).toEqualTypeOf<Promise<boolean | string | undefined>>();
expectTypeOf(openDialog<boolean>({ onCommit, onRender: (_1: DialogRenderComponentProps<boolean>) => ReactContent })).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog<boolean, void>({ onCommit, onRender: (_1: DialogRenderComponentProps<boolean, void>) => ReactContent })).toEqualTypeOf<Promise<boolean | undefined>>();
expectTypeOf(openDialog<boolean, string>({ onCommit, onRender: (_1: DialogRenderComponentProps<boolean, string>) => ReactContent })).toEqualTypeOf<Promise<boolean | string | undefined>>();

// -------------------------------------
// i18n.d.ts

const translations = {
    en: {
        prefix1: { key1: '', key2: '' },
        prefix2: { key3: '', key4: '' },
    }
};

expectTypeOf((<Translate<'key1' | 'key2'>>_)('key1')).toEqualTypeOf<string>();
expectTypeOf((<Translate<'key1' | 'key2'>>_).html('key1')).toEqualTypeOf<{ __html: string }>();
expectTypeOf((<Translate<'key1' | 'key2'>>_).lazy('key1')).toEqualTypeOf<Stringifiable>();

// @ts-expect-error
(<Translate<'key1' | 'key2'>>_)('key3');
// @ts-expect-error
(<Translate<'key1' | 'key2'>>_).html('key3');
// @ts-expect-error
(<Translate<'key1' | 'key2'>>_).lazy('key3');

expectTypeOf((<Translation<'key1' | 'key2'>>_).t('key1')).toEqualTypeOf<string>();
expectTypeOf((<Translation<'key1' | 'key2'>>_).t.html('key1')).toEqualTypeOf<{ __html: string }>();
expectTypeOf((<Translation<'key1' | 'key2'>>_).t.lazy('key1')).toEqualTypeOf<Stringifiable>();

// @ts-expect-error
(<Translation<'key1' | 'key2'>>_).t('key3');
// @ts-expect-error
(<Translation<'key1' | 'key2'>>_).t.html('key3');
// @ts-expect-error
(<Translation<'key1' | 'key2'>>_).t.lazy('key3');

expectTypeOf(makeTranslation(translations, 'en').keys).parameter(0).toEqualTypeOf<'prefix1' | 'prefix2'>();

expectTypeOf(makeTranslation(translations, 'en').translate).toEqualTypeOf<Translate<'prefix1.key1' | 'prefix1.key2' | 'prefix2.key3' | 'prefix2.key4'>>();

expectTypeOf(makeTranslation(translations, 'en').getTranslation()).toEqualTypeOf<Translate<'prefix1.key1' | 'prefix1.key2' | 'prefix2.key3' | 'prefix2.key4'>>();
expectTypeOf(makeTranslation(translations, 'en').getTranslation('prefix1')).toEqualTypeOf<Translate<'key1' | 'key2'>>();

expectTypeOf(makeTranslation(translations, 'en').useTranslation()).toEqualTypeOf<Translation<'prefix1.key1' | 'prefix1.key2' | 'prefix2.key3' | 'prefix2.key4'>>();
expectTypeOf(makeTranslation(translations, 'en').useTranslation('prefix1')).toEqualTypeOf<Translation<'key1' | 'key2'>>();

// @ts-expect-error
makeTranslation(translations, 'de');

// -------------------------------------
// mixin.d.ts

declare const fooMixin: StaticAttributeMixin<{ foo: string }>;
declare const barMixin: StaticAttributeMixin<{ bar: string }>;

expectTypeOf(Mixin.use(fooMixin)).toEqualTypeOf<MixinProps<Element, typeof fooMixin>>();
expectTypeOf(Mixin.use('ref', fooMixin)).toEqualTypeOf<MixinProps<Element, typeof fooMixin>>();
expectTypeOf(Mixin.use(<React.Ref<HTMLDivElement>>_, fooMixin)).toEqualTypeOf<MixinProps<HTMLDivElement, typeof fooMixin>>();
expectTypeOf(Mixin.use(<React.Ref<HTMLDivElement>>_, fooMixin, barMixin, "", undefined)).toEqualTypeOf<MixinProps<HTMLDivElement, typeof fooMixin | typeof barMixin>>();

expectTypeOf(<MixinProps<HTMLDivElement, typeof fooMixin | typeof barMixin>>_).toMatchTypeOf<MixinProps<HTMLDivElement, never>>();
expectTypeOf(<MixinProps<HTMLDivElement, typeof fooMixin | typeof barMixin>>_).toMatchTypeOf<Record<'foo' | 'bar', string>>();

expectTypeOf(new StaticAttributeMixin('foo').getCustomAttributes()).toEqualTypeOf<{ foo: any }>();
expectTypeOf(new StaticAttributeMixin({ foo: 'value' }).getCustomAttributes()).toEqualTypeOf<{ foo: string }>();

new StaticAttributeMixin<{ foo: string }>('foo', 'value');
new StaticAttributeMixin<{ foo: string }>({ foo: 'value' });
// @ts-expect-error
new StaticAttributeMixin<{ foo: string }>();
// @ts-expect-error
new StaticAttributeMixin<{ foo: string }>('a', 'value');

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
