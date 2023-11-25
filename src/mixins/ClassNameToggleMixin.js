import { definePrototype, each, extend, isPlainObject, kv } from "../include/zeta-dom/util.js";
import { setClass } from "../include/zeta-dom/domUtil.js";
import StatefulMixin from "./StatefulMixin.js";

export default function ClassNameToggleMixin() {
    StatefulMixin.call(this);
}

definePrototype(ClassNameToggleMixin, StatefulMixin, {
    withOptions: function (classes) {
        this.classes = extend({}, classes);
    },
    getClassNames: function () {
        return this.classes;
    },
    set: function (name, value) {
        value = isPlainObject(name) || kv(name, value);
        each(this.elements(), function (i, v) {
            setClass(v, value);
        });
        extend(this.classes, value);
    }
});
