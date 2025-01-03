import React, { useEffect } from "react";
import { act, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { locked, subscribeAsync } from "zeta-dom/domLock";
import { removeNode } from "zeta-dom/domUtil";
import { createDialog, Dialog } from "src/dialog";
import { after, delay, mockFn, verifyCalls } from "@misonou/test-utils";
import dom from "zeta-dom/dom";
import initAppBeforeAll from "./harness/initAppBeforeAll";
import composeAct from "./harness/composeAct";
import { useAsync } from "zeta-dom-react";

const createDialogMock = mockFn(createDialog);
const { actAndReturn, actAwaitSetImmediate } = composeAct(act);

initAppBeforeAll(() => { });

afterEach(() => {
    createDialogMock.mock.results.forEach(v => {
        removeNode(v.value.root);
    });
});

describe('createDialog', () => {
    it('should invoke onOpen callback when dialog is opened', async () => {
        const cb = mockFn();
        const dialog = createDialogMock({
            onOpen: cb,
            onRender: function Component() {
                return <span>text</span>;
            }
        });
        await actAwaitSetImmediate(() => dialog.open());
        verifyCalls(cb, [
            [dialog.root]
        ]);
    });

    it('should invoke onClose callback when dialog is closed', async () => {
        const cb = mockFn();
        const dialog = createDialogMock({
            onClose: cb,
            onRender: function Component() {
                return <span>text</span>;
            }
        });
        await actAwaitSetImmediate(() => dialog.open());

        dialog.close();
        await waitForElementToBeRemoved(() => screen.getByText('text'));
        verifyCalls(cb, [
            [dialog.root]
        ]);
    });

    it('should prevent dismissing of dialog when promise returned from onCommit has rejected', async () => {
        const dismiss = mockFn();
        const onCommit = mockFn().mockRejectedValueOnce(42);
        const dialog = createDialogMock({
            onCommit: onCommit,
            onRender: function Component({ closeDialog }) {
                dismiss.mockImplementationOnce(closeDialog);
                return <span>text</span>;
            }
        });
        actAndReturn(() => dialog.open());
        await expect(dismiss()).rejects.toBe(42);
        expect(onCommit).toBeCalledTimes(1);

        await delay(100);
        expect(screen.getByText('text')).toBeTruthy();
    });

    it('should prevent dismissing of dialog when onCommit has thrown', async () => {
        const dismiss = mockFn();
        const onCommit = mockFn(() => { throw 42; });
        const dialog = createDialogMock({
            onCommit: onCommit,
            onRender: function Component({ closeDialog }) {
                dismiss.mockImplementationOnce(closeDialog);
                return <span>text</span>;
            }
        });
        await actAwaitSetImmediate(() => dialog.open());
        await expect(dismiss()).rejects.toBe(42);
        expect(onCommit).toBeCalledTimes(1);

        await delay(100);
        expect(screen.getByText('text')).toBeTruthy();
    });

    it('should add loading class to dialog awaiting onCommit', async () => {
        const dismiss = mockFn();
        const onCommit = mockFn(() => delay(100).then(() => { throw 42 }));
        const dialog = createDialogMock({
            onCommit: onCommit,
            onRender: function Component({ closeDialog }) {
                dismiss.mockImplementationOnce(closeDialog);
                return <span>text</span>;
            }
        });
        await actAwaitSetImmediate(() => dialog.open());

        const result = dismiss();
        await delay();
        expect(dialog.root).toHaveClassName('loading');

        await expect(result).rejects.toBe(42);
        expect(dialog.root).not.toHaveClassName('loading');
    });

    it('should notify async awaiting onCommit', async () => {
        const dismiss = mockFn();
        const cb = mockFn();
        const { container } = render(<button></button>);
        dom.focus(container);

        const dialog = createDialogMock({
            onRender({ closeDialog }) {
                dismiss.mockImplementationOnce(closeDialog);
                return <span>text</span>;
            },
            onCommit() {
                return delay(100);
            }
        });
        subscribeAsync(dialog.root, cb);
        subscribeAsync(container, cb);
        subscribeAsync(dom.root, cb);
        await actAwaitSetImmediate(() => dialog.open());

        const result = dismiss();
        await delay();
        expect(cb).toBeCalledTimes(1);

        await result;
        verifyCalls(cb, [
            [true],
            [false],
        ]);
        expect(cb.mock.instances[0]).toBe(dialog.root);
        expect(cb.mock.instances[1]).toBe(dialog.root);
    });

    it('should dismiss dialog without invoking onCommit when dismissDialog is called', async () => {
        const dismiss = mockFn();
        const onCommit = mockFn(() => true);
        const dialog = createDialogMock({
            onCommit: onCommit,
            onRender: function Component({ dismissDialog }) {
                dismiss.mockImplementationOnce(dismissDialog);
                return <span>text</span>;
            }
        });
        const promise = dialog.open();
        await screen.findByText('text');

        dismiss();
        await expect(promise).resolves.toBeUndefined();
        expect(onCommit).not.toBeCalled();
    });

    it('should set dialog as modal when modal is true', async () => {
        const cb = mockFn();
        const dialog = createDialogMock({
            modal: true,
            onOpen: cb,
            onRender: function Component() {
                return <span>text</span>;
            }
        });
        await actAwaitSetImmediate(() => dialog.open());
        expect(dialog.root.attributes['is-modal']).toBeTruthy();
        expect(dom.modalElement).toBe(dialog.root);
    });

    it('should prevent leave when preventLeave is true', () => {
        const dialog = createDialogMock({
            preventLeave: true,
            onRender: function Component() {
                return <span>text</span>;
            }
        });
        actAndReturn(() => dialog.open());
        expect(locked()).toBe(true);
    });

    it('should lock root element when preventNavigation is true', () => {
        const dialog = createDialogMock({
            preventNavigation: true,
            onRender: function Component() {
                return <span>text</span>;
            }
        });
        actAndReturn(() => dialog.open());
        expect(locked()).toBe(true);
    });

    it('should not prevent leave when dialog is closed', async () => {
        const dialog = createDialogMock({
            preventLeave: true,
            onRender: function Component() {
                return <span>text</span>;
            }
        });
        await actAwaitSetImmediate(() => dialog.open());
        expect(locked()).toBe(true);
        await after(() => void dialog.close());
        expect(locked()).toBe(false);
    });

    it('should render content with wrapper', () => {
        const dialog = createDialogMock({
            wrapper: function Component(props) {
                return <span data-testid="parent">{props.children}</span>;
            },
            onRender: function Component() {
                return <span data-testid="child">text</span>;
            }
        });
        actAndReturn(() => dialog.open());
        expect(screen.getByTestId('child').parentElement).toBe(screen.getByTestId('parent'));
    });

    it('should pass error handler that catch async error', async () => {
        const cb = mockFn(() => true);
        const dialog = createDialogMock({
            onRender: function Component({ errorHandler }) {
                useEffect(() => {
                    return errorHandler.catch(cb);
                }, []);
                useAsync(() => Promise.reject(new Error()));
                return <span>text</span>;
            }
        });
        await actAwaitSetImmediate(() => dialog.open());
        expect(cb).toBeCalledTimes(1);
    });
});

describe('DialogState.open', () => {
    it('should return the same promise before closed', () => {
        const dialog = createDialogMock({
            onRender: function Component() {
                return <span>text</span>;
            }
        });
        const p1 = actAndReturn(() => dialog.open());
        const p2 = actAndReturn(() => dialog.open());
        expect(p1).toBe(p2);
    });

    it('should return a promise that resolves with value passed to DialogState.close', async () => {
        const dialog = createDialogMock({
            onRender: function Component() {
                return <span>text</span>;
            }
        });
        const obj = {};
        const p1 = actAndReturn(() => dialog.open());
        await 0;
        dialog.close(obj);
        await expect(p1).resolves.toBe(obj);
    });

    it('should return a promise that resolves with value returned by closeDialog', async () => {
        const dismiss = mockFn();
        const dialog = createDialogMock({
            onRender: function Component({ closeDialog }) {
                dismiss.mockImplementationOnce(closeDialog);
                return <span>text</span>;
            }
        });
        const obj = {};
        const p1 = actAndReturn(() => dialog.open());
        await 0;
        dismiss(obj);
        await expect(p1).resolves.toBe(obj);
    });

    it('should return a promise that resolves with value resolved from returned value of onCommit', async () => {
        const dismiss = mockFn();
        const onCommit = mockFn().mockResolvedValue(42);
        const dialog = createDialogMock({
            onCommit: onCommit,
            onRender: function Component({ closeDialog }) {
                dismiss.mockImplementationOnce(closeDialog);
                return <span>text</span>;
            }
        });
        const p1 = actAndReturn(() => dialog.open());
        dismiss();
        await expect(p1).resolves.toBe(42);
    });
});

describe('DialogState.close', () => {
    it('should cancel dialog when called synchronously', async () => {
        const dialog = createDialogMock({ onRender: () => <div>1</div> });
        const promise = dialog.open();
        await dialog.close();

        expect(screen.queryByText(1)).toBeNull();
        await expect(promise).resolves.toBeUndefined();
    });
});

describe('Dialog', () => {
    it('should open and close dialog when isOpen is updated', async () => {
        const Component = function ({ isOpen }) {
            return (
                <Dialog isOpen={isOpen}>
                    <button>test</button>
                </Dialog>
            );
        };
        const { rerender, unmount } = render(<Component isOpen={false} />);
        await after(() => rerender(<Component isOpen={true} />));

        const root = screen.getByRole('button').parentElement;
        expect(root.classList.contains('open')).toBe(true);
        rerender(
            <Dialog isOpen={false}>
                <button>test</button>
            </Dialog>
        );
        await delay(100);
        expect(root.classList.contains('open')).toBe(false);
        unmount();
    });

    it('should mount dialog content in portal element', async () => {
        const { container, unmount } = render(
            <Dialog isOpen={true}>
                <button>test</button>
            </Dialog>
        );
        const root = screen.getByRole('button').parentElement;
        expect(root.parentElement).toBe(document.body);
        expect(container.contains(root)).toBe(false);
        unmount();
    });

    it('should invoke onOpen and onClose callback', async () => {
        const cb = mockFn();
        const Component = function ({ isOpen }) {
            return (
                <Dialog isOpen={isOpen} onOpen={() => cb('open')} onClose={() => cb('close')}>
                    <button>test</button>
                </Dialog>
            );
        };
        const { rerender, unmount } = render(<Component isOpen={false} />);
        await after(() => rerender(<Component isOpen={true} />));
        verifyCalls(cb, [['open']]);
        cb.mockClear();

        await after(() => rerender(<Component isOpen={false} />));
        verifyCalls(cb, [['close']]);
        unmount();
    });

    it('should set dialog as modal when modal is true', async () => {
        const { unmount } = render(
            <Dialog isOpen={true} modal>
                <button>test</button>
            </Dialog>
        );
        await waitFor(() => expect(dom.modalElement).toBeTruthy());
        unmount();
        await waitFor(() => expect(dom.modalElement).toBeNull());
    });

    it('should prevent leave when preventLeave is true', async () => {
        const { unmount } = render(
            <Dialog isOpen={true} preventLeave>
                <button>test</button>
            </Dialog>
        );
        await waitFor(() => expect(locked()).toBe(true));
        unmount();
        await waitFor(() => expect(locked()).toBe(false));
    });

    it('should lock root element when preventNavigation is true', async () => {
        const { unmount } = render(
            <Dialog isOpen={true} preventNavigation>
                <button>test</button>
            </Dialog>
        );
        await waitFor(() => expect(locked()).toBe(true));
        unmount();
        await waitFor(() => expect(locked()).toBe(false));
    });

    it('should not open dialog when isOpen set to false synchronously', async () => {
        const Component = function ({ isOpen }) {
            return (
                <Dialog isOpen={isOpen}>
                    <button>test</button>
                </Dialog>
            );
        };
        const { rerender, unmount } = render(<Component isOpen={true} />);
        rerender(<Component isOpen={false} />);
        await delay();
        expect(screen.queryByRole('button')).toBeNull();
        unmount();
    });
});
