import React from "react";
import { ClassName, ClassNameProvider } from "zeta-dom-react";
import StaticAttributeMixin from "./StaticAttributeMixin";

interface MixinProps {
    ref: React.RefCallback<Element>;
    className: string;
}

export default abstract class Mixin implements ClassNameProvider {
    static readonly scrollableTarget: StaticAttributeMixin;

    /**
     * Applies React ref and mixins to element.
     * @param ref A ref callback or ref object.
     * @param args Mixin instances or string literals. String literals are applied to element as CSS classes.
     */
    static use(ref: React.ForwardedRef<any>, ...args: (Mixin | string | undefined)[]): MixinProps;
    /**
     * Applies mixins to element.
     * @param mixin Mixin instance.
     * @param args Mixin instances or string literals. String literals are applied to element as CSS classes.
     */
    static use(mixin: Mixin, ...args: (Mixin | string | undefined)[]): MixinProps;
    /**
     * Applies mixins to element.
     * @param mixins Mixin instances.
     */
    static use(...mixins: (Mixin | undefined)[]): MixinProps;

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
    getCustomAttributes(): Zeta.Dictionary<string>;
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
