import { defineHiddenProperty, definePrototype, each, extend } from "zeta-dom/util";
import { getDirectiveComponent } from "brew-js/directive";
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
    get element() {
        return this.elements()[0] || null;
    },
    get contentElement() {
        var element = this.element;
        return element && getDirectiveComponent(element).scrollable.scrollTarget;
    },
    withOptions: function (options) {
        this.options = options;
        return this;
    },
    getCustomAttributes: function () {
        var options = this.options || {};
        return extend(ScrollableMixinSuper.getCustomAttributes.call(this), {
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
        ScrollableMixinSuper.initElement.call(self, element, state);
        state.onDispose(app.on(element, {
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
    }
});

each('destroy enable disable setOptions setStickyPosition refresh scrollPadding stop scrollLeft scrollTop scrollBy scrollTo scrollByPage scrollToPage scrollToElement', function (i, v) {
    defineHiddenProperty(ScrollableMixin.prototype, v, function () {
        var obj = getDirectiveComponent(this.element);
        return obj.scrollable[v].apply(null, arguments);
    });
});
