import Mixin from "./Mixin";

export default class StaticAttributeMixin extends Mixin {
    /**
     * @param attributes A dictionary containing attributes and their values to be set on rendered elements.
     */
    constructor(attributes: Record<string, string> = {});
}
