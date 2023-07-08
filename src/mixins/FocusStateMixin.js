import { definePrototype } from "../include/zeta-dom/util.js";
import { setClass } from "../include/zeta-dom/domUtil.js";
import dom from "../include/zeta-dom/dom.js";
import StatefulMixin from "./StatefulMixin.js";

const FocusStateMixinSuper = StatefulMixin.prototype;

export default function FocusStateMixin() {
    StatefulMixin.call(this);
}

definePrototype(FocusStateMixin, StatefulMixin, {
    for: function (ref) {
        this.state.ref = ref;
        return this;
    },
    initElement: function (element, state) {
        FocusStateMixinSuper.initElement.call(this, element, state);
        var checkTarget = function (callback, arg) {
            var ref = state.ref;
            var target = ref && (typeof ref === 'string' ? element.querySelector(ref) : ref.current);
            if (target && !dom.focused(target)) {
                callback(arg || target);
            }
        };
        this.onDispose(dom.on(element, {
            focusin: function (e) {
                state.focused = e.source;
                setClass(element, 'focused', e.source);
                checkTarget(dom.focus);
            },
            focusout: function () {
                state.focused = false;
                setClass(element, 'focused', false);
            },
            focuschange: function () {
                checkTarget(dom.blur, element);
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
