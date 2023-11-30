import AnimateSequenceMixin from "./AnimateSequenceMixin";
import ClassNameMixin from "./ClassNameMixin";

/**
 * Marks element to be a target of this animate sequence.
 *
 * Instances of this mixin is exposed by {@link AnimateSequenceMixin.item}.
 */
export default class AnimateSequenceItemMixin extends ClassNameMixin {
    constructor(className: string);
}
