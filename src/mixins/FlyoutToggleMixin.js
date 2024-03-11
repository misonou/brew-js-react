import dom from "../include/zeta-dom/dom.js";
import { definePrototype } from "../include/zeta-dom/util.js";
import { toggleFlyout } from "../include/brew-js/domAction.js";
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
    initElement: function (element, state) {
        var self = this;
        FlyoutToggleMixinSuper.initElement.call(self, element, state);
        self.onDispose(dom.on(element, 'click', function () {
            toggleFlyout(self.flyoutMixin.elements()[0], element, self.flyoutMixin.getOptions());
        }));
    }
});
