import { any, definePrototype } from "zeta-dom/util";
import { getClass } from "zeta-dom/domUtil";
import { subscribeAsync } from "zeta-dom/domLock";
import { getDirectiveComponent } from "brew-js/directive";
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
