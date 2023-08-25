/// <reference types="jq-scrollable" />

import ClassNameMixin from "./ClassNameMixin";
import StaticAttributeMixin from "./StaticAttributeMixin";

export interface ScrollableMixinOptions {
    /**
     * Specifies in which direction can be scrolled.
     * Default is `both`.
     */
    direction?: 'x-only' | 'y-only' | 'both';
    /**
     * Specifies which parts should initiate scrolling when
     * touch or mouse events is received.
     *
     * - `auto`: dragging content area on touch devices or scroll bars on other devices.
     * - `scrollbar`: only when dragging scroll bars
     * - `content`: only when dragging contents.
     *
     * Default is `auto`.
     */
    handle?: 'auto' | 'scrollbar' | 'content';
    /**
     * Whether element matched by {@link ScrollableMixinOptions.pagedItemSelector}
     * should be snapped to the boundaries of scrollable area.
     * - `landscape`: only snaps when page orientation is landscape
     * - `portrait`: only snaps when page orientation is portrait
     * - `always`: always snaps for both page orientation.
     */
    paged?: 'always' | 'landscape' | 'portrait';
    /**
     * Enables `pageIndex`, which will be updated upon scrolling.
     */
    pagedItemSelector?: string;
    /**
     * Whether current scroll position will be persisted and be restored
     * when traversing back in browser's history.
     */
    persistScroll?: boolean;
}

export default class ScrollableMixin extends ClassNameMixin implements JQueryScrollable {
    /**
     * Gets a mixin object that when applied to descecant element
     * the element will act as content to be scrolled.
     */
    readonly target: StaticAttributeMixin;
    /**
     * Gets the index of the currently visible element matched by {@link ScrollableMixinOptions.pagedItemSelector} options.
     */
    readonly pageIndex: number;
    /**
     * Gets whether the content area is being scrolled.
     */
    readonly scrolling: boolean;

    withOptions(options?: ScrollableMixinOptions): this;
    /**
     * Adds an listener to be invoked when {@link ScrollableMixin.pageIndex} is updated.
     * @param callback A callback to be invoked.
     */
    onPageIndexChanged(callback: (index: number) => void): Zeta.UnregisterCallback;

    /**
     * Deactivates the scrollable plugin and release all resources.
     * This method is intended for internal use.
     */
    destroy(): void;
    /**
     * Enables scrolling of content area.
     */
    enable(): void;
    /**
     * Disables scrolling of content area.
     */
    disable(): void;
    /**
     * Sets options for jQuery scrollable plugin.
     * @param options A dictionary specifying options. Must not pass `scrollStart`, `scrollMove`, `scrollStop` and `scrollEnd` options.
     */
    setOptions(options: Partial<Omit<JQueryScrollableOptions, 'scrollStart' | 'scrollMove' | 'scrollStop' | 'scrollEnd'>>): void;
    /**
     * Sets sticky position for one or more elements.
     * @param element An element or a valid CSS selector.
     * @param dir Which side(s) should the element be sticked onto to remain visible when the element is scrolled beyond visible area. When given `none` the element will no longer be sticky.
     * @param fixed Whether the element should be in fixed position, as if the content area is scrolled all the way in that direction.
     */
    setStickyPosition(element: Element | string, dir: JQueryScrollableStickyPosition, fixed?: boolean): void;
    /**
     * Sets sticky position for one or more elements.
     * @param element An element or a valid CSS selector.
     * @param dir Which side should the element be sticked onto to remain visible when the element is scrolled beyond visible area. When given `none` the element will no longer be sticky.
     * @param within When specified, the element will only be sticked onto the side of this element or region.
     * @param fixed Whether the element should be in fixed position, as if the content area is scrolled all the way in that direction.
     */
    setStickyPosition(element: Element | string, dir: JQueryScrollableStickyPosition, within: (() => Zeta.RectLike) | Element | string, fixed?: boolean): void;
    /**
     * Forces recalculation of internal states.
     */
    refresh(): void;
    /**
     * Returns the scroll padding
     */
    scrollPadding(): Readonly<{ top: number; left: number; right: number; bottom: number; }>;
    /**
     * Stops scrolling immediately.
     */
    stop(): void;
    /**
     * Gets horizontal scroll position.
     * Unlike {@link JQueryScrollable.scrollX}, if content is being scrolled in animated manner, the final position is returned.
     */
    scrollLeft(): number;
    /**
     * Gets vertical scroll position.
     * Unlike {@link JQueryScrollable.scrollY}, if content is being scrolled in animated manner, the final position is returned.
     */
    scrollTop(): number;
    /**
     * Scrolls content area by the specified number of pixels.
     * @param x Number of pixels in horizontal direction.
     * @param y Number of pixels in vertical direction.
     * @param duration Duration of animated scrolling in milliseconds. Default is `0`, meaning for no animation.
     * @param callback A callback to be invoked when scrolling is completed.
     * @returns A promise that resolves when scrolling is completed.
     */
    scrollBy(x: number, y: number, duration?: number, callback?: () => void): Promise<void> & JQueryScrollableState;
    /**
     * Scrolls content area to the specific offsets meansured from top-left corner.
     * @param x Number of pixels in horizontal direction.
     * @param y Number of pixels in vertical direction.
     * @param duration Duration of animated scrolling in milliseconds. Default is `0`, meaning for no animation.
     * @param callback A callback to be invoked when scrolling is completed.
     * @returns A promise that resolves when scrolling is completed.
     */
    scrollTo(x: number, y: number, duration?: number, callback?: () => void): Promise<void> & JQueryScrollableState;
    /**
     * Scrolls content area by the specified number of pages. It is identical to scroll by the number of pixels of the visible content area.
     * @param x Number of pages in horizontal direction.
     * @param y Number of pages in vertical direction.
     * @param duration Duration of animated scrolling in milliseconds. Default is `0`, meaning for no animation.
     * @param callback A callback to be invoked when scrolling is completed.
     * @returns A promise that resolves when scrolling is completed.
     */
    scrollByPage(x: number, y: number, duration?: number, callback?: () => void): Promise<void> & JQueryScrollableState;
    /**
     * Scrolls content area to a specified page. It is identical to scroll to the number of pixels of the visible content area times the page index.
     * @param x Page index in horizontal direction.
     * @param y Page index in vertical direction.
     * @param duration Duration of animated scrolling in milliseconds. Default is `0`, meaning for no animation.
     * @param callback A callback to be invoked when scrolling is completed.
     * @returns A promise that resolves when scrolling is completed.
     */
    scrollToPage(x: number, y: number, duration?: number, callback?: () => void): Promise<void> & JQueryScrollableState;
    /**
     * Scrolls content area so that the target element is aligned to a specific location.
     * @param target A element or a valid CSS selector.
     * @param targetOrigin The coordinate of the target element to be aligned. It supports format likes `left top`, `left+50px top-10px`, or `left+10% top+10%`.
     * @param duration Duration of animated scrolling in milliseconds. Default is `0`, meaning for no animation.
     * @param callback A callback to be invoked when scrolling is completed.
     * @returns A promise that resolves when scrolling is completed.
     */
    scrollToElement(target: Element | string, targetOrigin: string, duration: number, callback?: () => void): Promise<void> & JQueryScrollableState;
    /**
     * Scrolls content area so that the target element is aligned to a specific location.
     * @param target A element or a valid CSS selector.
     * @param targetOrigin The coordinate of the target element to be aligned. It supports format likes `left top`, `left+50px top-10px`, or `left+10% top+10%`.
     * @param wrapperOrigin The coordinate of the visible content area that the target element is aligned to. It supports format likes `left top`, `left+50px top-10px`, or `left+10% top+10%`.
     * @param duration Duration of animated scrolling in milliseconds. Default is `0`, meaning for no animation.
     * @param callback A callback to be invoked when scrolling is completed.
     * @returns A promise that resolves when scrolling is completed.
     */
    scrollToElement(target: Element | string, targetOrigin?: string, wrapperOrigin?: string, duration?: number, callback?: () => void): Promise<void> & JQueryScrollableState;
}
