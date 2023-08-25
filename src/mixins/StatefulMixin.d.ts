import React from "react";
import Mixin from "./Mixin";

interface MixinState {
    element: HTMLElement | null;
    ref?: MixinRef;
}

export interface MixinRef<T extends StatefulMixin = StatefulMixin> { }

export default abstract class StatefulMixin<T extends MixinState = MixinState> extends Mixin {
    get ref(): MixinRef<typeof this>;
    protected get state(): MixinState;

    reset(): this;
    next(): this;
    getRef(): React.RefCallback<HTMLElement>;
    elements(): HTMLElement[];
    onDispose(callback: Zeta.UnregisterCallback): void;

    protected initState(): T;
    protected initElement(element: HTMLElement, state: T): void;
    protected clone(): this;
}
