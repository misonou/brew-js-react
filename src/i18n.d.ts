type StringKeysOf<T> = Extract<keyof T, string>;
type ArrayMember<T> = { [P in Extract<keyof T, number>]: T[P] }[Extract<keyof T, number>];

export interface Translate<T> {
    /**
     * Returns a translation string.
     * @param key Tranlsation key.
     * @param data Data object to be passed to template engine.
     */
    (key: T, data?: any): string;
    /**
     * Returns a object containing the translated HTML content that can be passed to {@link React.DOMAttributes.dangerouslySetInnerHTML}.
     * @param key Tranlsation key.
     * @param data Data object to be passed to template engine.
     */
    html(key: T, data?: any): { __html: string };
    /**
     * Returns a string-coercible object that will convert to translation string when coerced.
     * @param key Tranlsation key.
     * @param data Data object to be passed to template engine.
     */
    lazy(key: T, data?: any): { [Symbol.toPrimitive](): string; toString(): string };
}

export interface Translation<T> {
    /**
     * Current language.
     */
    readonly language: string;
    /**
     * Translation callback which returns a translated string based on the given translation key.
     */
    readonly t: Translate<T>
}

/**
 * Returns the current language, and
 * refresh the component when the language has changed.
 */
export function useLanguage(): string;

/**
 * Creates translation callback and hook based on the given translation resource object.
 * Type inference for translation keys is based on default language.
 * @param resources Translation resource object, see example for object structure.
 * @param defaultLang Default language when translation string is unavailable in the current language.
 *
 * @example A sample translation resource object.
 * ```typescript
 * const resources = {
 *     en: {
 *         prefix1: { key1: 'Translation string' }
 *     },
 *     de: {
 *         prefix1: { key1: 'Übersetzungszeichenfolge' }
 *     }
 * };
 * ```
 */
export function makeTranslation<T extends Zeta.Dictionary<object>, K extends keyof T>(resources: T, defaultLang: K) {
    type ResourceObject = typeof resources[K];
    type ResourcePrefix = StringKeysOf<ResourceObject>;
    type ResourceKey<T extends ResourcePrefix> = StringKeysOf<ResourceObject[T]>;
    type ResourceGlobalKey = { [P in ResourcePrefix]: `${P}.${StringKeysOf<ResourceObject[P]>}` }[ResourcePrefix];

    interface UseTranslationHook {
        /**
         * Create translation callback which only looks up all prefixes.
         * Translation key must include prefix.
         */
        (): Translation<ResourceGlobalKey>;
        /**
         * Create translation callback which only looks up the given prefixes.
         * Translation string will be looked up in prefixes of the specified order.
         */
        <T extends readonly ResourcePrefix[]>(...args: T): Translation<ResourceKey<ArrayMember<T>>>;
    }

    declare const translate: Translate<ResourceGlobalKey>;
    declare const useTranslation: UseTranslationHook;
    return { translate, useTranslation };
}
