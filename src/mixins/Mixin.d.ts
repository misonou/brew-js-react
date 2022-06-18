import React from "react";
import { ClassName, ClassNameProvider } from "zeta-dom-react";
import StaticAttributeMixin from "./StaticAttributeMixin";

interface MixinProps {
    ref: React.RefCallback<Element>;
    className: string;
}

export default abstract class Mixin implements ClassNameProvider {
    static readonly scrollableTarget: StaticAttributeMixin;

    static readonly use(ref: React.ForwardedRef<any>, ...args: (Mixin | string | undefined)[]): MixinProps;
    static readonly use(ref: Mixin, ...args: (Mixin | string | undefined)[]): MixinProps;
    static readonly use(...args: (Mixin | undefined)[]): MixinProps;

    /**
     * @private Internal use.
     */
    next(): this;
    /**
     * @private Internal use.
     */
    getRef(): React.RefCallback<Element>;
    /**
     * @private Internal use.
     */
    getClassNames(): ClassName[];
    /**
     * @private Internal use.
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
