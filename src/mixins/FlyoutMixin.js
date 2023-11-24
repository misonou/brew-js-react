import { definePrototype, extend, makeArray } from "../include/zeta-dom/util.js";
import { closeFlyout, openFlyout } from "../include/brew-js/domAction.js";
import { app } from "../app.js";
import ClassNameMixin from "./ClassNameMixin.js";
import FlyoutToggleMixin from "./FlyoutToggleMixin.js";

const FlyoutMixinSuper = ClassNameMixin.prototype;
const valueMap = new WeakMap();

export default function FlyoutMixin() {
    var self = this;
    ClassNameMixin.call(self, ['open', 'closing', 'visible', 'tweening-in', 'tweening-out']);
    self.modal = false;
    self.tabThrough = false;
    self.isFlyoutOpened = false;
    self.animating = false;
    self.visible = false;
    self.toggle = new FlyoutToggleMixin(self);
    self.onDispose(function () {
        self.isFlyoutOpened = false;
        self.visible = false;
    });
}

definePrototype(FlyoutMixin, ClassNameMixin, {
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
        return extend({}, FlyoutMixinSuper.getCustomAttributes.call(self), {
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
    open: function (value) {
        var element = this.elements()[0];
        valueMap.set(element, value);
        return openFlyout(element);
    },
    close: function (value) {
        return closeFlyout(this.elements()[0], value);
    },
    onOpen: function (callback) {
        var element = this.elements()[0];
        return this.onToggleState(function (opened) {
            if (opened) {
                return callback(valueMap.get(element));
            }
        });
    },
    onToggleState: function (callback) {
        return this.watch('isFlyoutOpened', callback);
    },
    onVisibilityChanged: function (callback) {
        return this.watch('visible', callback);
    },
    initElement: function (element, state) {
        var self = this;
        FlyoutMixinSuper.initElement.call(self, element, state);
        self.onDispose(app.on(element, {
            animationstart: function () {
                self.animating = true;
            },
            animationcomplete: function () {
                self.animating = false;
            },
        }, true));
    },
    onClassNameUpdated: function (element, prevState, state) {
        var self = this;
        self.visible = state.open;
        self.isFlyoutOpened = state.open && !state.closing && !state['tweening-out'];
    }
});
