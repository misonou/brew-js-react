import { definePrototype, extend, makeArray } from "../include/zeta-dom/util.js";
import ClassNameMixin from "./ClassNameMixin.js";

const AnimateMixinSuper = ClassNameMixin.prototype;

export default function AnimateMixin() {
    ClassNameMixin.call(this, ['tweening-in', 'tweening-out']);
}

definePrototype(AnimateMixin, ClassNameMixin, {
    next: function () {
        this.effects = undefined;
        this.trigger = undefined;
        return AnimateMixinSuper.next.call(this);
    },
    with: function (props) {
        this.effects = props.effects;
        this.trigger = props.trigger;
        return this;
    },
    withEffects: function () {
        this.effects = makeArray(arguments);
        return this;
    },
    getCustomAttributes: function () {
        return extend({}, AnimateMixinSuper.getCustomAttributes.call(this), {
            'animate-in': (this.effects || []).join(' '),
            'animate-on': this.trigger || 'show'
        });
    }
});
