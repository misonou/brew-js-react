import { definePrototype } from "../include/zeta-dom/util.js";
import ClassNameMixin from "./ClassNameMixin.js";

const AnimateSequenceItemMixinSuper = ClassNameMixin.prototype;

export default function AnimateSequenceItemMixin(className) {
    ClassNameMixin.call(this, ['tweening-in', 'tweening-out']);
    this.className = className;
}

definePrototype(AnimateSequenceItemMixin, ClassNameMixin, {
    getClassNames: function () {
        return [this.className].concat(AnimateSequenceItemMixinSuper.getClassNames.call(this));
    }
});
