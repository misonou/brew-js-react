import { any, definePrototype } from "../include/zeta-dom/util.js";
import { getClass, setClass } from "../include/zeta-dom/domUtil.js";
import { subscribeAsync } from "../include/zeta-dom/domLock.js";
import StatefulMixin from "./StatefulMixin.js";

const LoadingStateMixinSuper = StatefulMixin.prototype;

export default function LoadingStateMixin() {
    StatefulMixin.call(this);
    this.loading = false;
}

definePrototype(LoadingStateMixin, StatefulMixin, {
    initElement: function (element, state) {
        var self = this;
        LoadingStateMixinSuper.initElement.call(self, element, state);
        self.onDispose(subscribeAsync(element, function (loading) {
            setClass(element, 'loading', loading);
            self.loading = loading || !!any(self.elements(), function (v) {
                return v !== element && getClass(v, 'loading') === true;
            });
        }));
    },
    onLayoutEffect: function (element, state) {
        setClass(element, 'loading', state.loading);
    }
});
