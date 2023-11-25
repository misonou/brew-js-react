import { definePrototype, makeArray } from "../include/zeta-dom/util.js";
import ClassNameMixin from "./ClassNameMixin.js";

export default function UnmanagedClassNameMixin() {
    ClassNameMixin.call(this);
}

definePrototype(UnmanagedClassNameMixin, ClassNameMixin, {
    memorize: function () {
        this.classNames = makeArray(arguments);
        return this;
    }
});
