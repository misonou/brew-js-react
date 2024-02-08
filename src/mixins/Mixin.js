import { classNames } from "zeta-dom-react";
import { combineFn, define, definePrototype, each, extend, makeArray, noop, watchable } from "../include/zeta-dom/util.js";
import StaticAttributeMixin from "./StaticAttributeMixin.js";

export default function Mixin() {
}

definePrototype(Mixin, {
    reset: function () {
        return this;
    },
    next: function () {
    },
    getRef: function () {
        return noop;
    },
    getClassNames: function () {
        return [];
    },
    getCustomAttributes: function () {
        return {};
    },
    dispose: function () {
    }
});
watchable(Mixin.prototype);

define(Mixin, {
    get scrollableTarget() {
        return new StaticAttributeMixin('scrollable-target');
    },
    get tabRoot() {
        return new StaticAttributeMixin('tab-root');
    },
    use: function () {
        const args = makeArray(arguments);
        const ref = args[0];
        const props = {};
        const mixins = args.filter(function (v) {
            return v instanceof Mixin;
        });
        const refs = mixins.map(function (v) {
            return v.getRef();
        });
        if (ref && !(ref instanceof Mixin)) {
            if (typeof ref !== 'function') {
                refs.push(function (v) {
                    ref.current = v;
                });
            } else {
                refs.push(ref);
            }
            args.shift();
        } else if (!ref) {
            args.shift();
        }
        each(mixins, function (i, v) {
            extend(props, v.getCustomAttributes());
        });
        extend(props, {
            ref: combineFn(refs),
            className: classNames.apply(null, args)
        });
        each(mixins, function (i, v) {
            v.next();
        });
        return props;
    }
});
