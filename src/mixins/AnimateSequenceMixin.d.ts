import AnimateMixin from "./AnimateMixin";
import AnimateSequenceItemMixin from "./AnimateSequenceItemMixin";
import Mixin from "./Mixin";
import { useAnimateSequenceMixin } from "../mixin";

/**
 * Enables animation sequence for descendant elements.
 *
 * Mixin should be created using {@link useAnimateSequenceMixin} and applied to element by {@link Mixin.use}.
 */
export default class AnimateSequenceMixin extends AnimateMixin {
    /**
     * Returns a mixin that marks element to be a target of this animate sequence.
     */
    readonly item: AnimateSequenceItemMixin;
}
