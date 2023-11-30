import Mixin from "./Mixin";
import StatefulMixin from "./StatefulMixin";
import { useScrollIntoViewMixin } from "../mixin";

/**
 * Scrolls the applied element into view on conditions.
 *
 * Mixin should be created using {@link useScrollIntoViewMixin} and applied to element by {@link Mixin.use}.
 */
export default class ScrollIntoViewMixin extends StatefulMixin {
    /**
     * Enables scrolling element into view in conditions.
     * @param flag A boolean value that when it changes to `true`, the associated element will be scrolled into view.
     */
    when(flag: boolean): this;

    /**
     * Enables scrolling element into view in conditions.
     * @param deps An array containing values that when one of them changes, the associated element will be scrolled into view.
     */
    when(deps: React.DependencyList): this;
}
