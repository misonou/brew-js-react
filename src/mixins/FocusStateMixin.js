import { definePrototype } from "../include/zeta-dom/util.js";
import { setClass } from "../include/zeta-dom/domUtil.js";
import dom from "../include/zeta-dom/dom.js";
import ClassNameMixin from "./ClassNameMixin.js";

const FocusStateMixinSuper = ClassNameMixin.prototype;

export default function FocusStateMixin() {
    ClassNameMixin.call(this, ['focused']);
}

definePrototype(FocusStateMixin, ClassNameMixin, {
    initElement: function (element, state) {
        FocusStateMixinSuper.initElement.call(this, element, state);
        dom.on(element, {
            focusin: function () {
                setClass(element, 'focused', true);
            },
            focusout: function () {
                setClass(element, 'focused', false);
            }
        });
    }
});
