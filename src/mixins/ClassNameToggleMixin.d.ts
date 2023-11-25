import Mixin from "./Mixin";
import StatefulMixin from "./StatefulMixin";
import { useClassNameToggleMixin } from "../mixin";

/**
 * Controls the presence of specified CSS classes on applied elements
 * without re-rendering the host component.
 *
 * Mixin should be created using {@link useClassNameToggleMixin} and applied to element by {@link Mixin.use}.
 */
export default class ClassNameToggleMixin<T extends Zeta.Dictionary<boolean>> extends StatefulMixin {
    /**
     * Toggles specified CSS classes on elements.
     * @param name A CSS class.
     * @param value A boolean that the CSS class is added to elements when `true`; or removed from elements when `false`.
     */
    set(name: Zeta.HintedStringKeyOf<T>, value: boolean): void;

    /**
     * Toggles multiple CSS classes on elements.
     * @param values A dictionary which each entry represents whether the CSS class will be added to or remove from elements.
     */
    set(values: { [P in Zeta.HintedStringKeyOf<T>]?: boolean }): void;
}
