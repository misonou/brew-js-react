import ClassNameMixin from "./ClassNameMixin";
import FlyoutToggleMixin from "./FlyoutToggleMixin";
import { AnimationEffect } from "./AnimateMixin";

export interface FlyoutMixinOptions {
    modal?: boolean;
    tabThrough?: boolean;
    swipeToDismiss?: 'up' | 'down' | 'left' | 'right';
}

export default class FlyoutMixin extends ClassNameMixin {
    readonly isFlyoutOpened: boolean;
    readonly animating: boolean;
    readonly visible: boolean;
    readonly toggle: FlyoutToggleMixin;
    modal: boolean;

    withEffects(...effects: AnimationEffect[]): this;
    onOpen(callback: (state: any) => void): Zeta.UnregisterCallback;
    onToggleState(callback: (state: boolean) => void): Zeta.UnregisterCallback;
    onVisibilityChanged(callback: (state: boolean) => void): Zeta.UnregisterCallback;
    open(state?: any): Promise<any>;
    close(state?: any): Promise<void>;
}
