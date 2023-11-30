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

/**
 * Returns a mixin that enables scrollable plugin on the applied element.
 * @param options A dictionary specifying options.
 */
export function useScrollableMixin(options?: ScrollableMixinOptions): ScrollableMixin;

/**
 * Returns a mixin that allows bringing specific element into view.
 */
export function useScrollIntoViewMixin(): ScrollIntoViewMixin;

/**
 * Returns a mixin that provides methods controlling the applied element as a flyout.
 * @param options A dictionary specifying options.
 */
export function useFlyoutMixin(options?: FlyoutMixinOptions): FlyoutMixin;

/**
 * Returns a mixin that enables intro and/or outro animation for applied elements.
 */
export function useAnimateMixin(): AnimateMixin;

/**
 * Returns a mixin that enables animation sequence for descendant elements.
 * If selector is not specified, it requires applying {@link AnimateSequenceMixin.item} mixin to target React elements.
 * @param selector A CSS selector matching elements to be animated in sequence.
 */
export function useAnimateSequenceMixin(selector?: string): AnimateSequenceMixin;

/**
 * Returns a mixin that adds `focused` and `focused-*` CSS classes to applied elements when being focused.
 */
export function useFocusStateMixin(): FocusStateMixin;

/**
 * Returns a mixin that adds `loading` CSS class to applied elements, when asynchronous operation is notified
 * through `notifyAsync` for any descendent elements. The `asyncStart` and `asyncEnd` events are also enabled on the applied elements.
 */
export function useLoadingStateMixin(): LoadingStateMixin;

/**
 * Creates a mixin of the specified type within the lifetime of current component.
 * @param mixin Constructor of the mixin type.
 */
export function useMixin<T extends typeof Mixin>(mixin: T): InstanceType<T>;

/**
 * Uses mixin passed from parent component.
 * @param mixin A {@link MixinRef} object.
 */
export function useMixinRef<T extends StatefulMixin>(mixin: MixinRef<T>): T;

/**
 * Uses mixin passed from parent component.
 * @param mixin A {@link MixinRef} object.
 */
export function useMixinRef<T extends StatefulMixin>(mixin: MixinRef<T> | undefined): T | undefined;
