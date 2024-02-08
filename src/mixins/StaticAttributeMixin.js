import { definePrototype, extend, isPlainObject, kv } from "../include/zeta-dom/util.js";
import Mixin from "./Mixin.js";

export default function StaticAttributeMixin(name, value) {
    Mixin.call(this);
    this.attributes = isPlainObject(name) || kv(name, value || '');
}

definePrototype(StaticAttributeMixin, Mixin, {
    getCustomAttributes: function () {
        return extend({}, this.attributes);
    }
});
