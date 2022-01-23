import { definePrototype, extend } from "../include/zeta-dom/util.js";
import Mixin from "./Mixin.js";

export default function StaticAttributeMixin(attributes) {
    Mixin.call(this);
    this.attributes = attributes || {};
}

definePrototype(StaticAttributeMixin, Mixin, {
    getCustomAttributes: function () {
        return extend({}, this.attributes);
    }
});
