import Mixin from "./Mixin";

export default class StaticAttributeMixin<P = {}> extends Mixin {
    /**
     * @param name Name of attribute.
     * @param value Value to be set. Default is empty string.
     */
    constructor(name: keyof P, value?: P[keyof P]);
    /**
     * @param attributes A dictionary containing attributes and their values to be set on rendered elements.
     */
    constructor(attributes: P);

    /**
     * Applies custom attributes to element.
     * @private It is used internally by mixins and is declared for type inference.
     */
    getCustomAttributes(): P;
}
