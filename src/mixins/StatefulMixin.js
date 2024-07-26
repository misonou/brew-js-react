import { arrRemove, combineFn, createPrivateStore, definePrototype, each, extend, keys, setImmediateOnce, throwNotFunction, watch } from "zeta-dom/util";
import Mixin from "./Mixin.js";

const _ = createPrivateStore();
const unmounted = new Set();

function disposeUnmountedStates() {
    each(unmounted, function (i, v) {
        combineFn(_(v).splice(0))();
    });
    unmounted.clear();
}

function MixinState(parent, element) {
    _(this, [parent.delete.bind(parent, element)]);
    parent.set(element, this);
}

definePrototype(MixinState, {
    onDispose: function (callback) {
        _(this).push(throwNotFunction(callback));
    }
});

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
        pending: {},
        elements: [],
        states: new Map(),
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
        var element, state;
        return function (current) {
            if (current) {
                element = current;
                state = obj.states.get(element) || new MixinState(obj.states, element);
                obj.elements.push(element);
                if (!state.element) {
                    self.initElement(element, extend(state, self.initState(), newState, { element }));
                } else if (keys(newState)[0]) {
                    self.mergeState(element, state, newState);
                }
                self.onLayoutEffect(element, state);
                unmounted.delete(state);
            } else if (state) {
                unmounted.add(state);
                self.onBeforeUpdate(element, state);
                arrRemove(obj.elements, element);
            }
            setImmediateOnce(disposeUnmountedStates);
        };
    },
    elements: function () {
        return _(this).elements.slice();
    },
    onDispose: function (callback) {
        _(this).dispose.push(callback);
    },
    initState: function () {
        return {};
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
        each(state.states, function (i, v) {
            unmounted.add(v);
        });
        setImmediateOnce(disposeUnmountedStates);
        combineFn(state.dispose.splice(0))();
        state.flush();
        state.pending = {};
    }
});
