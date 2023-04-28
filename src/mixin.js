import { useEffect, useState } from "react";
import { extend, setImmediate } from "./include/zeta-dom/util.js";
import Mixin from "./mixins/Mixin.js";
import AnimateMixin from "./mixins/AnimateMixin.js";
import AnimateSequenceItemMixin from "./mixins/AnimateSequenceItemMixin.js";
import AnimateSequenceMixin from "./mixins/AnimateSequenceMixin.js";
import ClassNameMixin from "./mixins/ClassNameMixin.js";
import FlyoutMixin from "./mixins/FlyoutMixin.js";
import FlyoutToggleMixin from "./mixins/FlyoutToggleMixin.js";
import FocusStateMixin from "./mixins/FocusStateMixin.js";
import LoadingStateMixin from "./mixins/LoadingStateMixin.js";
import StatefulMixin from "./mixins/StatefulMixin.js";
import ScrollableMixin from "./mixins/ScrollableMixin.js";

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

function disposeMixin(mixin) {
    mixin.disposed = true;
    setImmediate(function () {
        if (mixin.disposed) {
            mixin.dispose();
        }
    });
}

export const useAnimateMixin = createUseFunction(AnimateMixin);
export const useAnimateSequenceMixin = createUseFunction(AnimateSequenceMixin);
export const useFlyoutMixin = createUseFunction(FlyoutMixin);
export const useFocusStateMixin = createUseFunction(FocusStateMixin);
export const useLoadingStateMixin = createUseFunction(LoadingStateMixin);
export const useScrollableMixin = createUseFunction(ScrollableMixin);

export function useMixin(ctor) {
    var mixin = useState(function () {
        return new ctor();
    })[0].reset();
    useEffect(function () {
        mixin.disposed = false;
        return disposeMixin.bind(0, mixin);
    }, []);
    return mixin;
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
    FlyoutMixin,
    FlyoutToggleMixin,
    FocusStateMixin,
    LoadingStateMixin,
    StatefulMixin,
    ScrollableMixin
}
