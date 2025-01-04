import { createElement, StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactDOMClient from "@misonou/react-dom-client";
import { createAsyncScope } from "zeta-dom-react";
import { always, arrRemove, combineFn, createPrivateStore, defineObservableProperty, either, extend, noop, pick, resolve, setImmediate } from "zeta-dom/util";
import { containsOrEquals, removeNode } from "zeta-dom/domUtil";
import dom from "zeta-dom/dom";
import { lock, preventLeave, runAsync, subscribeAsync } from "zeta-dom/domLock";
import { closeFlyout, isFlyoutOpen, openFlyout } from "brew-js/domAction";

const _ = createPrivateStore();

function debounceAsync(callback) {
    var promise;
    return function () {
        if (!promise) {
            promise = callback.apply(this, arguments);
            always(promise, function () {
                promise = null;
            });
        }
        return promise;
    };
}

function createDialogElement(props, unmountAfterUse) {
    var root = document.createElement('div');
    dom.on(root, {
        flyoutshow: function () {
            (props.onOpen || noop)(root);
        },
        flyouthide: function () {
            removeNode(root);
            (props.onClose || noop)(root);
            (unmountAfterUse || noop)();
        }
    });
    root.setAttribute('loading-class', '');
    subscribeAsync(root, true);
    return root;
}

function openDialog(element, props, container) {
    if (!containsOrEquals(dom.root, element)) {
        element.className = props.className || '';
        (container || props.container || document.body).appendChild(element);
        if (props.modal) {
            element.setAttribute('is-modal', '');
        }
        setImmediate(function () {
            dom.retainFocus(dom.activeElement, element);
        });
    }
    var promise = openFlyout(element, null, pick(props, ['focus', 'closeOnBlur']));
    if (props.preventLeave) {
        preventLeave(element, promise);
    } else if (props.preventNavigation) {
        lock(element, promise);
    }
    return promise;
}

/**
 * @param {Partial<import("./dialog").DialogOptions<any>>} props
 */
export function createDialog(props) {
    var controller = _(props.controller) || {};
    var shared = controller.mode === 'shared';
    var state = shared ? controller : {};
    var root = state.root || (state.root = createDialogElement(props, function () {
        reactRoot.unmount();
    }));
    var reactRoot = state.reactRoot || (state.reactRoot = ReactDOMClient.createRoot(root));
    var scope = state.scope || (state.scope = createAsyncScope(root));
    var closeDialog = shared ? noop : closeFlyout.bind(0, root);

    function render(closeDialog, props, container) {
        var commitDialog = props.onCommit ? function (value) {
            return runAsync(dom.activeElement, props.onCommit.bind(this, value)).then(closeDialog);
        } : closeDialog;
        var dialogProps = extend({}, props, {
            errorHandler: scope.errorHandler,
            closeDialog: commitDialog,
            commitDialog: commitDialog,
            dismissDialog: closeDialog
        });
        var content = createElement(props.onRender, dialogProps);
        if (props.wrapper) {
            content = createElement(props.wrapper, dialogProps, content);
        }
        reactRoot.render(createElement(StrictMode, null, createElement(scope.Provider, null, content)));
        return shared ? { then: noop } : openDialog(root, props, container);
    }

    return {
        root: root,
        close: function (value) {
            return closeDialog(value);
        },
        open: debounceAsync(function () {
            if (controller.enqueue) {
                return controller.enqueue(function (next) {
                    closeDialog = shared ? next : closeDialog;
                    render(closeDialog, extend({}, controller.props, props), controller.root).then(next);
                });
            }
            return render(closeDialog, props);
        })
    };
}

/**
 * @param {import("./dialog").DialogControllerOptions | undefined} props
 */
export function createDialogQueue(props) {
    var mode = props && props.mode;
    var root = mode && createDialogElement(props);
    var multiple = mode === 'multiple';
    var childProps;
    var queue = [];
    var active = [];
    var controller = {};
    var setPendingCount = defineObservableProperty(controller, 'pendingCount', 0, true);

    function dismissPending() {
        combineFn(queue.splice(0))();
        setPendingCount(0);
    }

    function dismissAll(value) {
        combineFn(active.splice(0))(multiple ? undefined : value);
        dismissPending();
    }

    function render(callback) {
        return new Promise(function (resolvePromise) {
            var next = function (value) {
                if (arrRemove(active, resolvePromise)) {
                    resolvePromise(value);
                    setImmediate(function () {
                        (queue.shift() || noop)(true);
                    });
                }
                return root && !queue[0] && !active[0] ? closeFlyout(root) : resolve();
            };
            active.push(resolvePromise);
            setPendingCount(queue.length);
            callback(next);
        });
    }

    if (multiple) {
        childProps = { closeOnBlur: false };
        props = extend({}, props, childProps);
    } else {
        childProps = props && pick(props, ['className', 'focus', 'modal', 'container']);
    }
    _(controller, {
        root: root,
        mode: mode,
        props: childProps,
        enqueue: function (callback) {
            if (root && !isFlyoutOpen(root)) {
                openDialog(root, props).then(dismissAll);
            }
            if (queue.length || active.length >= (multiple ? props.concurrent || Infinity : 1)) {
                return new Promise(function (resolve) {
                    queue.push(function (renderNext) {
                        resolve(renderNext && render(callback));
                    });
                    setPendingCount(queue.length);
                });
            }
            return render(callback);
        }
    });
    return extend(controller, { dismissAll, dismissPending });
}

/**
 * @param {import("./dialog").DialogProps} props
 */
export function Dialog(props) {
    const _props = extend(useState({})[0], props);
    const element = useState(function () {
        return createDialogElement(_props);
    })[0];
    useEffect(function () {
        var opened = isFlyoutOpen(element);
        if (either(opened, _props.isOpen)) {
            if (!opened) {
                openDialog(element, _props);
            } else {
                closeFlyout(element);
            }
        }
    }, [_props.isOpen])
    useEffect(function () {
        return closeFlyout.bind(0, element);
    }, []);
    return ReactDOM.createPortal(props.children, element);
}
