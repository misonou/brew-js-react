import ClassNameMixin from "./ClassNameMixin";
import FlyoutToggleMixin from "./FlyoutToggleMixin";
import { AnimationEffect } from "./AnimateMixin";

export interface FlyoutMixinOptions {
    modal?: boolean;
    swipeToDismiss?: Zeta.Direction;
}

export default class FlyoutMixin extends ClassNameMixin {
    readonly isFlyoutOpened: boolean;
    readonly animating: boolean;
    readonly visible: boolean;
    readonly toggle: ClassNameMixin;
    modal: boolean;

    withEffects(...effects: AnimationEffect[]): this;
    onOpen(callback: () => void): Zeta.UnregisterCallback;
    onToggleState(callback: (state: boolean) => void): Zeta.UnregisterCallback;
    onVisibilityChanged(callback: (state: boolean) => void): Zeta.UnregisterCallback;
}
