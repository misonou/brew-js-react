import { definePrototype } from "../include/zeta-dom/util.js";
import { setClass } from "../include/zeta-dom/domUtil.js";
import dom from "../include/zeta-dom/dom.js";
import ClassNameMixin from "./ClassNameMixin.js";

const LoadingStateMixinSuper = ClassNameMixin.prototype;

export default function LoadingStateMixin() {
    ClassNameMixin.call(this, ['loading']);
}

definePrototype(LoadingStateMixin, ClassNameMixin, {
    initElement: function (element, state) {
        LoadingStateMixinSuper.initElement.call(this, element, state);
        dom.on(element, {
            asyncStart: function () {
                setClass(element, 'loading', true);
            },
            asyncEnd: function () {
                setClass(element, 'loading', false);
            },
            cancelled: function () {
                setClass(element, 'loading', false);
            }
        });
    }
});
