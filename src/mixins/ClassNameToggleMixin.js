import { definePrototype, each, extend, isPlainObject, kv } from "zeta-dom/util";
import { setClass } from "zeta-dom/domUtil";
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
