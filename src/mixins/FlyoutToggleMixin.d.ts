import ClassNameMixin from "./ClassNameMixin";
import FlyoutMixin from "./FlyoutMixin";

/**
 * Enables applied element as toggle buttons for the associated flyout.
 *
 * Instances of this mixin is exposed by {@link FlyoutMixin.toggle}.
 */
export default class FlyoutToggleMixin extends ClassNameMixin {
    /**
     * Opens the associated flyout.
     * @param state Value to be sent to listener added by {@link FlyoutMixin.onOpen}.
     * @param source Source element that triggered the flyout.
     * @returns A promise that resolves when the flyout is being closed.
     */
    open(state?: any, source?: Element): Promise<any>;
    /**
     * Closes the associated flyout.
     * @param state Value to be sent to the promise returned by {@link FlyoutMixin.open}.
     * @returns A promise that resolves after closing animation completes.
     */
    close(state?: any): Promise<void>;
}
