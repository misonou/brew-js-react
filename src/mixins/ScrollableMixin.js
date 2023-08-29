import { defineAliasProperty, defineHiddenProperty, definePrototype, each, extend } from "../include/zeta-dom/util.js";
import { getDirectiveComponent } from "../include/brew-js/directive.js";
import { app } from "../app.js";
import Mixin from "./Mixin.js";
import ClassNameMixin from "./ClassNameMixin.js";

const ScrollableMixinSuper = ClassNameMixin.prototype;
const aliasProps = 'pageIndex scrolling'.split(' ');

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
        }, options.pagedItemSelector && {
            'scroller-snap-page': options.paged,
            'scroller-page': options.pagedItemSelector,
        }, options.persistScroll && {
            'persist-scroll': ''
        });
    },
    onPageIndexChanged: function (callback) {
        return this.watch('pageIndex', callback);
    },
    initElement: function (element, state) {
        var self = this;
        self.onDispose(app.on(element, {
            scrollIndexChange: function (e) {
                self.pageIndex = e.newIndex;
            },
            scrollStart: function () {
                self.scrolling = true;
            },
            scrollStop: function () {
                self.scrolling = false;
            }
        }, true));
    },
    clone: function () {
        var mixin = ScrollableMixinSuper.clone.call(this);
        each(aliasProps, function (i, v) {
            defineAliasProperty(mixin, v, self);
        });
        return mixin;
    }
});

each('destroy enable disable setOptions setStickyPosition refresh scrollPadding stop scrollLeft scrollTop scrollBy scrollTo scrollByPage scrollToPage scrollToElement', function (i, v) {
    defineHiddenProperty(ScrollableMixin.prototype, v, function () {
        var obj = getDirectiveComponent(this.elements()[0]);
        return obj.scrollable[v].apply(null, arguments);
    });
});
