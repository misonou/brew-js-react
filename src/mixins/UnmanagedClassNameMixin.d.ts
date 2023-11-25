import ClassNameMixin from "./ClassNameMixin"
import Mixin from "./Mixin";
import { useUnmanagedClassNameMixin } from "../mixin"

/**
 * Keeps track and preserves the presence of specified CSS classes on applied elements
 * while the host component is re-rendered.
 *
 * Mixin should be created using {@link useUnmanagedClassNameMixin} and applied to element by {@link Mixin.use}.
 */
export default class UnmanagedClassNameMixin extends ClassNameMixin {
    /**
     * Memorizes which specified CSS class names are present on the element,
     * and re-apply them in the next render.
     * @param classes A list of CSS class names.
     */
    memorize(...classes: string[]): this;
}
