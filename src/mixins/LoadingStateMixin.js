import { definePrototype } from "../include/zeta-dom/util.js";
import { setClass } from "../include/zeta-dom/domUtil.js";
import { lock } from "../include/zeta-dom/domLock.js";
import dom from "../include/zeta-dom/dom.js";
import StatefulMixin from "./StatefulMixin.js";

const LoadingStateMixinSuper = StatefulMixin.prototype;

export default function LoadingStateMixin() {
    StatefulMixin.call(this);
}

definePrototype(LoadingStateMixin, StatefulMixin, {
    initElement: function (element, state) {
        LoadingStateMixinSuper.initElement.call(this, element, state);
        lock(element);
        this.onDispose(dom.on(element, {
            asyncStart: function () {
                state.loading = true;
                setClass(element, 'loading', true);
            },
            asyncEnd: function () {
                state.loading = false;
                setClass(element, 'loading', false);
            },
            cancelled: function () {
                state.loading = false;
                setClass(element, 'loading', false);
            }
        }));
    },
    getClassNames: function () {
        return [{ loading: !!this.state.loading }];
    }
});
