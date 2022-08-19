import React from "react";
import Mixin from "./Mixin";

interface MixinState {
    element: HTMLElement | null;
    ref?: MixinRef;
}

export interface MixinRef<T extends StatefulMixin = StatefulMixin> { }

export default abstract class StatefulMixin extends Mixin {
    get ref(): MixinRef<typeof this>;
    protected get state(): MixinState;

    reset(): this;
    next(): this;
    getRef(): React.RefCallback<HTMLElement>;
    elements(): HTMLElement[];
    onDispose(callback: Zeta.UnregisterCallback): void;

    protected initState(): MixinState;
    protected initElement(element: HTMLElement, state: MixinState): void;
    protected clone(): this;
}
