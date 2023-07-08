import React from "react";
import ClassNameMixin from "./ClassNameMixin";

export default class FocusStateMixin extends ClassNameMixin {
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
