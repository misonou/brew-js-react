import { definePrototype } from "../include/zeta-dom/util.js";
import { setClass } from "../include/zeta-dom/domUtil.js";
import dom from "../include/zeta-dom/dom.js";
import StatefulMixin from "./StatefulMixin.js";

const FocusStateMixinSuper = StatefulMixin.prototype;

export default function FocusStateMixin() {
    StatefulMixin.call(this);
}

definePrototype(FocusStateMixin, StatefulMixin, {
    initElement: function (element, state) {
        FocusStateMixinSuper.initElement.call(this, element, state);
        dom.on(element, {
            focusin: function () {
                state.focused = true;
                setClass(element, 'focused', true);
            },
            focusout: function () {
                state.focused = false;
                setClass(element, 'focused', false);
            }
        });
    },
    getClassNames: function () {
        return [{ focused: !!this.state.focused }];
    }
});
