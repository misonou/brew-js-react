import dom from "zeta-dom/dom";
import { definePrototype } from "zeta-dom/util";
import { toggleFlyout } from "brew-js/domAction";
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
