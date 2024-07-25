import { definePrototype, each, equal, extend, fill } from "zeta-dom/util";
import { setClass } from "zeta-dom/domUtil";
import { watchOwnAttributes } from "zeta-dom/observe";
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
    initElement: function (element, state) {
        var self = this;
        state.classNames = fill(self.classNames, false);
        checkState(self, element, state);
        state.onDispose(watchOwnAttributes(element, 'class', function () {
            checkState(self, element, state, true);
        }).dispose);
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
