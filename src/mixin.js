import { useState } from "react";
import Mixin from "./mixins/Mixin.js";
import AnimateMixin from "./mixins/AnimateMixin.js";
import AnimateSequenceItemMixin from "./mixins/AnimateSequenceItemMixin.js";
import AnimateSequenceMixin from "./mixins/AnimateSequenceMixin.js";
import ClassNameMixin from "./mixins/ClassNameMixin.js";
import FlyoutMixin from "./mixins/FlyoutMixin.js";
import FocusStateMixin from "./mixins/FocusStateMixin.js";
import LoadingStateMixin from "./mixins/LoadingStateMixin.js";
import StatefulMixin from "./mixins/StatefulMixin.js";
import ScrollableMixin from "./mixins/ScrollableMixin.js";

export function useScrollableMixin(options) {
    return useState(function () {
        return new ScrollableMixin();
    })[0].reset().withOptions(options);
}

export function useFlyoutMixin() {
    return useState(function () {
        return new FlyoutMixin();
    })[0].reset();
}

export function useAnimateMixin() {
    return useState(function () {
        return new AnimateMixin();
    })[0].reset();
}

export function useAnimateSequenceMixin() {
    return useState(function () {
        return new AnimateSequenceMixin();
    })[0].reset();
}

export function useFocusStateMixin() {
    return useState(function () {
        return new FocusStateMixin();
    })[0].reset();
}

export function useLoadingStateMixin() {
    return useState(() => {
        return new LoadingStateMixin();
    })[0].reset();
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
    FlyoutMixin,
    FocusStateMixin,
    LoadingStateMixin,
    StatefulMixin,
    ScrollableMixin
}
