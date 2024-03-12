import { useSingleton } from "zeta-dom-react";
import { extend } from "zeta-dom/util";
import Mixin from "./mixins/Mixin.js";
import AnimateMixin from "./mixins/AnimateMixin.js";
import AnimateSequenceItemMixin from "./mixins/AnimateSequenceItemMixin.js";
import AnimateSequenceMixin from "./mixins/AnimateSequenceMixin.js";
import ClassNameMixin from "./mixins/ClassNameMixin.js";
import ClassNameToggleMixin from "./mixins/ClassNameToggleMixin.js";
import FlyoutMixin from "./mixins/FlyoutMixin.js";
import FlyoutToggleMixin from "./mixins/FlyoutToggleMixin.js";
import FocusStateMixin from "./mixins/FocusStateMixin.js";
import LoadingStateMixin from "./mixins/LoadingStateMixin.js";
import StatefulMixin from "./mixins/StatefulMixin.js";
import ScrollableMixin from "./mixins/ScrollableMixin.js";
import ScrollIntoViewMixin from "./mixins/ScrollIntoViewMixin.js";
import UnmanagedClassNameMixin from "./mixins/UnmanagedClassNameMixin.js";

function extendSelf(options) {
    extend(this, options);
}

function createUseFunction(ctor) {
    return function () {
        var mixin = useMixin(ctor);
        (mixin.withOptions || extendSelf).apply(mixin, arguments);
        return mixin;
    };
}

export const useAnimateMixin = createUseFunction(AnimateMixin);
export const useAnimateSequenceMixin = createUseFunction(AnimateSequenceMixin);
export const useClassNameToggleMixin = createUseFunction(ClassNameToggleMixin);
export const useFlyoutMixin = createUseFunction(FlyoutMixin);
export const useFocusStateMixin = createUseFunction(FocusStateMixin);
export const useLoadingStateMixin = createUseFunction(LoadingStateMixin);
export const useScrollableMixin = createUseFunction(ScrollableMixin);
export const useScrollIntoViewMixin = createUseFunction(ScrollIntoViewMixin);
export const useUnmanagedClassNameMixin = createUseFunction(UnmanagedClassNameMixin);

export function useMixin(ctor) {
    return useSingleton(function () {
        return new ctor();
    }).reset();
}

export function useMixinRef(mixin) {
    return mixin && mixin.getMixin().reset();
}

export {
    Mixin,
    AnimateMixin,
    AnimateSequenceItemMixin,
    AnimateSequenceMixin,
    ClassNameMixin,
    ClassNameToggleMixin,
    FlyoutMixin,
    FlyoutToggleMixin,
    FocusStateMixin,
    LoadingStateMixin,
    StatefulMixin,
    ScrollableMixin,
    ScrollIntoViewMixin,
    UnmanagedClassNameMixin,
}
