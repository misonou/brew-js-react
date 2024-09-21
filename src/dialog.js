import { createElement, StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactDOMClient from "@misonou/react-dom-client";
import { createAsyncScope } from "zeta-dom-react";
import { either, extend, noop, pick, resolve } from "zeta-dom/util";
import { containsOrEquals, removeNode } from "zeta-dom/domUtil";
import dom from "zeta-dom/dom";
import { lock, preventLeave, runAsync, subscribeAsync } from "zeta-dom/domLock";
import { closeFlyout, openFlyout } from "brew-js/domAction";

/**
 * @param {Partial<import("./dialog").DialogOptions<any>>} props
 */
export function createDialog(props) {
    var root = document.createElement('div');
    var reactRoot = ReactDOMClient.createRoot(root);
    var scope = createAsyncScope(root);
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
            if (props.modal) {
                root.setAttribute('is-modal', '');
            }
            if (props.onRender) {
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
            }
            promise = resolve().then(function () {
                dom.retainFocus(dom.activeElement, root);
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
