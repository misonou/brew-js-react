/// <reference types="jq-scrollable" />

import ClassNameMixin from "./ClassNameMixin";
import StaticAttributeMixin from "./StaticAttributeMixin";

export interface ScrollableMixinOptions {
    direction?: 'x-only' | 'y-only' | 'both';
    handle?: 'auto' | 'scrollbar' | 'content';
    paged?: 'always' | 'landscape' | 'portrait';
    pagedItemSelector?: string;
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
    refresh(): void;
    scrollPadding(): Readonly<{ top: number; left: number; right: number; bottom: number; }>;
    stop(): void;
    scrollLeft(): number;
    scrollTop(): number;
    scrollBy(x: number, y: number, duration?: number, callback?: () => void): Promise<void>;
    scrollTo(x: number, y: number, duration?: number, callback?: () => void): Promise<void>;
    scrollByPage(x: number, y: number, duration?: number, callback?: () => void): Promise<void>;
    scrollToPage(x: number, y: number, duration?: number, callback?: () => void): Promise<void>;
    scrollToElement(target: Element, targetOrigin: string, duration: number, callback?: () => void): Promise<void>;
    scrollToElement(target: Element, targetOrigin?: string, wrapperOrigin?: string, duration?: number, callback?: () => void): Promise<void>;
}
