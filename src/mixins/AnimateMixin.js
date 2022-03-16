import { definePrototype, extend, makeArray } from "../include/zeta-dom/util.js";
import ClassNameMixin from "./ClassNameMixin.js";

const AnimateMixinSuper = ClassNameMixin.prototype;

export default function AnimateMixin() {
    ClassNameMixin.call(this, ['tweening-in', 'tweening-out']);
}

definePrototype(AnimateMixin, ClassNameMixin, {
    next: function () {
        var self = this;
        self.effects = undefined;
        self.trigger = undefined;
        return AnimateMixinSuper.next.call(self);
    },
    with: function (props) {
        var self = this;
        self.effects = props.effects;
        self.trigger = props.trigger;
        return self;
    },
    withEffects: function () {
        this.effects = makeArray(arguments);
        return this;
    },
    getCustomAttributes: function () {
        var self = this;
        return extend({}, AnimateMixinSuper.getCustomAttributes.call(self), {
            'animate-in': (self.effects || []).join(' '),
            'animate-on': self.trigger || 'show'
        });
    }
});
