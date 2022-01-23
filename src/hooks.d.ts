/**
 * Returns if the app has completed initialization, and
 * refresh the component when the app has changed its ready state.
 * @see {@link Brew.AppInstance.ready}
 */
export function useAppReady(): boolean;

/**
 * Returns the current language, and
 * refresh the component when the language has changed.
 */
export function useLanguage(): string;

/**
 * Returns the value of specified route parameter, and
 * refresh the component when the route parameter has changed.
 * @param name Name of route parameter.
 * @param defaultValue When given, an empty value in current route state will cause a redirection which set the route parameter to such value.
 */
export function useRouteParam(name: string, defaultValue?: string): string;
