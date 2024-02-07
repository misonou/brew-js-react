import { createElement, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactDOMClient from "./include/external/react-dom-client.js";
import { either, extend, makeAsync, noop, pick, pipe, resolve } from "./include/zeta-dom/util.js";
import { containsOrEquals, removeNode } from "./include/zeta-dom/domUtil.js";
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
        flyoutshow: function () {
            (props.onOpen || noop)(root);
        },
        flyouthide: function () {
            promise = null;
            removeNode(root);
            (props.onClose || noop)(root);
            if (props.onRender) {
                reactRoot.unmount();
            }
        }
    });
    root.setAttribute('loading-class', '');
    subscribeAsync(root, true);

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
            }
            promise = resolve().then(function () {
                return openFlyout(root, null, pick(props, ['focus']));
            });
            if (props.preventLeave) {
                preventLeave(root, promise);
            } else if (props.preventNavigation) {
                lock(root, promise);
            }
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
