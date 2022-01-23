import { definePrototype, each, equal, extend } from "../include/zeta-dom/util.js";
import dom from "../include/zeta-dom/dom.js";
import StatefulMixin from "./StatefulMixin.js";

const ClassNameMixinSuper = StatefulMixin.prototype;

export default function ClassNameMixin(classNames) {
    StatefulMixin.call(this);
    this.classNames = classNames || [];
}

definePrototype(ClassNameMixin, StatefulMixin, {
    getClassNames: function () {
        return [this.state.classNames];
    },
    initState: function () {
        return {
            element: null,
            classNames: {}
        };
    },
    initElement: function (element, state) {
        var self = this;
        dom.watchAttributes(element, ['class'], function (nodes) {
            if (nodes.includes(element)) {
                const prev = extend({}, state.classNames);
                each(self.classNames, function (i, v) {
                    state.classNames[v] = element.classList.contains(v);
                });
                if (!equal(prev, state.classNames)) {
                    self.onClassNameUpdated(element, prev, state.classNames);
                }
            }
        });
    },
    clone: function () {
        return extend(ClassNameMixinSuper.clone.call(this), { classNames: this.classNames });
    },
    onClassNameUpdated: function (element, prevState, state) {
    }
});
