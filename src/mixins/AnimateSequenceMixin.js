import $ from "jquery";
import { watchElements } from "zeta-dom/observe";
import { definePrototype, extend } from "zeta-dom/util";
import AnimateMixin from "./AnimateMixin.js";
import AnimateSequenceItemMixin from "./AnimateSequenceItemMixin.js";

const AnimateSequenceMixinSuper = AnimateMixin.prototype;
var animateSequenceMixinCounter = 0;

export default function AnimateSequenceMixin() {
    var self = this;
    AnimateMixin.call(self);
    self.className = 'brew-anim-' + (++animateSequenceMixinCounter);
    self.item = new AnimateSequenceItemMixin(self.className);
}

definePrototype(AnimateSequenceMixin, AnimateMixin, {
    withOptions: function (options) {
        this.selector = options;
        return this;
    },
    getCustomAttributes: function () {
        var self = this;
        return extend(AnimateSequenceMixinSuper.getCustomAttributes.call(self), {
            'animate-in': null,
            'animate-sequence-type': (self.effects || []).join(' '),
            'animate-sequence': self.selector || '.' + self.className
        });
    },
    initElement: function (element, state) {
        var self = this;
        AnimateSequenceMixinSuper.initElement.call(self, element, state);
        if (self.selector) {
            state.onDispose(watchElements(element, self.selector, function (addedNodes) {
                $(addedNodes).attr('is-animate-sequence', '');
            }).dispose);
        }
    }
});
