import ClassNameMixin from "./ClassNameMixin";

export default class FlyoutToggleMixin extends ClassNameMixin {
    /**
     * Opens the associated flyout.
     * @param state Value to be sent to listener added by {@link FlyoutMixin.onOpen}.
     * @returns A promise that resolves when the flyout is being closed.
     */
    open(state?: any): Promise<any>;
    /**
     * Closes the associated flyout.
     * @param state Value to be sent to the promise returned by {@link FlyoutMixin.open}.
     * @returns A promise that resolves after closing animation completes.
     */
    close(state?: any): Promise<void>;
}
