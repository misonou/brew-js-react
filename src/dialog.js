import { createElement, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactDOMClient from "./include/external/react-dom-client.js";
import { always, either, extend, makeAsync, noop, pipe, setImmediate } from "./include/zeta-dom/util.js";
import { containsOrEquals, removeNode, setClass } from "./include/zeta-dom/domUtil.js";
import dom from "./include/zeta-dom/dom.js";
import { lock, notifyAsync, preventLeave, subscribeAsync } from "./include/zeta-dom/domLock.js";
import { closeFlyout, openFlyout } from "./include/brew-js/domAction.js";

/**
 * @param {Partial<import("./dialog").DialogOptions<any>>} props
 */
export function createDialog(props) {
    var root = document.createElement('div');
    var reactRoot = ReactDOMClient.createRoot(root);
    var closeDialog = closeFlyout.bind(0, root);
    var promise;

    dom.on(root, {
        flyouthide: function () {
            removeNode(root);
            (props.onClose || noop)(root);
            if (props.onRender) {
                reactRoot.unmount();
            }
        },
        asyncStart: function () {
            setClass(root, 'loading', true);
        },
        asyncEnd: function () {
            setClass(root, 'loading', false);
        }
    });
    subscribeAsync(root);

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
                        notifyAsync(dom.activeElement, promise);
                        return promise.then(closeDialog);
                    }
                });
                var content = createElement(props.onRender, dialogProps);
                if (props.wrapper) {
                    content = createElement(props.wrapper, dialogProps, content);
                }
                reactRoot.render(content);
                setImmediate(function () {
                    dom.focus(root);
                });
            }
            promise = openFlyout(root);
            if (props.preventLeave) {
                preventLeave(root, promise);
            } else if (props.preventNavigation) {
                lock(root, promise);
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
