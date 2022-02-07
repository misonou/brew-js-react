import dom from "../include/zeta-dom/dom.js";
import { ZetaEventContainer } from "../include/zeta-dom/events.js";
import { definePrototype, is, isFunction } from "../include/zeta-dom/util.js";
import StatefulMixin from "./StatefulMixin.js";

const ErrorHandlerMixinSuper = StatefulMixin.prototype;
const emitter = new ZetaEventContainer();

function isErrorMatched(filter, error) {
    if (isFunction(filter)) {
        return is(error, filter);
    }
    return error && error.code === filter;
}

export default function ErrorHandlerMixin() {
    StatefulMixin.call(this);
}

definePrototype(ErrorHandlerMixin, StatefulMixin, {
    catch: function (filter, callback) {
        if (!callback) {
            callback = filter;
            filter = null;
        }
        return emitter.add(this, filter ? 'error' : 'default', function (e) {
            if (!filter || isErrorMatched(filter, e.error)) {
                return callback(e.error);
            }
        });
    },
    initElement: function (element, state) {
        var self = this;
        ErrorHandlerMixinSuper.initElement.call(self, element, state);
        dom.on(element, 'error', function (e) {
            var data = { error: e.error };
            return emitter.emit('error', self, data) || emitter.emit('default', self, data);
        });
    }
});
