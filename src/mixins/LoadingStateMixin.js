import { any, definePrototype } from "../include/zeta-dom/util.js";
import { getClass } from "../include/zeta-dom/domUtil.js";
import { subscribeAsync } from "../include/zeta-dom/domLock.js";
import { getDirectiveComponent } from "../include/brew-js/directive.js";
import ClassNameMixin from "./ClassNameMixin.js";

const LoadingStateMixinSuper = ClassNameMixin.prototype;

export default function LoadingStateMixin() {
    ClassNameMixin.call(this, ['loading', 'loading-complete']);
    this.loading = false;
}

definePrototype(LoadingStateMixin, ClassNameMixin, {
    initElement: function (element, state) {
        var self = this;
        LoadingStateMixinSuper.initElement.call(self, element, state);
        getDirectiveComponent(element).enableLoadingClass = true;
        self.onDispose(subscribeAsync(element, function (loading) {
            self.loading = loading || !!any(self.elements(), function (v) {
                return v !== element && getClass(v, 'loading') === true;
            });
        }));
    }
});
