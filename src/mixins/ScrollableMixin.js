import { defineAliasProperty, definePrototype, extend } from "../include/zeta-dom/util.js";
import { app } from "../app.js";
import Mixin from "./Mixin.js";
import ClassNameMixin from "./ClassNameMixin.js";

const ScrollableMixinSuper = ClassNameMixin.prototype;

export default function ScrollableMixin() {
    var self = this;
    ClassNameMixin.call(self, ['scrollable-x', 'scrollable-x-l', 'scrollable-x-r', 'scrollable-y', 'scrollable-y-d', 'scrollable-y-u']);
    self.target = Mixin.scrollableTarget;
    self.pageIndex = 0;
}

definePrototype(ScrollableMixin, ClassNameMixin, {
    withOptions: function (options) {
        this.options = options;
        return this;
    },
    getCustomAttributes: function () {
        var options = this.options || {};
        return extend({}, ScrollableMixinSuper.getCustomAttributes.call(this), {
            'scrollable': [options.direction || 'both', options.handle || 'auto'].join(' '),
        }, options.paged && {
            'var': '{ pageIndex: 0 }',
            'scroller-snap-page': options.paged,
            'scroller-page': options.pagedItemSelector,
            'scroller-state': 'pageIndex'
        });
    },
    onPageIndexChanged: function (callback) {
        return this.watch('pageIndex', callback);
    },
    initElement: function (element, state) {
        var self = this;
        app.on(element, 'statechange', function (e) {
            if ('pageIndex' in e.newValues) {
                extend(self, { pageIndex: e.newValues.pageIndex });
            }
        }, true);
    },
    clone: function () {
        var mixin = ScrollableMixinSuper.clone.call(this);
        defineAliasProperty(mixin, 'pageIndex', this);
        return mixin;
    }
});
