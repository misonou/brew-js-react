import { definePrototype, extend } from "../include/zeta-dom/util.js";
import ClassNameMixin from "./ClassNameMixin.js";

const FlyoutToggleMixinSuper = ClassNameMixin.prototype;

export default function FlyoutToggleMixin(mixin) {
    ClassNameMixin.call(this, ['target-opened']);
    this.flyoutMixin = mixin;
}

definePrototype(FlyoutToggleMixin, ClassNameMixin, {
    getCustomAttributes: function () {
        var element = this.flyoutMixin.elements()[0];
        return extend({}, FlyoutToggleMixinSuper.getCustomAttributes.call(this), {
            'toggle': element && ('#' + element.id)
        });
    },
    clone: function () {
        return extend(FlyoutToggleMixinSuper.clone.call(this), { flyoutMixin: this.flyoutMixin });
    }
});
