export type DialogCloseCallback<T> = (value?: T) => Promise<void>;

export interface DialogState<T> {
    /**
     * Gets the root element of the dialog.
     */
    readonly root: HTMLElement;
    /**
     * Opens the dialog.
     *
     * It will receive result from {@link DialogState.close} or {@link DialogRenderComponentProps.closeDialog} when the dialog is properly closed.
     * Otherwise in cases such as being closed due to lost of focus, result value will always be `undefined`.
     */
    open: () => Promise<T | undefined>;
    /**
     * Closes the dialog, with optional result value.
     *
     * This method is different from {@link DialogRenderComponentProps.closeDialog} that {@link DialogBaseProps.onCommit} will not be called.
     */
    close: (value?: T) => Promise<void>;
}

export interface DialogBaseProps<T, V = T> {
    /**
     * Specifies dialog title.
     * This property is intended to be handled by {@link DialogOptions.onRender} or {@link DialogOptions.wrapper}.
     */
    title?: string;
    /**
     * CSS class names to be added to root element.
     */
    className?: string;
    /**
     * Whether to show close button in the dialog.
     * This property is intended to be handled by {@link DialogOptions.onRender} or {@link DialogOptions.wrapper}.
     */
    showCloseButton?: boolean;
    /**
     * Whether confirmation should be prompted when user leaves the page.
     */
    preventLeave?: boolean;
    /**
     * Whether navigation within single-paged app should be prevented.
     */
    preventNavigation?: boolean;
    /**
     * Whether the dialog is modal.
     */
    modal?: boolean;
    /**
     * Whether flyout content will be initially focused.
     * Default is `true` if source element is not an text input element.
     *
     * If a CSS selector is given, the first matched element will be focused; otherwise
     * the first focusable element will be focused.
     */
    focus?: boolean | string;
    /**
     * Callback to perform asynchronous action when user confirms the dialog.
     *
     * The callback will receive value sent from {@link DialogRenderComponentProps.closeDialog},
     * and will send resolved value to promise returned by {@link DialogState.open}.
     *
     * The dialog will be held open until the returned promise resolves.
     * When the promise rejects, the dialog will remain open.
     */
    onCommit?: (value: V | undefined) => T | Promise<T> | void;
    /**
     * Callback to be invoked when dialog has opened.
     */
    onOpen?: (root: HTMLElement) => void;
    /**
     * Callback to be invoked when dialog has closed, after outro animation and before React DOM is unmounted.
     */
    onClose?: (root: HTMLElement) => void;
}

export interface DialogRenderComponentProps<T, V = T> extends DialogBaseProps<T, V> {
    /**
     * Commits the dialog, with optional result value.
     *
     * When {@link DialogBaseProps.onCommit} is specified, it is invoked with the value passed in.
     * Dialog will be closed when async operation is completed, or remain open if the operation failed.
     */
    closeDialog: (value?: V) => Promise<void>;
}

export interface DialogOptions<T, V = T> extends DialogBaseProps<T, V> {
    /**
     * A callback that render dialog contents.
     */
    onRender: React.FC<DialogRenderComponentProps<T, V> & this>;
    /**
     * Specifies wrapper component that envelops content from {@link DialogOptions.onRender},
     * which is useful for reusable layout for dialogs.
     */
    wrapper?: React.FC<React.PropsWithChildren<DialogRenderComponentProps<T, V> & this>>;
}

export interface DialogProps<T, V = T> extends React.PropsWithChildren<DialogBaseProps<T, V>> {
    /**
     * A boolean flag controlling whether dialog is open.
     */
    isOpen: boolean;
}

/**
 * Creates a controller to render dialog.
 * @param props A dictionary containing options.
 */
export function createDialog<T = any, V = T>(props: DialogOptions<T, V>): DialogState<T>;

/**
 * Renders a dialog declaratively.
 */
export function Dialog<T, V = T>(props: DialogProps<T, V>): JSX.Element;
