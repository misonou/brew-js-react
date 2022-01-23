import { definePrototype, inherit, randomId, values } from "../include/zeta-dom/util.js";
import Mixin from "./Mixin.js";

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
    this.states = {};
    this.prefix = '';
    this.counter = 0;
}

definePrototype(StatefulMixin, Mixin, {
    get ref() {
        const state = this.state;
        this.next();
        return state.ref || (state.ref = new MixinRefImpl(this.clone()));
    },
    get state() {
        const self = this;
        const key = self.prefix + self.counter;
        return self.states[key] || (self.states[key] = self.initState());
    },
    reset: function () {
        this.counter = 0;
        return this;
    },
    next: function () {
        this.counter++;
        return this;
    },
    getRef: function () {
        const self = this;
        const state = self.state;
        return function (current) {
            if (current !== state.element) {
                state.element = current;
                if (current) {
                    self.initElement(current, state);
                }
            }
        };
    },
    elements: function () {
        return values(this.states).map(function (v) {
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
        return inherit(Object.getPrototypeOf(this), {
            states: this.states,
            prefix: randomId() + '.',
            counter: 0
        });
    }
});
