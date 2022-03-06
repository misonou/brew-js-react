import { defineAliasProperty, definePrototype, each, extend, makeArray } from "../include/zeta-dom/util.js";
import { app } from "../app.js";
import ClassNameMixin from "./ClassNameMixin.js";

const FlyoutMixinSuper = ClassNameMixin.prototype;
var flyoutMixinCounter = 0;

export default function FlyoutMixin() {
    ClassNameMixin.call(this, ['open', 'closing', 'tweening-in', 'tweening-out']);
    this.modal = false;
    this.isFlyoutOpened = false;
    this.animating = false;
    this.visible = false;
    this.toggle = new ClassNameMixin(['target-opened']);
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
        return extend({}, FlyoutMixinSuper.getCustomAttributes.call(this), {
            'is-flyout': ''
        }, this.modal && {
            'is-modal': ''
        }, this.effects && {
            'animate-on': 'open',
            'animate-in': this.effects.join(' '),
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
        var mixin = extend(FlyoutMixinSuper.clone.call(this), {
            toggle: this.toggle.ref.getMixin()
        });
        defineAliasProperty(mixin, 'isFlyoutOpened', this);
        defineAliasProperty(mixin, 'modal', this);
        return mixin;
    },
    onClassNameUpdated: function (element, prevState, state) {
        var self = this;
        var isAdded = function (v) {
            return prevState[v] !== state[v] && state[v];
        };
        var isRemoved = function (v) {
            return prevState[v] !== state[v] && !state[v];
        };
        if (isAdded('open')) {
            self.isFlyoutOpened = true;
            self.visible = true;
        } else if (isAdded('closing') || isAdded('tweening-out')) {
            self.isFlyoutOpened = false;
        } else if (isRemoved('open')) {
            self.visible = false;
        }
    }
});
