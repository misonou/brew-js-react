import $ from "../include/external/jquery.js";
import { defineAliasProperty, defineHiddenProperty, definePrototype, each, extend, makeArray } from "../include/zeta-dom/util.js";
import { app } from "../app.js";
import Mixin from "./Mixin.js";
import ClassNameMixin from "./ClassNameMixin.js";

const ScrollableMixinSuper = ClassNameMixin.prototype;

export default function ScrollableMixin() {
    var self = this;
    ClassNameMixin.call(self, ['scrollable-x', 'scrollable-x-l', 'scrollable-x-r', 'scrollable-y', 'scrollable-y-d', 'scrollable-y-u']);
    self.target = Mixin.scrollableTarget;
    self.pageIndex = 0;
    self.scrolling = false;
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
        self.onDispose(app.on(element, {
            statechange: function (e) {
                if ('pageIndex' in e.newValues) {
                    extend(self, { pageIndex: e.newValues.pageIndex });
                }
            },
            scrollStart: function() {
                self.scrolling = true;
            },
            scrollStop: function() {
                self.scrolling = false;
            }
        }, true));
    },
    clone: function () {
        var mixin = ScrollableMixinSuper.clone.call(this);
        defineAliasProperty(mixin, 'pageIndex', this);
        return mixin;
    }
});

each('destroy enable disable setOptions refresh scrollPadding stop scrollLeft scrollTop scrollBy scrollTo scrollByPage scrollToPage scrollToElement', function (i, v) {
    defineHiddenProperty(ScrollableMixin.prototype, v, function () {
        var obj = $(this.elements());
        return obj.scrollable.apply(obj, [v].concat(makeArray(arguments)));
    });
});
