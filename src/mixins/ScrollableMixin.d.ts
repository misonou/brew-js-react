/// <reference types="jq-scrollable" />

import ClassNameMixin from "./ClassNameMixin";
import StaticAttributeMixin from "./StaticAttributeMixin";

export interface ScrollableMixinOptions {
    direction?: 'x-only' | 'y-only' | 'both';
    handle?: 'auto' | 'scrollbar' | 'content';
    paged?: 'always' | 'landscape' | 'portrait';
    pagedItemSelector?: string;
    persistScroll?: boolean;
}

export default class ScrollableMixin extends ClassNameMixin implements JQueryScrollable {
    readonly target: StaticAttributeMixin;
    readonly pageIndex: number;
    readonly scrolling: boolean;

    withOptions(options?: ScrollableMixinOptions): this;
    onPageIndexChanged(callback: (index: number) => void): Zeta.UnregisterCallback;

    destroy(): void;
    enable(): void;
    disable(): void;
    setOptions(options: Partial<Omit<JQueryScrollableOptions, 'scrollStart' | 'scrollMove' | 'scrollStop' | 'scrollEnd'>>): void;
    setStickyPosition(element: Element | string, dir: JQueryScrollableStickyPosition, fixed?: boolean): void;
    setStickyPosition(element: Element | string, dir: JQueryScrollableStickyPosition, within: (() => Zeta.RectLike) | Element | string, fixed?: boolean): void;
    refresh(): void;
    scrollPadding(): Readonly<{ top: number; left: number; right: number; bottom: number; }>;
    stop(): void;
    scrollLeft(): number;
    scrollTop(): number;
    scrollBy(x: number, y: number, duration?: number, callback?: () => void): Promise<void> & JQueryScrollableState;
    scrollTo(x: number, y: number, duration?: number, callback?: () => void): Promise<void> & JQueryScrollableState;
    scrollByPage(x: number, y: number, duration?: number, callback?: () => void): Promise<void> & JQueryScrollableState;
    scrollToPage(x: number, y: number, duration?: number, callback?: () => void): Promise<void> & JQueryScrollableState;
    scrollToElement(target: Element | string, targetOrigin: string, duration: number, callback?: () => void): Promise<void> & JQueryScrollableState;
    scrollToElement(target: Element | string, targetOrigin?: string, wrapperOrigin?: string, duration?: number, callback?: () => void): Promise<void> & JQueryScrollableState;
}
