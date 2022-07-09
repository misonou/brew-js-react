export type ViewComponentRootProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export type ViewComponent<P> = React.FC<P>;

export interface ViewContainerState {
    readonly view: ViewComponent<any>;
    readonly active: boolean;
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
 * Determines whether a registered view component matches current route state.
 * However it does not imply if the view is in fact being rendered.
 * @param view A view component returned from {@link registerView}.
 */
export function isViewMatched(view: ViewComponent<any>): boolean;

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
 * Returns pathname that will render the specified view.
 * The pathname is resolved using route parameters given to {@link registerView},
 * current route parameters, as well as any supplemeneted route parameters
 * against registered routes in {@link Brew.RouterOptions.routes}.
 * @param view A view component created by {@link registerView}.
 * @param params Extra route parameters that supplements or overrides current route parameters.
 */
export function linkTo(view: ViewComponent<any>, params?: Zeta.Dictionary<string>): string;

/**
 * Navigates to path that will render the specified view.
 * @param view A view component created by {@link registerView}.
 * @param params Extra route parameters that supplements or overrides current route parameters.
 * @see {@link linkTo}.
 */
export function navigateTo(view: ViewComponent<any>, params?: Zeta.Dictionary<string>): Promise<Brew.NavigateResult>;

/**
 * Navigates to path that will render the specified view, replacing current state in browser history.
 * @param view A view component created by {@link registerView}.
 * @param params Extra route parameters that supplements or overrides current route parameters.
 * @see {@link linkTo}.
 */
export function redirectTo(view: ViewComponent<any>, params?: Zeta.Dictionary<string>): Promise<Brew.NavigateResult>;
