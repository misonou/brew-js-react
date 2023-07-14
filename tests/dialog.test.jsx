import React from "react";
import { act, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { locked } from "zeta-dom/domLock";
import { removeNode } from "zeta-dom/domUtil";
import { createDialog, Dialog } from "src/dialog";
import { after, delay, mockFn, verifyCalls } from "@misonou/test-utils";
import dom from "zeta-dom/dom";
import initAppBeforeAll from "./harness/initAppBeforeAll";
import composeAct from "./harness/composeAct";

const createDialogMock = mockFn(createDialog);
const { actAndReturn } = composeAct(act);

initAppBeforeAll(() => { });

afterEach(() => {
    createDialogMock.mock.results.forEach(v => {
        removeNode(v.value.root);
    });
});

describe('createDialog', () => {
    it('should invoke onOpen callback when dialog is opened', () => {
        const cb = mockFn();
        const dialog = createDialogMock({
            onOpen: cb,
            onRender: function Component() {
                return <span>text</span>;
            }
        });
        actAndReturn(() => dialog.open());
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
        actAndReturn(() => dialog.open());

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
        actAndReturn(() => dialog.open());
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
        actAndReturn(() => dialog.open());

        const result = dismiss();
        expect(dialog.root).toHaveClassName('loading');

        await expect(result).rejects.toBe(42);
        expect(dialog.root).not.toHaveClassName('loading');
    });

    it('should set dialog as modal when modal is true', () => {
        const cb = mockFn();
        const dialog = createDialogMock({
            modal: true,
            onOpen: cb,
            onRender: function Component() {
                return <span>text</span>;
            }
        });
        actAndReturn(() => dialog.open());
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

    it('should not prevent leave when dialog is closed', async () => {
        const dialog = createDialogMock({
            preventLeave: true,
            onRender: function Component() {
                return <span>text</span>;
            }
        });
        actAndReturn(() => dialog.open());
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

describe('Dialog', () => {
    it('should open and close dialog when isOpen is updated', async () => {
        const { rerender, unmount } = render(
            <Dialog isOpen={false}>
                <button>test</button>
            </Dialog>
        );
        rerender(
            <Dialog isOpen={true}>
                <button>test</button>
            </Dialog>
        );
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
});
