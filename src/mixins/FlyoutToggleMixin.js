import dom from "zeta-dom/dom";
import { definePrototype } from "zeta-dom/util";
import ClassNameMixin from "./ClassNameMixin.js";

const FlyoutToggleMixinSuper = ClassNameMixin.prototype;

export default function FlyoutToggleMixin(mixin) {
    ClassNameMixin.call(this, ['target-opened']);
    this.flyoutMixin = mixin;
}

function triggerFlyoutAction(self, state, trigger, action, args) {
    if ((state.trigger || 'click') === trigger) {
        action.apply(self, args);
    }
}

definePrototype(FlyoutToggleMixin, ClassNameMixin, {
    on: function (trigger) {
        this.state.trigger = trigger;
        return this;
    },
    open: function (value, source) {
        return this.flyoutMixin.open(value, source);
    },
    close: function (value) {
        return this.flyoutMixin.close(value);
    },
    toggle: function (source) {
        return this.flyoutMixin.toggleSelf(source);
    },
    initElement: function (element, state) {
        var self = this;
        FlyoutToggleMixinSuper.initElement.call(self, element, state);
        self.onDispose(dom.on(element, {
            focusin: function () {
                triggerFlyoutAction(self, state, 'focus', self.open, [null, dom.activeElement]);
            },
            focusout: function () {
                triggerFlyoutAction(self, state, 'focus', self.close, []);
            },
            click: function () {
                triggerFlyoutAction(self, state, 'click', self.toggle, [element]);
            }
        }));
    }
});
