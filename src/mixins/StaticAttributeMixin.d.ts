import Mixin from "./Mixin";

export default class StaticAttributeMixin extends Mixin {
    /**
     * @param name Name of attribute.
     * @param value Value to be set. Default is empty string.
     */
    constructor(name: string, value?: string);
    /**
     * @param attributes A dictionary containing attributes and their values to be set on rendered elements.
     */
    constructor(attributes: Record<string, string>);
}
