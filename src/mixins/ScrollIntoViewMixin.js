import { definePrototype, equal, makeArray, setImmediateOnce } from "../include/zeta-dom/util.js";
import { scrollIntoView } from "../include/zeta-dom/domUtil.js";
import StatefulMixin from "./StatefulMixin.js";

export default function ScrollIntoViewMixin() {
    StatefulMixin.call(this);
}

definePrototype(ScrollIntoViewMixin, StatefulMixin, {
    when: function (deps) {
        var state = this.state;
        var callback = state.callback || (state.callback = function () {
            scrollIntoView(state.element);
        });
        if (state.deps && !equal(deps, state.deps)) {
            setImmediateOnce(callback);
        }
        state.deps = makeArray(deps);
        return this;
    }
});
