export type SetQueryParamAction<T> = Partial<T> | ((prev: Readonly<T>) => Partial<T>);

export const ViewStateContainer: React.FC;

/**
 * Returns if the app has completed initialization, and
 * refresh the component when the app has changed its ready state.
 * @see {@link Brew.AppInstance.ready}
 * @deprecated Use {@link useAppReadyState} instead.
 */
export function useAppReady(): boolean;

/**
 * Returns if the app has completed initialization, or has halted due to error.
 * Component is refreshed when the app has changed its ready state.
 */
export function useAppReadyState(): {
    readonly ready: boolean;
    readonly error: boolean;
};

/**
 * Returns the value of specified route parameter, and
 * refresh the component when the route parameter has changed.
 * @param name Name of route parameter.
 * @param defaultValue When given, an empty value in current route state will cause a redirection which set the route parameter to such value.
 */
export function useRouteParam(name: string, defaultValue?: string): string;

/**
 * Returns a stateful value, and a function to update it.
 * Same as {@link React.useState}, but the state is persisted in route history.
 */
export function useRouteState<T>(key: string | symbol, initialState: T | (() => T), snapshotOnUpdate?: boolean): [T, React.Dispatch<React.SetStateAction<T>>];

/**
 * Returns a stateful value, and a function to update it.
 * Same as {@link React.useState}, but the state is persisted in route history.
 */
export function useRouteState<T = undefined>(key: string | symbol): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];

/**
 * Returns value of the specified parameter in query string, and a function to update it.
 *
 * To remove parameter in query string, pass empty string to the update function.
 *
 * @param name Name of the parameter.
 * @param defaultValue Default value when the specified parameter is not present in query string.
 * @param snapshotOnUpdate Whether to create snapshot in browser's history when query parameter is updated. Default is `false`.
 */
export function useQueryParam(name: string, defaultValue: string, snapshotOnUpdate?: boolean): [string, React.Dispatch<React.SetStateAction<string>>];

/**
 * Returns values of multiple parameters in query string, and a function to update them.
 *
 * To remove parameter in query string, pass empty string for that parameter to the update function.
 * The update function always performs partial update, meaning that unsupplied parameters are unchanged.
 *
 * @param dict A dictionary containing parameter names and associated default values.
 * @param snapshotOnUpdate Whether to create snapshot in browser's history when query parameter is updated. Default is `false`.
 */
export function useQueryParam<T extends Zeta.Dictionary<string>>(dict: T, snapshotOnUpdate?: boolean): [Readonly<T>, React.Dispatch<SetQueryParamAction<T>>];
