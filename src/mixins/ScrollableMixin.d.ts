import ClassNameMixin from "./ClassNameMixin";
import StaticAttributeMixin from "./StaticAttributeMixin";

export interface ScrollableMixinOptions {
    direction?: 'x-only' | 'y-only' | 'both';
    handle?: 'auto' | 'scrollbar' | 'content';
    paged?: 'always' | 'landscape' | 'portrait';
    pagedItemSelector?: string;
}

export default class ScrollableMixin extends ClassNameMixin {
    readonly target: StaticAttributeMixin;
    readonly pageIndex: number;

    withOptions(options?: ScrollableMixinOptions): this;
    onPageIndexChanged(callback: (index: number) => void): Zeta.UnregisterCallback;
}
