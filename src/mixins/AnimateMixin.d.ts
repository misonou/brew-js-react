import ClassNameMixin from "./ClassNameMixin";
import Mixin from "./Mixin";
import { useAnimateMixin } from "../mixin";

/**
 * To use predefined animation effects, import `brew-js/styles`.
 * Effects can be controlled by `--transition-delay`, `--transition-duration` and `--slide-amount` custom CSS property.
 *
 * To create custom animation effects, write CSS rules for intro and outro animation like:
 * ```css
 * [animate-in~="effect-name"] {
 * }
 * [animate-in~="effect-name"].tweening-in {
 * }
 * [animate-in~="effect-name"].tweening-out {
 * }
 * ```
 */
export type AnimationEffect = Zeta.HintedString<'fade-in' | 'slide-down' | 'slide-up' | 'slide-left' | 'slide-right'>;

/**
 * The predefined triggers are
 * - `show`: Run when entering or leaving a page
 * - `open`: Run when opening or closing a flyout.
 *
 * Custom trigger can be triggered by
 * ```javascript
 * animateIn(element, 'custom-trigger')
 * ```
 */
export type AnimationTrigger = Zeta.HintedString<'show' | 'open'>;

/**
 * Enables intro and/or outro animation for applied elements.
 *
 * Mixin should be created using {@link useAnimateMixin} and applied to element by {@link Mixin.use}.
 */
export default class AnimateMixin extends ClassNameMixin {
    /**
     * Specifies animation effects and trigger for rendered elements.
     * @param props A dictionary specifying animation effects and trigger. The default trigger is `show`.
     * @see {@link AnimationEffect} and {@link AnimationTrigger}.
     */
    with(props: { effects?: AnimationEffect[], trigger?: AnimationTrigger }): this;
    /**
     * Specifies animation effects for rendered elements.
     * @param effects One or more predefined effects.
     * @see {@link AnimationEffect} and {@link AnimationTrigger}.
     */
    withEffects(...effects: AnimationEffect[]): this;
}
