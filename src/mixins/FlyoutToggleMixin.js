import dom from "zeta-dom/dom";
import { definePrototype } from "zeta-dom/util";
import ClassNameMixin from "./ClassNameMixin.js";

const FlyoutToggleMixinSuper = ClassNameMixin.prototype;

export default function FlyoutToggleMixin(mixin) {
    ClassNameMixin.call(this, ['target-opened']);
    this.flyoutMixin = mixin;
}

definePrototype(FlyoutToggleMixin, ClassNameMixin, {
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
        self.onDispose(dom.on(element, 'click', function () {
            self.toggle(element);
        }));
    }
});
