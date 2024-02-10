import React from "react";
import StatefulMixin from "./StatefulMixin";
import Mixin from "./Mixin";
import { useFocusStateMixin } from "../mixin";

/**
 * Adds `focused` and `focused-*` CSS classes to applied elements when being focused.
 *
 * Mixin should be created using {@link useFocusStateMixin} and applied to element by {@link Mixin.use}.
 */
export default class FocusStateMixin extends StatefulMixin {
    /**
     * Sets focus state based on another element.
     *
     * If the element with this mixin gain focus, the target element will also gain focus.
     * Likewise, if the target element lost focus, the element with this mixin will also lose focus.
     *
     * @param target A CSS selector or a ref object.
     */
    for(target: string | React.RefObject<Element>): this;
}
