import { definePrototype, extend } from "../include/zeta-dom/util.js";
import ClassNameMixin from "./ClassNameMixin.js";

const FlyoutToggleMixinSuper = ClassNameMixin.prototype;

export default function FlyoutToggleMixin(mixin) {
    ClassNameMixin.call(this, ['target-opened']);
    this.flyoutMixin = mixin;
}

definePrototype(FlyoutToggleMixin, ClassNameMixin, {
    open: function (value) {
        return this.flyoutMixin.open(value);
    },
    close: function (value) {
        return this.flyoutMixin.close(value);
    },
    getCustomAttributes: function () {
        var element = this.flyoutMixin.elements()[0];
        return extend({}, FlyoutToggleMixinSuper.getCustomAttributes.call(this), {
            'toggle': element && ('#' + element.id)
        });
    }
});
