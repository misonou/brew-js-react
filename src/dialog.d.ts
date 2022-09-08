export type DialogCloseCallback<T> = (value?: T) => void;

export interface DialogState<T> {
    readonly root: HTMLElement;
    open: () => Promise<T | undefined>;
    close: DialogCloseCallback<T>;
}

export interface DialogBaseProps<T> {
    title?: string;
    className?: string;
    showCloseButton?: boolean;
    preventLeave?: boolean;
    modal?: boolean;
    onCommit?: (value: T | undefined) => void;
    onOpen?: (root: HTMLElement) => void;
    onClose?: (root: HTMLElement) => void;
}

export interface DialogRenderComponentProps<T> extends DialogBaseProps<T> {
    closeDialog: DialogCloseCallback<T>;
}

export interface DialogOptions<T> extends DialogBaseProps<T> {
    onRender: React.FC<DialogRenderComponentProps<T>>;
}

export interface DialogProps<T> extends React.PropsWithChildren<DialogBaseProps<T>> {
    isOpen: boolean;
}

export function createDialog<T = any>(props: DialogOptions<T>): DialogState<T>;

export function Dialog<T>(props: DialogProps<T>): JSX.Element;
