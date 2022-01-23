import { definePrototype, extend } from "../include/zeta-dom/util.js";
import AnimateMixin from "./AnimateMixin.js";
import AnimateSequenceItemMixin from "./AnimateSequenceItemMixin.js";

const AnimateSequenceMixinSuper = AnimateMixin.prototype;
var animateSequenceMixinCounter = 0;

export default function AnimateSequenceMixin() {
    AnimateMixin.call(this);
    this.className = 'brew-anim-' + (++animateSequenceMixinCounter);
    this.item = new AnimateSequenceItemMixin(this.className);
}

definePrototype(AnimateSequenceMixin, AnimateMixin, {
    reset: function () {
        this.item.reset();
        return AnimateSequenceMixinSuper.reset.call(this);
    },
    getCustomAttributes: function () {
        return extend({}, AnimateSequenceMixinSuper.getCustomAttributes.call(this), {
            'animate-sequence': '.' + this.className
        });
    },
    clone: function () {
        return extend(AnimateSequenceMixinSuper.clone.call(this), {
            item: this.item.ref.getMixin()
        });
    }
});
