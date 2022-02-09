import { useState } from "react";
import Mixin from "./mixins/Mixin.js";
import AnimateMixin from "./mixins/AnimateMixin.js";
import AnimateSequenceItemMixin from "./mixins/AnimateSequenceItemMixin.js";
import AnimateSequenceMixin from "./mixins/AnimateSequenceMixin.js";
import ClassNameMixin from "./mixins/ClassNameMixin.js";
import ErrorHandlerMixin from "./mixins/ErrorHandlerMixin.js";
import FlyoutMixin from "./mixins/FlyoutMixin.js";
import FocusStateMixin from "./mixins/FocusStateMixin.js";
import LoadingStateMixin from "./mixins/LoadingStateMixin.js";
import StatefulMixin from "./mixins/StatefulMixin.js";
import ScrollableMixin from "./mixins/ScrollableMixin.js";

function createUseFunction(ctor) {
    return function () {
        return useState(function () {
            return new ctor();
        })[0].reset();
    };
}

export const useAnimateMixin = createUseFunction(AnimateMixin);
export const useAnimateSequenceMixin = createUseFunction(AnimateSequenceMixin);
export const useErrorHandlerMixin = createUseFunction(ErrorHandlerMixin);
export const useFlyoutMixin = createUseFunction(FlyoutMixin);
export const useFocusStateMixin = createUseFunction(FocusStateMixin);
export const useLoadingStateMixin = createUseFunction(LoadingStateMixin);

export function useScrollableMixin(options) {
    return createUseFunction(ScrollableMixin)().withOptions(options);
}

export function useMixinRef(mixin) {
    return mixin.getMixin().reset();
}

export {
    Mixin,
    AnimateMixin,
    AnimateSequenceItemMixin,
    AnimateSequenceMixin,
    ClassNameMixin,
    ErrorHandlerMixin,
    FlyoutMixin,
    FocusStateMixin,
    LoadingStateMixin,
    StatefulMixin,
    ScrollableMixin
}
