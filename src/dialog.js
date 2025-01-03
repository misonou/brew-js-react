import { createElement, StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactDOMClient from "@misonou/react-dom-client";
import { createAsyncScope } from "zeta-dom-react";
import { always, either, extend, noop, pick, resolve } from "zeta-dom/util";
import { containsOrEquals, removeNode } from "zeta-dom/domUtil";
import dom from "zeta-dom/dom";
import { lock, preventLeave, runAsync, subscribeAsync } from "zeta-dom/domLock";
import { closeFlyout, isFlyoutOpen, openFlyout } from "brew-js/domAction";

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

function openDialog(element, props) {
    if (!containsOrEquals(dom.root, element)) {
        element.className = props.className || '';
        document.body.appendChild(element);
        if (props.modal) {
            element.setAttribute('is-modal', '');
        }
    }
    var promise = resolve().then(function () {
        dom.retainFocus(dom.activeElement, element);
        return openFlyout(element, null, pick(props, ['focus']));
    });
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
    var root = createDialogElement(props, function () {
        reactRoot.unmount();
    });
    var reactRoot = ReactDOMClient.createRoot(root);
    var scope = createAsyncScope(root);
    var closeDialog = closeFlyout.bind(0, root);

    return {
        root: root,
        close: closeDialog,
        open: debounceAsync(function () {
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
            return openDialog(root, props);
        })
    };
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
