import { definePrototype } from "../include/zeta-dom/util.js";
import { setClass } from "../include/zeta-dom/domUtil.js";
import { subscribeAsync } from "../include/zeta-dom/domLock.js";
import StatefulMixin from "./StatefulMixin.js";

const LoadingStateMixinSuper = StatefulMixin.prototype;

export default function LoadingStateMixin() {
    StatefulMixin.call(this);
}

definePrototype(LoadingStateMixin, StatefulMixin, {
    initElement: function (element, state) {
        LoadingStateMixinSuper.initElement.call(this, element, state);
        this.onDispose(subscribeAsync(element, function (loading) {
            state.loading = loading;
            setClass(element, 'loading', loading);
        }));
    },
    onLayoutEffect: function (element, state) {
        setClass(element, 'loading', state.loading);
    }
});
