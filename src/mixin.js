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
import StaticAttributeMixin from "./mixins/StaticAttributeMixin.js";
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

export const useAnimateMixin = /*#__PURE__*/ createUseFunction(AnimateMixin);
export const useAnimateSequenceMixin = /*#__PURE__*/ createUseFunction(AnimateSequenceMixin);
export const useClassNameToggleMixin = /*#__PURE__*/ createUseFunction(ClassNameToggleMixin);
export const useFlyoutMixin = /*#__PURE__*/ createUseFunction(FlyoutMixin);
export const useFocusStateMixin = /*#__PURE__*/ createUseFunction(FocusStateMixin);
export const useLoadingStateMixin = /*#__PURE__*/ createUseFunction(LoadingStateMixin);
export const useScrollableMixin = /*#__PURE__*/ createUseFunction(ScrollableMixin);
export const useScrollIntoViewMixin = /*#__PURE__*/ createUseFunction(ScrollIntoViewMixin);
export const useUnmanagedClassNameMixin = /*#__PURE__*/ createUseFunction(UnmanagedClassNameMixin);

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
    StaticAttributeMixin,
    ScrollableMixin,
    ScrollIntoViewMixin,
    UnmanagedClassNameMixin,
}
