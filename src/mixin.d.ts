import Mixin from "./mixins/Mixin";
import AnimateMixin from "./mixins/AnimateMixin";
import AnimateSequenceItemMixin from "./mixins/AnimateSequenceItemMixin";
import AnimateSequenceMixin from "./mixins/AnimateSequenceMixin";
import ClassNameMixin from "./mixins/ClassNameMixin";
import FlyoutMixin, { FlyoutMixinOptions } from "./mixins/FlyoutMixin";
import FlyoutToggleMixin from "./mixins/FlyoutToggleMixin";
import FocusStateMixin from "./mixins/FocusStateMixin";
import LoadingStateMixin from "./mixins/LoadingStateMixin";
import StatefulMixin, { MixinRef } from "./mixins/StatefulMixin";
import ScrollableMixin, { ScrollableMixinOptions } from "./mixins/ScrollableMixin";
import ScrollIntoViewMixin from "./mixins/ScrollIntoViewMixin";

export * from "./mixins/Mixin";
export * from "./mixins/AnimateMixin";
export * from "./mixins/AnimateSequenceItemMixin";
export * from "./mixins/AnimateSequenceMixin";
export * from "./mixins/ClassNameMixin";
export * from "./mixins/ErrorHandlerMixin";
export * from "./mixins/FlyoutMixin";
export * from "./mixins/FocusStateMixin";
export * from "./mixins/LoadingStateMixin";
export * from "./mixins/StatefulMixin";
export * from "./mixins/ScrollableMixin";

export {
    Mixin,
    AnimateMixin,
    AnimateSequenceMixin,
    AnimateSequenceItemMixin,
    ClassNameMixin,
    FlyoutMixin,
    FlyoutToggleMixin,
    FocusStateMixin,
    LoadingStateMixin,
    StatefulMixin,
    ScrollableMixin,
    ScrollIntoViewMixin
}

export function useScrollableMixin(options?: ScrollableMixinOptions): ScrollableMixin;

export function useScrollIntoViewMixin(): ScrollIntoViewMixin;

export function useFlyoutMixin(options?: FlyoutMixinOptions): FlyoutMixin;

export function useAnimateMixin(): AnimateMixin;

export function useAnimateSequenceMixin(selector?: string): AnimateSequenceMixin;

export function useFocusStateMixin(): FocusStateMixin;

export function useLoadingStateMixin(): LoadingStateMixin;

export function useMixin<T extends typeof Mixin>(mixin: T): InstanceType<T>;

export function useMixinRef<T extends StatefulMixin>(mixin: MixinRef<T>): T;

export function useMixinRef<T extends StatefulMixin>(mixin: MixinRef<T> | undefined): T | undefined;
