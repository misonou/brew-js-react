import { defineAliasProperty, definePrototype, each, extend, makeArray } from "../include/zeta-dom/util.js";
import { app } from "../app.js";
import ClassNameMixin from "./ClassNameMixin.js";
import FlyoutToggleMixin from "./FlyoutToggleMixin.js";

const FlyoutMixinSuper = ClassNameMixin.prototype;
var flyoutMixinCounter = 0;

export default function FlyoutMixin() {
    var self = this;
    ClassNameMixin.call(self, ['open', 'closing', 'tweening-in', 'tweening-out']);
    self.modal = false;
    self.tabThrough = false;
    self.isFlyoutOpened = false;
    self.animating = false;
    self.visible = false;
    self.toggle = new FlyoutToggleMixin(self);
}

definePrototype(FlyoutMixin, ClassNameMixin, {
    reset: function () {
        this.toggle.reset();
        return FlyoutMixinSuper.reset.call(this);
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
    onOpen: function (callback) {
        return this.onToggleState(function (opened) {
            if (opened) {
                return callback();
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
        if (!element.id) {
            element.id = 'flyout-' + (++flyoutMixinCounter);
        }
        app.on(element, {
            animationstart: function () {
                self.animating = true;
            },
            animationcomplete: function () {
                self.animating = false;
            },
        }, true);
        setImmediate(function () {
            each(self.toggle.elements(), function (i, v) {
                v.setAttribute('toggle', '#' + element.id);
            });
        });
    },
    clone: function () {
        var self = this;
        var mixin = extend(FlyoutMixinSuper.clone.call(self), {
            toggle: self.toggle.ref.getMixin()
        });
        defineAliasProperty(mixin, 'isFlyoutOpened', self);
        defineAliasProperty(mixin, 'modal', self);
        return mixin;
    },
    onClassNameUpdated: function (element, prevState, state) {
        var self = this;
        self.visible = state.open;
        self.isFlyoutOpened = state.open && !state.closing && !state['tweening-out'];
    }
});
