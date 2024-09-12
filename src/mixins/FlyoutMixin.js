import { combineFn, definePrototype, extend, isFunction, makeArray, noop, pick, resolve, throws } from "zeta-dom/util";
import { closeFlyout, isFlyoutOpen, openFlyout, toggleFlyout } from "brew-js/domAction";
import { app } from "../app.js";
import ClassNameMixin from "./ClassNameMixin.js";
import FlyoutToggleMixin from "./FlyoutToggleMixin.js";

const FlyoutMixinSuper = ClassNameMixin.prototype;
const valueMap = new WeakMap();

function toggleSelf(self, flag, value, source) {
    if (!flag && !isFlyoutOpen(self.element)) {
        return resolve();
    }
    var options = self.getOptions();
    return flag ? openFlyout(self.element, value, source, options) : toggleFlyout(self.element, source, options);
}

export default function FlyoutMixin() {
    var self = this;
    ClassNameMixin.call(self, ['open', 'closing', 'visible', 'tweening-in', 'tweening-out']);
    self.modal = false;
    self.tabThrough = false;
    self.isFlyoutOpened = false;
    self.animating = false;
    self.visible = false;
    self.initialFocus = undefined;
    self.toggle = new FlyoutToggleMixin(self);
    self.onDispose(function () {
        self.isFlyoutOpened = false;
        self.visible = false;
        self.toggle.dispose();
    });
}

definePrototype(FlyoutMixin, ClassNameMixin, {
    get element() {
        return this.elements()[0] || null;
    },
    getOptions: function () {
        var self = this;
        var options = pick(self, ['closeOnBlur', 'containment']);
        if (self.initialFocus !== undefined) {
            options.focus = self.initialFocus;
        }
        return options;
    },
    next: function () {
        this.effects = undefined;
        return FlyoutMixinSuper.next.call(this);
    },
    withEffects: function () {
        this.effects = makeArray(arguments);
        return this;
    },
    getCustomAttributes: function () {
        var self = this;
        return extend(FlyoutMixinSuper.getCustomAttributes.call(self), {
            'is-flyout': '',
            'swipe-dismiss': self.swipeToDismiss
        }, self.modal && {
            'is-modal': ''
        }, self.tabThrough && {
            'tab-through': ''
        }, self.effects && {
            'animate-on': 'open',
            'animate-in': self.effects.join(' '),
            'animate-out': ''
        });
    },
    open: function (value, source) {
        return toggleSelf(this, true, value, source);
    },
    close: function (value) {
        return closeFlyout(this.element, value);
    },
    toggleSelf: function (flag, source) {
        if (typeof flag !== 'boolean') {
            source = flag;
            flag = !isFlyoutOpen(this.element);
        }
        return toggleSelf(this, flag, undefined, source);
    },
    onOpen: function (callback) {
        return this.onToggleState(function (opened) {
            if (opened) {
                callback(valueMap.get(this.element));
            }
        });
    },
    onToggleState: function (callback) {
        return this.watch('isFlyoutOpened', callback);
    },
    onVisibilityChanged: function (callback) {
        return this.watch('visible', callback);
    },
    whenVisible: function (effect) {
        var dispose = [];
        dispose[0] = this.watch('visible', function (visible) {
            dispose[1] = (visible ? isFunction(effect()) : dispose[1] && void dispose[1]()) || noop;
        }, true);
        return combineFn(dispose);
    },
    initElement: function (element, state) {
        var self = this;
        if (self.elements()[1]) {
            throws('FlyoutMixin only supports single element');
        }
        FlyoutMixinSuper.initElement.call(self, element, state);
        state.onDispose(app.on(element, {
            flyoutshow: function (e) {
                valueMap.set(element, e.data);
                self.isFlyoutOpened = true;
                self.visible = true;
            },
            flyoutclose: function () {
                self.isFlyoutOpened = false;
            },
            flyouthide: function () {
                self.visible = false;
            },
            animationstart: function () {
                self.animating = true;
            },
            animationcomplete: function () {
                self.animating = false;
            },
        }, true));
    }
});
