import ClassNameMixin from "./ClassNameMixin";
import FlyoutToggleMixin from "./FlyoutToggleMixin";
import { AnimationEffect } from "./AnimateMixin";

export interface FlyoutMixinOptions {
    /**
     * Whether flyout is modal.
     */
    modal?: boolean;
    /**
     * Whether flyout should lose focus when user presses `tab` key.
     */
    tabThrough?: boolean;
    /**
     * Enables swipe gesture to close the flyout.
     */
    swipeToDismiss?: 'up' | 'down' | 'left' | 'right';
}

export default class FlyoutMixin extends ClassNameMixin {
    /**
     * Gets whether the flyout is open.
     */
    readonly isFlyoutOpened: boolean;
    /**
     * Gets whether the flyout is animating.
     */
    readonly animating: boolean;
    /**
     * Gets whether the flyout is visible.
     * Note that flyout is still considered visible before closing animation completes.
     */
    readonly visible: boolean;
    /**
     * Gets a {@link FlyoutToggleMixin} object that when applied to an element,
     * clicking that element will toggle the flyout.
     */
    readonly toggle: FlyoutToggleMixin;
    /**
     * Gets or sets whether the flyout is modal.
     */
    modal: boolean;

    /**
     * Specifies animating effects for the flyout.
     * @param effects One or more predefined effects.
     * @see {@link AnimationEffect}.
     */
    withEffects(...effects: AnimationEffect[]): this;
    /**
     * Adds a listener to handle the opening of the flyout.
     * @param callback Callback to be called, receiving value passed to {@link FlyoutMixin.open}.
     */
    onOpen(callback: (state: any) => void): Zeta.UnregisterCallback;
    /**
     * Adds a listener to monitor the opening and closing of the flyout.
     * It differs from {@link FlyoutMixin.onVisibilityChanged} that the callback is called immediately when the flyout is being closed.
     * @param callback Callback to be called.
     */
    onToggleState(callback: (state: boolean) => void): Zeta.UnregisterCallback;
    /**
     * Adds a listener to monitor the change of visibility of the flyout.
     * It differs from {@link FlyoutMixin.onToggleState} that the callback is called after closing animation completes.
     * @param callback Callback to be called.
     */
    onVisibilityChanged(callback: (state: boolean) => void): Zeta.UnregisterCallback;
    /**
     * Opens the flyout.
     * @param state Value to be sent to listener added by {@link FlyoutMixin.onOpen}.
     * @returns A promise that resolves when the flyout is being closed.
     */
    open(state?: any): Promise<any>;
    /**
     * Closes the flyout.
     * @param state Value to be sent to the promise returned by {@link FlyoutMixin.open}.
     * @returns A promise that resolves after closing animation completes.
     */
    close(state?: any): Promise<void>;
}
