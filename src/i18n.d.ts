type ResourceGlobalKey<T> = { [P in Zeta.StringKeyOf<T>]: `${P}.${Zeta.StringKeyOf<T[P]>}` }[Zeta.StringKeyOf<T>];
type ResourceKey<T, K extends Zeta.StringKeyOf<T>> = { [P in Zeta.StringKeyOf<T>]: Zeta.StringKeyOf<T[P]> }[K];

export interface Translate<T> {
    /**
     * Returns a translation string.
     * @param key Tranlsation key.
     * @param data Data object to be passed to template engine.
     * @param language Default to current language. If translation is not available, translation from default language will be returned.
     */
    (key: T, data?: any, language?: string): string;
    /**
     * Returns a object containing the translated HTML content that can be passed to {@link React.DOMAttributes.dangerouslySetInnerHTML}.
     * @param key Tranlsation key.
     * @param data Data object to be passed to template engine.
     * @param language Default to current language. If translation is not available, translation from default language will be returned.
     */
    html(key: T, data?: any, language?: string): { __html: string };
    /**
     * Returns a string-coercible object that will convert to translation string when coerced.
     * @param key Tranlsation key.
     * @param data Data object to be passed to template engine.
     * @param language Default to current language. If translation is not available, translation from default language will be returned.
     */
    lazy(key: T, data?: any, language?: string): { [Symbol.toPrimitive](): string; toString(): string };
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

export interface TranslationFactory<T extends object> {
    /**
     * Returns all keys for the given prefix.
     */
    keys<K extends Zeta.StringKeyOf<T>>(prefix: K): ResourceKey<T, K>[];
    /**
     * Returns a translated string based on the given translation key.
     */
    translate: Translate<ResourceGlobalKey<T>>;
    /**
     * Create translation callback which only looks up all prefixes.
     * Translation key must include prefix.
     */
    getTranslation(): Translate<ResourceGlobalKey<T>>;
    /**
     * Create translation callback which only looks up the given prefixes.
     * Translation string will be looked up in prefixes of the specified order.
     */
    getTranslation<K extends readonly Zeta.StringKeyOf<T>[]>(...args: K): Translate<ResourceKey<T, Zeta.ArrayMember<K>>>;
    /**
     * Create translation callback which only looks up all prefixes.
     * Translation key must include prefix.
     */
    useTranslation(): Translation<ResourceGlobalKey<T>>;
    /**
     * Create translation callback which only looks up the given prefixes.
     * Translation string will be looked up in prefixes of the specified order.
     */
    useTranslation<K extends readonly Zeta.StringKeyOf<T>[]>(...args: K): Translation<ResourceKey<T, Zeta.ArrayMember<K>>>;
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
export function makeTranslation<T extends Zeta.Dictionary<object>, K extends keyof T>(resources: T, defaultLang: K): TranslationFactory<T[K]>
