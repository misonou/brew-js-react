import { createPrivateStore, definePrototype, inherit, randomId, values } from "../include/zeta-dom/util.js";
import Mixin from "./Mixin.js";

const _ = createPrivateStore();

function MixinRefImpl(mixin) {
    this.mixin = mixin;
}

definePrototype(MixinRefImpl, {
    getMixin: function () {
        return this.mixin;
    }
});

export default function StatefulMixin() {
    Mixin.call(this);
    _(this, {
        states: {},
        prefix: '',
        counter: 0
    });
}

definePrototype(StatefulMixin, Mixin, {
    get ref() {
        const self = this;
        const state = self.state;
        self.next();
        return state.ref || (state.ref = new MixinRefImpl(self.clone()));
    },
    get state() {
        const obj = _(this);
        const key = obj.prefix + obj.counter;
        return obj.states[key] || (obj.states[key] = this.initState());
    },
    reset: function () {
        _(this).counter = 0;
        return this;
    },
    next: function () {
        _(this).counter++;
        return this;
    },
    getRef: function () {
        const self = this;
        const state = self.state;
        return function (current) {
            if (current && current !== state.element) {
                state.element = current;
                self.initElement(current, state);
            }
        };
    },
    elements: function () {
        return values(_(this).states).map(function (v) {
            return v.element;
        }).filter(function (v) {
            return v;
        });
    },
    initState: function () {
        return { element: null };
    },
    initElement: function (element, state) {
    },
    clone: function () {
        const clone = inherit(Object.getPrototypeOf(this));
        _(clone, {
            states: _(this).states,
            prefix: randomId() + '.',
            counter: 0
        });
        return clone;
    }
});
