import React from "react";
import { ClassName, ClassNameProvider } from "zeta-dom-react";
import StaticAttributeMixin from "./StaticAttributeMixin";

export type MixinProps<T extends Element, M> = MixinDefaultProps<T> & UnionToIntersection<M extends CustomAttributeProvider<infer P> ? P : never>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type MixinTypes<T extends readonly unknown[]> = Extract<Zeta.ArrayMember<T>, CustomAttributeProvider>;

interface MixinDefaultProps<T extends Element> {
    ref: React.RefCallback<T>;
    className: string;
}

interface CustomAttributeProvider<T = {}> {
    getCustomAttributes(): T;
}

export default abstract class Mixin implements ClassNameProvider {
    static readonly scrollableTarget: StaticAttributeMixin<Record<'scrollable-target', string>>;
    static readonly tabRoot: StaticAttributeMixin<Record<'tab-root', string>>;

    /**
     * Applies React ref and mixins to element.
     * @param ref A ref callback or ref object.
     * @param args Mixin instances or string literals. String literals are applied to element as CSS classes.
     */
    static use<T extends Element, M extends readonly (Mixin | string | undefined)[]>(ref: React.ForwardedRef<T>, ...args: M): MixinProps<T, MixinTypes<M>>;
    /**
     * Applies mixins to element.
     * @param args Mixin instances or string literals. String literals are applied to element as CSS classes.
     */
    static use<M extends readonly (Mixin | string | undefined)[]>(...args: M): MixinProps<Element, MixinTypes<M>>;

    /**
     * @private Internal use.
     */
    reset(): this;
    /**
     * @private Internal use.
     */
    next(): this;
    /**
     * @private Internal use.
     */
    getRef(): React.RefCallback<Element>;
    /**
     * Override this method to apply class names to element.
     */
    getClassNames(): ClassName[];
    /**
     * Override this method to apply custom attributes to element.
     */
    getCustomAttributes(): {};
    /**
     * @private Internal use.
     */
    dispose(): void;

    /**
     * Watches a property on the object.
     * @param prop Property name.
     * @param handler Callback to be fired and the property is changed.
     * @param fireInit Optionally fire the handler immediately.
     */
    watch<P extends keyof this>(prop: P, handler?: (this: this, newValue: this[P], oldValue: this[P], prop: P, obj: this) => void, fireInit?: boolean): Zeta.UnregisterCallback;
    /**
     * Watches a property and resolves when the property is changed.
     * @param prop Property name.
     * @param handler Callback to be fired when the property is changed.
     */
    watchOnce<P extends keyof this>(prop: P, handler?: (this: this, newValue: this[P], oldValue: this[P], prop: P, obj: this) => void): Promise<this[P]>;
}
