export const ViewStateContainer: React.FC;

/**
 * Returns if the app has completed initialization, and
 * refresh the component when the app has changed its ready state.
 * @see {@link Brew.AppInstance.ready}
 */
export function useAppReady(): boolean;

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
export function useRouteState<T>(key: string | symbol, initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];

/**
 * Returns a stateful value, and a function to update it.
 * Same as {@link React.useState}, but the state is persisted in route history.
 */
export function useRouteState<T = undefined>(key: string | symbol): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];
