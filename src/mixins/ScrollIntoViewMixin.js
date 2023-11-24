import { definePrototype, equal, extend, makeArray, setImmediateOnce } from "../include/zeta-dom/util.js";
import { scrollIntoView } from "../include/zeta-dom/domUtil.js";
import StatefulMixin from "./StatefulMixin.js";

export default function ScrollIntoViewMixin() {
    StatefulMixin.call(this);
}

definePrototype(ScrollIntoViewMixin, StatefulMixin, {
    when: function (deps) {
        this.state.deps = makeArray(deps);
        return this;
    },
    initElement: function (element, state) {
        state.callback = function () {
            scrollIntoView(element);
        };
    },
    mergeState: function (element, state, newState) {
        if (newState.deps && !equal(newState.deps, state.deps)) {
            setImmediateOnce(state.callback);
        }
        extend(state, newState);
    }
});
