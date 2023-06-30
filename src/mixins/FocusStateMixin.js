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
        this.onDispose(dom.on(element, {
            focusin: function (e) {
                state.focused = e.source;
                setClass(element, 'focused', e.source);
            },
            focusout: function () {
                state.focused = false;
                setClass(element, 'focused', false);
            }
        }));
    },
    getClassNames: function () {
        var classes = {};
        var focused = this.state.focused;
        if (focused) {
            classes.focused = true;
            classes['focused-' + focused] = true;
        }
        return [classes];
    }
});
