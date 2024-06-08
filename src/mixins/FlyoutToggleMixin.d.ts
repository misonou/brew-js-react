import ClassNameMixin from "./ClassNameMixin";
import FlyoutMixin from "./FlyoutMixin";

/**
 * Enables applied element as toggle buttons for the associated flyout.
 *
 * Instances of this mixin is exposed by {@link FlyoutMixin.toggle}.
 */
export default class FlyoutToggleMixin extends ClassNameMixin {
    /**
     * Specifies the condition on when the flyout should toggle. It can be either:
     *
     * - `click`: flyout is toggled when applied element is clicked;
     * - `focus`: flyout is opened or closed when applied element has gained or lost focus.
     *
     * Default behavior is `click`.
     *
     * @param trigger Condition of trigger.
     */
    on(trigger: 'focus' | 'click'): this;
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
    /**
     * Toggles the associated flyout.
     * @param source Source element which triggered the flyout.
     * @returns A promise that resolves when the flyout is being closed.
     */
    toggle(source?: Element): Promise<any>;
}
