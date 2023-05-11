export type ViewComponentRootProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export type ViewComponent<P> = React.FC<P>;

export interface ViewContainerState {
    readonly container: HTMLElement;
    readonly view: ViewComponent<any>;
    readonly active: boolean;
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

export function useViewContainerState(): ViewContainerState;

/**
 * Registers view component with specific route paramters.
 * Route parameters will be matched against current route state by {@link renderView}.
 * @param factory A callback that returns a promise resolving a React component, typically using async `import`.
 * @param params A dictionary containing route parameters.
 */
export function registerView<P>(factory: () => Promise<{ default: React.ComponentType<P> }>, params: Zeta.Dictionary<null | string | RegExp | ((value: string) => boolean)>): ViewComponent<P>;

/**
 * Registers view component with specific route paramters.
 * Route parameters will be matched against current route state by {@link renderView}.
 * @param component A React component.
 * @param params A dictionary containing route parameters.
 */
export function registerView<P>(component: React.ComponentType<P>, params: Zeta.Dictionary<null | string | RegExp | ((value: string) => boolean)>): ViewComponent<P>;

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
 * @see {@link resolvePath}.
 */
export function navigateTo(view: ViewComponent<any>, params?: Zeta.Dictionary<string>): Promise<Brew.NavigateResult>;

/**
 * Navigates to path that will render the specified view, replacing current state in browser history.
 * @param view A view component created by {@link registerView}.
 * @param params Extra route parameters that supplements or overrides current route parameters.
 * @see {@link resolvePath}.
 */
export function redirectTo(view: ViewComponent<any>, params?: Zeta.Dictionary<string>): Promise<Brew.NavigateResult>;
