import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import brew from "brew-js";
import { always, either, extend, noop } from "./include/zeta-dom/util.js";
import { containsOrEquals, removeNode } from "./include/zeta-dom/domUtil.js";
import dom from "./include/zeta-dom/dom.js";

/**
 * @param {Partial<import("./dialog").DialogOptions<any>>} props
 */
export function createDialog(props) {
    var root = document.createElement('div');
    var closing = false;
    var promise;

    function closeDialog(value) {
        if (!closing) {
            closing = true;
            brew.closeFlyout(root, value).then(function () {
                closing = false;
                removeNode(root);
                (props.onClose || noop)(root);
                if (props.onRender) {
                    ReactDOM.unmountComponentAtNode(root);
                }
            });
        }
    }

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
                ReactDOM.render(React.createElement(props.onRender, extend({ closeDialog }, props)), root);
            }

            promise = brew.openFlyout(root);
            always(promise, function () {
                promise = null;
            });
            promise.then(props.onCommit);
            (props.onOpen || noop)(root);
            return promise;
        }
    };
}

/**
 * @param {import("./dialog").DialogProps} props
 */
export function Dialog(props) {
    const _props = useState(props)[0];
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
