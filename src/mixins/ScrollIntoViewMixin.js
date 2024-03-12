import { definePrototype, equal, extend, setImmediateOnce } from "zeta-dom/util";
import { scrollIntoView } from "zeta-dom/domUtil";
import StatefulMixin from "./StatefulMixin.js";

export default function ScrollIntoViewMixin() {
    StatefulMixin.call(this);
}

definePrototype(ScrollIntoViewMixin, StatefulMixin, {
    when: function (deps) {
        this.state.deps = deps;
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
