import { definePrototype, each, equal, extend, fill } from "../include/zeta-dom/util.js";
import { setClass } from "../include/zeta-dom/domUtil.js";
import { watchOwnAttributes } from "../include/zeta-dom/observe.js";
import StatefulMixin from "./StatefulMixin.js";

function checkState(self, element, state, fireEvent) {
    var classNames = state.classNames;
    var prev = extend({}, classNames);
    each(classNames, function (i) {
        classNames[i] = element.classList.contains(i);
    });
    if (fireEvent && !equal(state.prev || prev, classNames)) {
        state.prev = prev;
        self.onClassNameUpdated(element, prev, extend({}, classNames));
    }
}

export default function ClassNameMixin(classNames) {
    StatefulMixin.call(this);
    this.classNames = classNames || [];
}

definePrototype(ClassNameMixin, StatefulMixin, {
    initState: function () {
        return {
            element: null,
            classNames: fill(this.classNames, false)
        };
    },
    initElement: function (element, state) {
        var self = this;
        checkState(self, element, state);
        watchOwnAttributes(element, 'class', function () {
            checkState(self, element, state, true);
        });
    },
    onLayoutEffect: function (element, state) {
        setClass(element, state.classNames);
    },
    onBeforeUpdate: function (element, state) {
        checkState(this, element, state);
    },
    onClassNameUpdated: function (element, prevState, state) {
    }
});
