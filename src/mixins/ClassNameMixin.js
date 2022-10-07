import { definePrototype, each, equal, extend, setImmediate } from "../include/zeta-dom/util.js";
import { containsOrEquals } from "../include/zeta-dom/domUtil.js";
import dom from "../include/zeta-dom/dom.js";
import { watchOwnAttributes } from "../include/zeta-dom/observe.js";
import StatefulMixin from "./StatefulMixin.js";

const ClassNameMixinSuper = StatefulMixin.prototype;

function checkState(self, element, state, isAsync) {
    var classNames = state.classNames;
    var prev = extend({}, classNames);
    each(self.classNames, function (i, v) {
        classNames[v] = element.classList.contains(v);
    });
    if (!equal(prev, classNames)) {
        var cb = self.onClassNameUpdated.bind(self, element, prev, extend({}, classNames));
        if (isAsync) {
            setImmediate(cb);
        } else {
            cb();
        }
    }
}

export default function ClassNameMixin(classNames) {
    StatefulMixin.call(this);
    this.classNames = classNames || [];
}

definePrototype(ClassNameMixin, StatefulMixin, {
    getClassNames: function () {
        return [this.state.classNames];
    },
    getRef: function () {
        var self = this;
        var element = self.state.element;
        if (element && containsOrEquals(dom.root, element)) {
            checkState(self, element, self.state, true);
        }
        return ClassNameMixinSuper.getRef.call(this);
    },
    initState: function () {
        return {
            element: null,
            classNames: {}
        };
    },
    initElement: function (element, state) {
        var self = this;
        watchOwnAttributes(element, 'class', function () {
            checkState(self, element, state);
        });
    },
    onClassNameUpdated: function (element, prevState, state) {
    }
});
