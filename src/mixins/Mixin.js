import { classNames } from "zeta-dom-react";
import { combineFn, define, definePrototype, each, extend, makeArray, noop, watchable } from "zeta-dom/util";
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
        const props = {};
        const refs = [];
        const ref = args[0];
        if (!ref) {
            args.shift();
        } else if (typeof ref === 'function') {
            refs.push(ref);
            args.shift();
        } else if (typeof ref !== 'string' && !(ref instanceof Mixin)) {
            refs.push(function (w) {
                ref.current = w;
            });
            args.shift();
        }
        each(args, function (i, v) {
            if (v instanceof Mixin) {
                refs.push(v.getRef());
                extend(props, v.getCustomAttributes());
                v.next();
            }
        });
        return extend(props, {
            ref: combineFn(refs),
            className: classNames.apply(null, args)
        });
    }
});
