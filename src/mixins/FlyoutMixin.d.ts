import ClassNameMixin from "./ClassNameMixin";
import FlyoutToggleMixin from "./FlyoutToggleMixin";
import Mixin from "./Mixin";
import { AnimationEffect } from "./AnimateMixin";
import { useFlyoutMixin } from "../mixin";

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
    /**
     * Whether flyout content, or what element, by specifying CSS selector, will be initially focused.
     * Default is `true` if source element is not an text input element.
     */
    initialFocus?: boolean | string;
    /**
     * Whether the flyout should be closed when flyout, or source element if given, loses focus.
     * Default is `true` if flyout is not dismissible by swipe gesture.
     */
    closeOnBlur?: boolean;
}

/**
 * Provides methods controlling the applied element as a flyout.
 *
 * Mixin should be created using {@link useFlyoutMixin} and applied to element by {@link Mixin.use}.
 */
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
     * Whether flyout content, or what element, by specifying CSS selector, will be initially focused.
     * Default is `true` if source element is not an text input element.
     */
    initialFocus: boolean | string;
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
     * @param source Source element that triggered the flyout.
     * @returns A promise that resolves when the flyout is being closed.
     */
    open(state?: any, source?: Element): Promise<any>;
    /**
     * Closes the flyout.
     * @param state Value to be sent to the promise returned by {@link FlyoutMixin.open}.
     * @returns A promise that resolves after closing animation completes.
     */
    close(state?: any): Promise<void>;
}
