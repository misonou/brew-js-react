/// <reference path="./brew.d.ts" />

import { useRouteState } from "./hooks";

export type ViewComponentRootProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export type ViewComponent<P> = React.FC<ViewProps<P>>;
export type ViewParamMatchers = Zeta.Dictionary<null | string | RegExp | ((value: string) => boolean)>;
/**
 * @deprecated Alias of {@link ViewContext}
 */
export type ViewContainerState = ViewContext;

export interface PageChangeEvent extends Zeta.ZetaEventBase {
    /**
     * Gets information of the current page.
     */
    readonly page: Brew.PageInfo;
    /**
     * Gets information of the previous page.
     */
    readonly previousPage: Brew.PageInfo;
    /**
     * Gets how user has triggered navigation.
     * @see {Brew.RouterEvent.navigationType}
     */
    readonly navigationType: Brew.NavigationType;
    /**
     * Defers completion of navigation.
     * @param args One or more promises.
     * @returns Whether the supplied promises will be awaited.
     */
    waitFor(...args: Promise<any>[]): boolean;
}

export interface ViewContextEventMap {
    pagechange: PageChangeEvent;
}

export interface ViewContext extends Zeta.ZetaEventDispatcher<ViewContextEventMap, ViewContext> {
    /**
     * Gets the parent view context, or `null` if there is no parent context.
     */
    readonly parent: ViewContext | null;
    /**
     * Gets the HTML element associated with this view.
     */
    readonly container: HTMLElement;
    /**
     * Gets the rendered view component.
     */
    readonly view: ViewComponent<any>;
    /**
     * Gets whether the view is active.
     *
     * A rendered view becomes inactive if the view will be replaced by another view, or parent container will be unmounted.
     * It may also be temporarily inactive during navigation.
     */
    readonly active: boolean;
    /**
     * Gets information of current page that rendered the view.
     * Unlike {@link Brew.WithRouter.page}, it will not change when user has navigated away and the current view is going to unmount.
     */
    readonly page: Brew.PageInfo;

    /**
     * Gets view contexts rendered under this view container.
     */
    getChildren(): ViewContext[];
}

export interface ViewProps<S = {}> {
    /**
     * Gets the additional data passed from {@link navigateTo} or {@link redirectTo}.
     *
     * The data object is read-only, to use incoming data as mutable view states,
     * pass individual data to {@link React.useState} or {@link useRouteState}.
     */
    readonly viewData: { readonly [P in keyof S]?: S[P] };
    /**
     * Gets information scoped to the rendered view.
     */
    readonly viewContext: ViewContext;
    /**
     * Gets how user landed on this view component.
     * @see {@link Brew.RouterEvent.navigationType}
     */
    readonly navigationType: Brew.NavigationType;
}

export interface ErrorViewProps {
    /**
     * Gets the original view component in which error has thrown.
     */
    view: ViewComponent<any>;
    /**
     * Gets the error thrown from the original view component.
     */
    error: any;
    /**
     * Re-renders the original view component with initial state.
     */
    reset(): void;
}

export function useViewContext(): ViewContext;

/**
 * @deprecated Alias of {@link useViewContext}
 */
export function useViewContainerState(): ViewContainerState;


/**
 * Registers view component with specific route paramters.
 * Route parameters will be matched against current route state by {@link renderView}.
 * @param component A React component, or a callback that returns a promise resolving a React component, typically using async `import`.
 * @param params A dictionary containing route parameters.
 */
export function registerView<P = ViewProps>(component: React.ComponentType<P> | (() => Promise<{ default: React.ComponentType<P>; }>), params: ViewParamMatchers): ViewComponent<P extends ViewProps<infer S> ? S : {}>;

/**
 * Registers a default error view to be displayed when view component failed to render.
 * The previous registered error view, if any, will be overriden when called multiple times.
 * @param component A react component.
 */
export function registerErrorView(component: React.ComponentType<ErrorViewProps>): void;

/**
 * Determines whether a registered view component matches current route state.
 * However it does not imply if the view is in fact being rendered.
 * @param view A view component returned from {@link registerView}.
 */
export function isViewMatched(view: ViewComponent<any>): boolean;

/**
 * Returns whether a registered view component is currently being rendered.
 * @param view A view component returned from {@link registerView}.
 */
export function isViewRendered(view: ViewComponent<any>): boolean;

/**
 * Gets the view component that matches the current path within all registered views.
 * However it does not imply if the view is in fact being rendered.
 */
export function matchView(): ViewComponent<any> | undefined;

/**
 * Gets the view component that matches the current path within the given set of views.
 * However it does not imply if the view is in fact being rendered.
 * @param views A list of view components.
 */
export function matchView(views: ViewComponent<any>[]): ViewComponent<any> | undefined;

/**
 * Gets the view component that matches the current path within the given set of views.
 * However it does not imply if the view is in fact being rendered.
 * @param views A list of view components.
 */
export function matchView(...views: ViewComponent<any>[]): ViewComponent<any> | undefined;

/**
 * Gets the view component that matches the specified path.
 * @param path A valid path that could navigate to.
 */
export function matchView(path: string): ViewComponent<any> | undefined;

/**
 * Gets the view component that matches the specified path, within the given set of views.
 * @param path A valid path that could navigate to.
 * @param views A list of view components.
 */
export function matchView(path: string, views: ViewComponent<any>[]): ViewComponent<any> | undefined;

/**
 * Gets the view component that matches the specified path, within the given set of views.
 * @param path A valid path that could navigate to.
 * @param views A list of view components.
 */
export function matchView(path: string, ...views: ViewComponent<any>[]): ViewComponent<any> | undefined;

/**
 * Renders view by matching current route state against registered route parameters of each supplied views.
 * @param args A list of view components created by {@link registerView}.
 */
export function renderView(...args: ViewComponent<any>[]): JSX.Element;

/**
 * Renders view by matching current route state against registered route parameters of each supplied views.
 * @param props Optional parameters passed to the root element rendered by the function.
 * @param args A list of view components created by {@link registerView}.
 */
export function renderView(props: ViewComponentRootProps, ...args: ViewComponent<any>[]): JSX.Element;

/**
 * Returns the app path that will render the specified view.
 *
 * The pathname is resolved using route parameters given to {@link registerView},
 * current route parameters, as well as any supplemeneted route parameters
 * against registered routes in {@link Brew.RouterOptions.routes}.
 *
 * This is used by methods such as {@link linkTo} and {@link navigateTo}.
 *
 * @param view A view component created by {@link registerView}.
 * @param params Extra route parameters that supplements or overrides current route parameters.
 */
export function resolvePath(view: ViewComponent<any>, params?: Zeta.Dictionary<string>): string;

/**
 * Returns a link usable in `href` attribute or method such as `window.open`
 * that when visiting the link through browser the specifed view will be rendered.
 *
 * This function wraps {@link resolvePath} with {@link Brew.WithRouter.toHref}.
 * The returned link will depend on `urlMode` and related options initializing the router.
 * When `urlMode` is set to `none`, {@link navigateTo} should always be used instead as
 * navigation through link is disabled in such case.
 *
 * @param view A view component created by {@link registerView}.
 * @param params Extra route parameters that supplements or overrides current route parameters.
 * @see {@link resolvePath}.
 */
export function linkTo(view: ViewComponent<any>, params?: Zeta.Dictionary<string>): string;

/**
 * Navigates to path that will render the specified view.
 * @param view A view component created by {@link registerView}.
 * @param params Extra route parameters that supplements or overrides current route parameters.
 * @param data Additional data to be passed to view component, analogous to making form post to server rendering page.
 * @see {@link resolvePath}.
 */
export function navigateTo<T>(view: ViewComponent<T>, params?: Zeta.Dictionary<string> | null, data?: T): Promise<Brew.NavigateResult>;

/**
 * Navigates to path that will render the specified view, replacing current state in browser history.
 * @param view A view component created by {@link registerView}.
 * @param params Extra route parameters that supplements or overrides current route parameters.
 * @param data Additional data to be passed to view component, analogous to making form post to server rendering page.
 * @see {@link resolvePath}.
 */
export function redirectTo<T>(view: ViewComponent<T>, params?: Zeta.Dictionary<string> | null, data?: T): Promise<Brew.NavigateResult>;
