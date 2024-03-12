import { definePrototype } from "zeta-dom/util";
import { setClass } from "zeta-dom/domUtil";
import dom from "zeta-dom/dom";
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
    onLayoutEffect: function (element, state) {
        setClass(element, 'focused', state.focused);
    }
});
