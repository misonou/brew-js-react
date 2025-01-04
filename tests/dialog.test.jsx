import React, { useEffect } from "react";
import { act, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { locked, subscribeAsync } from "zeta-dom/domLock";
import { removeNode } from "zeta-dom/domUtil";
import { createDialog, createDialogQueue, Dialog } from "src/dialog";
import { after, delay, mockFn, verifyCalls } from "@misonou/test-utils";
import dom from "zeta-dom/dom";
import initAppBeforeAll from "./harness/initAppBeforeAll";
import composeAct from "./harness/composeAct";
import { useAsync } from "zeta-dom-react";
import { setTimeout, watch } from "zeta-dom/util";
import { closeFlyout } from "brew-js/domAction";

const createDialogMock = mockFn(createDialog);
const createDialogQueueMock = mockFn(createDialogQueue);
const { actAndReturn, actAwaitSetImmediate } = composeAct(act);

initAppBeforeAll(() => { });

afterEach(() => {
    createDialogMock.mock.results.forEach(v => {
        removeNode(v.value.root);
    });
    createDialogQueueMock.mock.results.forEach(v => {
        v.value.dismissAll();
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

    it('should append dialog element to container', async () => {
        const container = document.createElement('div');
        document.body.append(container);

        const dialog = createDialogMock({ container, onRender: () => <div>content</div> });
        dialog.open();
        await screen.findByText('content');
        expect(dialog.root.parentElement).toBe(container);
    });

    it('should ignore certain options when dialog is shared', async () => {
        const container = document.createElement('div');
        document.body.append(container);

        const controller = createDialogQueueMock({
            mode: 'shared',
            className: 'test-shared-dialog'
        });
        const dialog = createDialogMock({
            controller,
            container,
            className: 'should-not-used',
            modal: true,
            preventLeave: true,
            preventNavigation: true,
            onRender() {
                return <div>content</div>
            }
        });
        dialog.open();
        await screen.findByText('content');

        expect(dialog.root.parentElement).toBe(document.body);
        expect(dialog.root).toHaveClassName('test-shared-dialog');
        expect(dialog.root).not.toHaveClassName('should-not-used');
        expect(dom.modalElement).toBeNull();
        expect(locked()).toBe(false);
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

    it('should trigger pending dialog when dialog is shared', async () => {
        const controller = createDialogQueueMock({ mode: 'shared' });
        const d1 = createDialogMock({ controller, onRender: () => <div>1</div> });
        const d2 = createDialogMock({ controller, onRender: () => <div>2</div> });
        d1.open();
        d2.open();
        expect(controller.pendingCount).toBe(1);

        const container = (await screen.findByText('1')).parentElement;
        await d1.close();

        const element = await screen.findByText('2');
        expect(element.parentElement).toBe(container);
    });

    it('should have no effect when called second time when dialog is shared', async () => {
        const controller = createDialogQueueMock({ mode: 'shared' });
        const d1 = createDialogMock({ controller, onRender: () => <div>1</div> });
        const d2 = createDialogMock({ controller, onRender: () => <div>2</div> });
        d1.open();
        d2.open();
        expect(controller.pendingCount).toBe(1);

        await screen.findByText('1');
        await d1.close();
        await screen.findByText('2');
        await d1.close();
        await screen.findByText('2');
    });

    it('should have no effect before open when dialog is shared', async () => {
        const controller = createDialogQueueMock({ mode: 'shared' });
        const d1 = createDialogMock({ controller, onRender: () => <div>1</div> });
        const d2 = createDialogMock({ controller, onRender: () => <div>2</div> });
        d1.open();
        expect(controller.pendingCount).toBe(0);

        await screen.findByText('1');
        await d2.close();
        await screen.findByText('1');
    });

    it('should have no effect when called after dialog is dismissed', async () => {
        const controller = createDialogQueueMock({ mode: 'shared' });
        const d1 = createDialogMock({ controller, onRender: () => <div>1</div> });
        d1.open();

        await screen.findByText('1');
        controller.dismissAll();

        const d2 = createDialogMock({ controller, onRender: () => <div>2</div> });
        const d3 = createDialogMock({ controller, onRender: () => <div>3</div> });
        d2.open();
        d3.open();
        expect(controller.pendingCount).toBe(1);

        await screen.findByText('2');
        await d1.close();
        await screen.findByText('2');
    });
});

describe('DialogController', () => {
    it('should render dialog after previous one when controller is given', async () => {
        const controller = createDialogQueueMock();
        const renderCb = mockFn();
        const dismissCb = mockFn();

        const create = (id) => {
            return createDialogMock({
                controller,
                onRender: function Component({ dismissDialog }) {
                    renderCb(id);
                    useEffect(() => {
                        return setTimeout(() => dismissCb(dismissDialog(id)), 100);
                    }, []);
                    return <span data-testid="id">{id}</span>;
                }
            }).open();
        };

        const p1 = create(1);
        const p2 = create(2);
        const p3 = create(3);

        await expect(screen.findByTestId('id')).resolves.toHaveProperty('textContent', '1');
        verifyCalls(renderCb, [[1], [1]]); // strict mode

        await waitFor(() => expect(renderCb).toBeCalledTimes(4));
        await expect(screen.findByTestId('id')).resolves.toHaveProperty('textContent', '2');
        expect(dismissCb).toBeCalledTimes(1);

        await expect(Promise.all([p1, p2, p3])).resolves.toEqual([1, 2, 3]);
        expect(renderCb).toBeCalledTimes(6);
        expect(dismissCb).toBeCalledTimes(3);
    });

    it('should queue dialog in the correct order', async () => {
        const dismiss = mockFn();
        const controller = createDialogQueueMock({ mode: 'shared' });
        const dialog = createDialogMock({
            controller,
            onRender: function Component({ dismissDialog }) {
                dismiss.mockImplementationOnce(() => {
                    dismissDialog();
                    createDialogMock({ controller, onRender: () => <div>3</div> }).open();
                });
                return <div>1</div>;
            }
        });
        dialog.open();
        createDialogMock({ controller, onRender: () => <div>2</div> }).open();
        await screen.findByText('1');
        expect(controller.pendingCount).toBe(1);

        dismiss();
        expect(controller.pendingCount).toBe(2);
        expect(screen.queryByText('3')).toBeNull();
        await screen.findByText('2');
    });

    it('should show at most specified number of dialog', async () => {
        const controller = createDialogQueueMock({ mode: 'multiple', concurrent: 2 })
        createDialogMock({ controller, onRender: () => <div data-testid="1">content</div> }).open();
        createDialogMock({ controller, onRender: () => <div data-testid="2">content</div> }).open();
        createDialogMock({ controller, onRender: () => <div data-testid="3">content</div> }).open();
        createDialogMock({ controller, onRender: () => <div data-testid="4">content</div> }).open();

        const e1 = await screen.findByTestId('1');
        const e2 = await screen.findByTestId('2');
        expect(controller.pendingCount).toBe(2);

        closeFlyout(e1.closest('.visible'));
        await screen.findByTestId('3');
        expect(controller.pendingCount).toBe(1);

        closeFlyout(e2.closest('.visible'));
        await screen.findByTestId('4');
        expect(controller.pendingCount).toBe(0);
    });

    it('should close active dialog on blur', async () => {
        const controller = createDialogQueueMock();
        createDialogMock({ controller, onRender: () => <div>content</div> }).open();
        await delay();

        dom.blur(document.body);
        await delay();
        expect(screen.queryByText('content')).toBeNull();
    });

    it('should close shared dialog on blur', async () => {
        const controller = createDialogQueueMock({ mode: 'shared' });
        createDialogMock({ controller, onRender: () => <div>content</div> }).open();
        await delay();

        dom.blur(document.body);
        await delay();
        expect(screen.queryByText('content')).toBeNull();
    });

    it('should dismiss pending dialogs when root is closed directly', async () => {
        const controller = createDialogQueueMock({ mode: 'multiple', className: 'test-root', concurrent: 1 });
        const p1 = createDialogMock({ controller, onRender: () => <div>content</div> }).open();
        const p2 = createDialogMock({ controller, onRender: () => { throw new Error() } }).open();
        await expect(screen.findAllByText('content')).resolves.toHaveLength(1);
        expect(controller.pendingCount).toBe(1);

        closeFlyout('.test-root', 42);
        await expect(p1).resolves.toBeUndefined();
        await expect(p2).resolves.toBeUndefined();
        expect(controller.pendingCount).toBe(0);
    });

    it('should dismiss active dialogs when root is closed directly', async () => {
        const controller = createDialogQueueMock({ mode: 'multiple', className: 'test-root' });
        const p1 = createDialogMock({ controller, onRender: () => <div>content</div> }).open();
        const p2 = createDialogMock({ controller, onRender: () => <div>content</div> }).open();
        await expect(screen.findAllByText('content')).resolves.toHaveLength(2);

        closeFlyout('.test-root', 42);
        await expect(p1).resolves.toBeUndefined();
        await expect(p2).resolves.toBeUndefined();
    });

    it('should pass value from closeFlyout to active dialog if dialog is shared', async () => {
        const controller = createDialogQueueMock({ mode: 'shared', className: 'test-root' });
        const p1 = createDialogMock({ controller, onRender: () => <div>content</div> }).open();
        const p2 = createDialogMock({ controller, onRender: () => <div>content</div> }).open();
        await expect(screen.findAllByText('content')).resolves.toHaveLength(1);

        closeFlyout('.test-root', 42);
        await expect(p1).resolves.toBe(42);
        await expect(p2).resolves.toBeUndefined();
    });

    it('should append dialog element to container', async () => {
        const container = document.createElement('div');
        document.body.append(container);

        const controller = createDialogQueueMock({ mode: 'multiple', container });
        const dialog = createDialogMock({ controller, onRender: () => <div>content</div> });
        dialog.open();
        await screen.findByText('content');
        expect(dialog.root.parentElement.parentElement).toBe(container);
    });
});

describe('DialogController.pendingCount', () => {
    it('should be observable', async () => {
        const cb = mockFn();
        const controller = createDialogQueueMock();
        watch(controller, 'pendingCount', cb);

        const d1 = createDialogMock({ controller, onRender: () => <div>1</div> });
        const d2 = createDialogMock({ controller, onRender: () => <div>2</div> });
        d1.open();
        d2.open();
        await waitFor(() => expect(cb).toBeCalled());
        expect(cb).toBeCalledWith(1, 0, 'pendingCount', controller);
    });
});

describe('DialogController.dismissPending', () => {
    it('should dismiss pending dialogs', async () => {
        const controller = createDialogQueueMock();
        const renderCb = mockFn();

        const create = (id) => {
            return createDialogMock({
                controller,
                onRender: function Component({ dismissDialog }) {
                    renderCb(id);
                    useEffect(() => {
                        setTimeout(() => dismissDialog(id), 100);
                    }, []);
                    return <span data-testid="id">{id}</span>;
                }
            }).open();
        };

        const p1 = create(1);
        const p2 = create(2);
        const p3 = create(3);
        expect(controller.pendingCount).toBe(2);

        controller.dismissPending();
        await expect(Promise.all([p1, p2, p3])).resolves.toEqual([1, undefined, undefined]);
        verifyCalls(renderCb, [[1], [1]]);
        expect(controller.pendingCount).toBe(0);
    });

    it('should dismiss immediate followed dialog', async () => {
        const controller = createDialogQueueMock({ mode: 'shared' });
        const cb = mockFn();

        const promise = createDialogMock({
            controller,
            onRender: ({ commitDialog }) => {
                cb.mockImplementationOnce(commitDialog);
                return <div>1</div>;
            }
        }).open();

        createDialogMock({ controller, onRender: () => <div>2</div> }).open();

        await screen.findByText('1');
        cb();
        controller.dismissPending();

        await promise;
        expect(screen.queryByText('2')).toBeNull();
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
