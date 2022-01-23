import ClassNameMixin from "./ClassNameMixin";
import { AnimationEffect } from "./AnimateMixin";

export default class FlyoutMixin extends ClassNameMixin {
    readonly isFlyoutOpened: boolean;
    readonly animating: boolean;
    readonly visible: boolean;
    readonly toggle: ClassNameMixin;

    withEffects(...effects: AnimationEffect[]): this;
    onOpen(callback: () => void): Zeta.UnregisterCallback;
    onToggleState(callback: (state: boolean) => void): Zeta.UnregisterCallback;
    onVisibilityChanged(callback: (state: boolean) => void): Zeta.UnregisterCallback;
}
