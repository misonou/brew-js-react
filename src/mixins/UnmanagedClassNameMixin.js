import { definePrototype, makeArray } from "zeta-dom/util";
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
