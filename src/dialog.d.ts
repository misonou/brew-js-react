export type DialogCloseCallback<T> = (value?: T) => Promise<void>;

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
    preventNavigation?: boolean;
    modal?: boolean;
    onCommit?: (value: T | undefined) => void;
    onOpen?: (root: HTMLElement) => void;
    onClose?: (root: HTMLElement) => void;
}

export interface DialogRenderComponentProps<T, P = {}> extends DialogBaseProps<T>, P {
    closeDialog: DialogCloseCallback<T>;
}

export interface DialogOptions<T, P = {}> extends DialogBaseProps<T> {
    onRender: React.FC<DialogRenderComponentProps<T, P>>;
}

export interface DialogProps<T> extends React.PropsWithChildren<DialogBaseProps<T>> {
    isOpen: boolean;
}

export function createDialog<T = any, P = {}>(props: DialogOptions<T, P> & { wrapper?: React.FC<React.PropsWithChildren<DialogRenderComponentProps<T, P>>> }): DialogState<T>;

export function Dialog<T>(props: DialogProps<T>): JSX.Element;
