import { ErrorHandler } from "zeta-dom-react";

type PartialRequired<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] }
type VoidOrOptional<T> = [Exclude<T, undefined | void>] extends [never] ? void : Exclude<T, undefined | void>;

export type DialogCloseCallback<T> = Zeta.IsAnyOrUnknown<T> extends true ?
    (value?: any) => Promise<void> :
    (value: T extends undefined ? void | undefined : T) => Promise<void>;
export type DialogResult<T> = T extends void ? undefined : Zeta.IsAnyOrUnknown<T> extends true ? any : T | undefined;
export type DialogOptionsStrict<T, V> = PartialRequired<DialogOptions<T, V>, 'onCommit'>;

/** @deprecated */
export type DialogBaseProps<T, V = T> = Omit<DialogOptions<T, V | undefined>, 'onRender' | 'wrapper'>;
/** @deprecated */
export type DialogRenderComponentProps<T, V = T> = DialogOptions<T, V | undefined> & DialogContext<V | undefined>;

export interface DialogState<T> {
    /**
     * Gets the root element of the dialog.
     */
    readonly root: HTMLElement;
    /**
     * Opens the dialog.
     *
     * It will receive result from {@link DialogState.close} or {@link DialogContext.closeDialog} when the dialog is properly closed.
     * Otherwise in cases such as being closed due to lost of focus, result value will always be `undefined`.
     */
    open(): Promise<DialogResult<T>>;
    /**
     * Closes the dialog, with optional result value.
     *
     * This method is similar to {@link DialogContext.dismissDialog} that {@link DialogOptions.onCommit} will not be called.
     */
    close(value?: T): Promise<void>;
}

export interface DialogOptions<T, V = T | undefined> {
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
     * The callback will receive value sent from {@link DialogContext.commitDialog} or {@link DialogContext.closeDialog},
     * and will send resolved value to promise returned by {@link DialogState.open}.
     *
     * The dialog will be held open until the returned promise resolves.
     * When the promise rejects, the dialog will remain open.
     */
    onCommit?: (value: V, context: Zeta.RunAsyncContext) => T | Promise<T> | undefined | void;
    /**
     * Callback to be invoked when dialog has opened.
     */
    onOpen?: (root: HTMLElement) => void;
    /**
     * Callback to be invoked when dialog has closed, after outro animation and before React DOM is unmounted.
     */
    onClose?: (root: HTMLElement) => void;
    /**
     * A callback that render dialog contents.
     */
    onRender: React.VFC<DialogContext<V> & this>;
    /**
     * Specifies wrapper component that envelops content from {@link DialogOptions.onRender},
     * which is useful for reusable layout for dialogs.
     */
    wrapper?: React.FC<DialogContext<V> & this & React.PropsWithChildren<{}>>;
}

export interface DialogContext<V> {
    /**
     * Gets an {@link ErrorHandler} object that catches errors emitted from rendered content.
     */
    errorHandler: ErrorHandler;
    /**
     * Commits the dialog with result value.
     *
     * When {@link DialogOptions.onCommit} is specified, it is invoked with the value passed in.
     * Dialog will be closed when async operation is completed, or remain open if the operation failed.
     *
     * @deprecated Alias of {@link DialogContext.commitDialog}.
     */
    closeDialog: DialogCloseCallback<V>;
    /**
     * Commits the dialog with result value.
     *
     * When {@link DialogOptions.onCommit} is specified, it is invoked with the value passed in.
     * Dialog will be closed when async operation is completed, or remain open if the operation failed.
     */
    commitDialog: DialogCloseCallback<V>;
    /**
     * Closes the dialog without invoking {@link DialogOptions.onCommit}.
     */
    dismissDialog: DialogCloseCallback<void>;
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
export function createDialog<T, V>(props: DialogOptionsStrict<T, V>): DialogState<VoidOrOptional<T>>;

export function createDialog<T, V>(props: DialogOptions<T, V>): DialogState<VoidOrOptional<T | V>>;

export function createDialog<T, V = T>(props: DialogOptions<T, V | undefined>): DialogState<VoidOrOptional<T | V>>;

export function createDialog<P extends DialogOptionsStrict<any, any>>(props: P): DialogState<VoidOrOptional<P extends DialogOptionsStrict<infer T, any> ? T : unknown>>;

export function createDialog<P extends DialogOptions<any, any>>(props: P): DialogState<VoidOrOptional<P extends DialogOptions<infer T, infer V> ? T | V : unknown>>;

/**
 * Renders a dialog declaratively.
 */
export function Dialog<T, V = T>(props: DialogProps<T, V>): JSX.Element;
