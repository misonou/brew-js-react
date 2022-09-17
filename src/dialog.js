import { createElement, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { always, catchAsync, either, extend, makeAsync, noop, pipe } from "./include/zeta-dom/util.js";
import { containsOrEquals, removeNode } from "./include/zeta-dom/domUtil.js";
import dom from "./include/zeta-dom/dom.js";
import { lock, preventLeave } from "./include/zeta-dom/domLock.js";
import { closeFlyout, openFlyout } from "./include/brew-js/domAction.js";

const createRoot = ReactDOM.createRoot;

/**
 * @param {Partial<import("./dialog").DialogOptions<any>>} props
 */
export function createDialog(props) {
    var root = document.createElement('div');
    var reactRoot = createRoot && createRoot(root);
    var closeDialog = closeFlyout.bind(0, root);
    var promise;

    dom.on(root, 'flyouthide', function () {
        removeNode(root);
        (props.onClose || noop)(root);
        if (props.onRender) {
            if (reactRoot) {
                reactRoot.unmount();
            } else {
                ReactDOM.unmountComponentAtNode(root);
            }
        }
    });

    return {
        root: root,
        close: closeDialog,
        open: function () {
            if (promise) {
                return promise;
            }
            root.className = props.className || '';
            document.body.appendChild(root);
            dom.retainFocus(dom.activeElement, root);
            if (props.modal) {
                root.setAttribute('is-modal', '');
                dom.setModal(root);
            }
            if (props.onRender) {
                var dialogProps = extend({}, props, {
                    closeDialog: function (value) {
                        var promise = makeAsync(props.onCommit || pipe)(value);
                        catchAsync(lock(dom.activeElement, promise));
                        promise.then(closeDialog, noop);
                    }
                });
                var content = createElement(props.onRender, dialogProps);
                if (props.wrapper) {
                    content = createElement(props.wrapper, dialogProps, content);
                }
                if (reactRoot) {
                    reactRoot.render(content);
                } else {
                    ReactDOM.render(content, root);
                }
            }
            promise = openFlyout(root);
            if (props.preventLeave) {
                preventLeave(root, promise);
            }
            always(promise, function () {
                promise = null;
            });
            (props.onOpen || noop)(root);
            return promise;
        }
    };
}

/**
 * @param {import("./dialog").DialogProps} props
 */
export function Dialog(props) {
    const _props = useState({})[0];
    const dialog = useState(function () {
        return createDialog(_props);
    })[0];
    extend(_props, props);

    useEffect(function () {
        var opened = containsOrEquals(dom.root, dialog.root);
        if (either(opened, _props.isOpen)) {
            if (!opened) {
                dialog.open();
            } else {
                dialog.close();
            }
        }
    }, [_props.isOpen])
    useEffect(function () {
        return dialog.close;
    }, [dialog]);
    return ReactDOM.createPortal(props.children, dialog.root);
}
