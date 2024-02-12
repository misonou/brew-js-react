import { combineFn, createPrivateStore, definePrototype, extend, keys, map, pipe, watch } from "../include/zeta-dom/util.js";
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
        elements: new Set(),
        states: new WeakMap(),
        flush: watch(this, false),
        dispose: []
    });
}

definePrototype(StatefulMixin, Mixin, {
    get ref() {
        const state = _(this);
        return state.ref || (state.ref = new MixinRefImpl(this));
    },
    get state() {
        return _(this).pending;
    },
    reset: function () {
        _(this).pending = {};
        return this;
    },
    next: function () {
        _(this).pending = {};
        return this;
    },
    getRef: function () {
        var self = this;
        var obj = _(self);
        var newState = obj.pending;
        var state;
        return function (current) {
            if (current) {
                state = obj.states.get(current) || extend(self.initState(), newState);
                if (state.element !== current) {
                    state.element = current;
                    self.initElement(current, state);
                    obj.states.set(current, state);
                } else if (keys(newState)[0]) {
                    self.mergeState(current, state, newState);
                }
                self.onLayoutEffect(current, state);
                obj.elements.add(current);
            } else if (state) {
                var prev = state.element;
                self.onBeforeUpdate(prev, state);
                obj.elements.delete(prev);
            }
        };
    },
    elements: function () {
        return map(_(this).elements, pipe);
    },
    onDispose: function (callback) {
        _(this).dispose.push(callback);
    },
    initState: function () {
        return { element: null };
    },
    initElement: function (element, state) {
    },
    mergeState: function (element, state, newState) {
        extend(state, newState);
    },
    onLayoutEffect: function (element, state) {
    },
    onBeforeUpdate: function (element, state) {
    },
    clone: function () {
        return this;
    },
    dispose: function () {
        var state = _(this);
        combineFn(state.dispose.splice(0))();
        state.flush();
        state.states = {};
        state.pending = {};
    }
});
