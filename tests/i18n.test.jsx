import { act, renderHook } from "@testing-library/react-hooks";
import { jest } from "@jest/globals";
import { makeTranslation, useLanguage } from "src/i18n";
import initAppBeforeAll from "./harness/initAppBeforeAll";

const app = initAppBeforeAll(app => {
    app.useI18n({
        languages: ['en', 'de']
    });
});

beforeEach(async () => {
    if (app.language !== 'en') {
        let promise = app.watchOnce('language');
        app.language = 'en';
        return promise;
    }
});

describe('useLanguage', () => {
    it('should cause component to rerender when language changed', async () => {
        const { result } = renderHook(() => useLanguage());
        expect(result.current).toBe('en');

        await act(() => {
            let promise = app.watchOnce('language');
            app.language = 'de';
            return promise;
        });
        expect(result.current).toBe('de');
    });
});

describe('makeTranslation', () => {
    it('should return translate and useTranslation callbacks', () => {
        const { translate, useTranslation } = makeTranslation({ en: {} }, 'en');
        expect(typeof translate).toBe('function');
        expect(typeof useTranslation).toBe('function');
    });
});

describe('translate', () => {
    it('should return translated string in current language', () => {
        const { translate } = makeTranslation({
            en: { prefix: { key: 'en_string' } },
            de: { prefix: { key: 'de_string' } },
        }, 'de');
        expect(translate('prefix.key')).toBe('en_string');
    });

    it('should return translated string in specified language', () => {
        const { translate } = makeTranslation({
            en: { prefix: { key: 'en_string' } },
            de: { prefix: { key: 'de_string' } },
        }, 'de');
        expect(translate('prefix.key', null, 'de')).toBe('de_string');
    });

    it('should return translated string in default language if key does not exist', () => {
        const { translate } = makeTranslation({
            de: { prefix: { key: 'de_string' } }
        }, 'de');
        expect(translate('prefix.key')).toBe('de_string');
    });

    it('should interpolate translation string', () => {
        const { translate } = makeTranslation({
            en: { prefix: { key: '{{value}}' } }
        }, 'en');
        expect(translate('prefix.key', { value: 1 })).toBe('1');
    });

    it('should return key if key does not exist in default language', () => {
        const { translate } = makeTranslation({
            en: { prefix: { key: '{{value}}' } }
        }, 'en');
        expect(translate('prefix.key1')).toBe('prefix.key1');
    });

    it('should not encode reserved characters in normal variant', () => {
        const { translate } = makeTranslation({
            en: { prefix: { key: '<>&"\'' } }
        }, 'en');
        expect(translate('prefix.key')).toBe('<>&"\'');
        expect(translate('prefix.key', {})).toBe('<>&"\'');
    });

    it('should not encode reserved characters in lazy variant', () => {
        const { translate } = makeTranslation({
            en: { prefix: { key: '<>&"\'' } }
        }, 'en');
        expect(translate.lazy('prefix.key').toString()).toBe('<>&"\'');
        expect(translate.lazy('prefix.key', {}).toString()).toBe('<>&"\'');
    });

    it('should encode reserved characters in html variant', () => {
        const { translate } = makeTranslation({
            en: { prefix: { key: '<>&"\'' } }
        }, 'en');
        expect(translate.html('prefix.key')).toEqual({ __html: '&lt;&gt;&amp;&quot;&#39;' });
        expect(translate.html('prefix.key', {})).toEqual({ __html: '&lt;&gt;&amp;&quot;&#39;' });
    });

    it('should return empty string as is', () => {
        const { translate } = makeTranslation({
            en: { prefix: { key1: '', key2: '' } },
            de: { prefix: { key1: '', key2: 'foo' } }
        }, 'de');
        expect(translate('prefix.key1')).toBe('');
        expect(translate('prefix.key2')).toBe('');
    });

    it('should return empty string from evaluation', () => {
        const { translate } = makeTranslation({
            en: { prefix: { key: '{{foo}}' } }
        }, 'en');
        expect(translate('prefix.key', {})).toBe('');
    });

    it('should discard non-string value', () => {
        const { translate } = makeTranslation({
            en: { prefix: { key: '' } }
        }, 'en');
        expect(translate('prefix.hasOwnProperty')).toBe('prefix.hasOwnProperty');
    });
});

describe('getTranslation', () => {
    it('should return translated string in current language', () => {
        const { getTranslation } = makeTranslation({
            en: { prefix: { key: 'en_string' } },
            de: { prefix: { key: 'de_string' } },
        }, 'de');
        expect(getTranslation('prefix')('key')).toBe('en_string');
    });

    it('should return translated string in specified language', () => {
        const { getTranslation } = makeTranslation({
            en: { prefix: { key: 'en_string' } },
            de: { prefix: { key: 'de_string' } },
        }, 'de');
        expect(getTranslation('prefix')('key', null, 'de')).toBe('de_string');
    });

    it('should return translated string in default language if key does not exist', () => {
        const { getTranslation } = makeTranslation({
            de: { prefix: { key: 'de_string' } }
        }, 'de');
        expect(getTranslation('prefix')('key')).toBe('de_string');
    });

    it('should interpolate translation string', () => {
        const { getTranslation } = makeTranslation({
            en: { prefix: { key: '{{value}}' } }
        }, 'en');
        expect(getTranslation('prefix')('key', { value: 1 })).toBe('1');
    });

    it('should return key if key does not exist in default language', () => {
        const { getTranslation } = makeTranslation({
            en: { prefix: { key: '{{value}}' } }
        }, 'en');
        expect(getTranslation('prefix')('key1')).toBe('key1');
    });

    it('should not encode reserved characters in normal variant', () => {
        const { getTranslation } = makeTranslation({
            en: { prefix: { key: '<>&"\'' } }
        }, 'en');
        expect(getTranslation('prefix')('key')).toBe('<>&"\'');
        expect(getTranslation('prefix')('key', {})).toBe('<>&"\'');
    });

    it('should not encode reserved characters in lazy variant', () => {
        const { getTranslation } = makeTranslation({
            en: { prefix: { key: '<>&"\'' } }
        }, 'en');
        expect(getTranslation('prefix').lazy('key').toString()).toBe('<>&"\'');
        expect(getTranslation('prefix').lazy('key', {}).toString()).toBe('<>&"\'');
    });

    it('should encode reserved characters in html variant', () => {
        const { getTranslation } = makeTranslation({
            en: { prefix: { key: '<>&"\'' } }
        }, 'en');
        expect(getTranslation('prefix').html('key')).toEqual({ __html: '&lt;&gt;&amp;&quot;&#39;' });
        expect(getTranslation('prefix').html('key', {})).toEqual({ __html: '&lt;&gt;&amp;&quot;&#39;' });
    });

    it('should return empty string as is', () => {
        const { getTranslation } = makeTranslation({
            en: { prefix: { key1: '', key2: '' } },
            de: { prefix: { key1: '', key2: 'foo' } }
        }, 'de');
        expect(getTranslation('prefix')('key1')).toBe('');
        expect(getTranslation('prefix')('key2')).toBe('');
    });

    it('should return empty string from evaluation', () => {
        const { getTranslation } = makeTranslation({
            en: { prefix: { key: '{{foo}}' } }
        }, 'en');
        expect(getTranslation('prefix')('key', {})).toBe('');
    });

    it('should discard non-string value', () => {
        const { getTranslation } = makeTranslation({
            en: { prefix: { key: '' } }
        }, 'en');
        expect(getTranslation('prefix')('hasOwnProperty')).toBe('hasOwnProperty');
    });
});

describe('useTranslation', () => {
    it('should return unique function for each langauge', async () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key: '' } }
        }, 'en');
        const { result } = renderHook(() => useTranslation('prefix'));
        const t = result.current.t;
        expect(result.current.language).toBe('en');

        await act(async () => {
            app.language = 'de';
        });
        expect(result.current.language).toBe('de');
        expect(result.current.t).not.toBe(t);

        await act(async () => {
            app.language = 'en';
        });
        expect(result.current.language).toBe('en');
        expect(result.current.t).toBe(t);
    });

    it('should return translated string in current language', () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key: 'en_string' } },
            de: { prefix: { key: 'de_string' } },
        }, 'de');
        const { result } = renderHook(() => useTranslation('prefix'));
        expect(result.current.t('key')).toBe('en_string');
    });

    it('should return translated string in specified language', () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key: 'en_string' } },
            de: { prefix: { key: 'de_string' } },
        }, 'de');
        const { result } = renderHook(() => useTranslation('prefix'));
        expect(result.current.t('key', null, 'de')).toBe('de_string');
    });

    it('should return translated string in default language if key does not exist', () => {
        const { useTranslation } = makeTranslation({
            de: { prefix: { key: 'de_string' } }
        }, 'de');
        const { result } = renderHook(() => useTranslation('prefix'));
        expect(result.current.t('key')).toBe('de_string');
    });

    it('should interpolate translation string', () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key: '{{value}}' } }
        }, 'en');
        const { result } = renderHook(() => useTranslation('prefix'));
        expect(result.current.t('key', { value: 1 })).toBe('1');
    });

    it('should return key if key does not exist in default language', () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key: '{{value}}' } }
        }, 'en');
        const { result } = renderHook(() => useTranslation('prefix'));
        expect(result.current.t('key1')).toBe('key1');
    });

    it('should find key in prefixes of specified order', () => {
        const { useTranslation } = makeTranslation({
            en: {
                prefix1: { key: 'prefix1_value' },
                prefix2: { key: 'prefix2_value' },
            }
        }, 'en');
        const { result } = renderHook(() => useTranslation('prefix2', 'prefix1'));
        expect(result.current.t('key')).toBe('prefix2_value');
    });

    it('should not encode reserved characters in normal variant', () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key: '<>&"\'' } }
        }, 'en');
        const { result } = renderHook(() => useTranslation('prefix'));
        expect(result.current.t('key')).toBe('<>&"\'');
        expect(result.current.t('key', {})).toBe('<>&"\'');
    });

    it('should not encode reserved characters in lazy variant', () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key: '<>&"\'' } }
        }, 'en');
        const { result } = renderHook(() => useTranslation('prefix'));
        expect(result.current.t.lazy('key').toString()).toBe('<>&"\'');
        expect(result.current.t.lazy('key', {}).toString()).toBe('<>&"\'');
    });

    it('should encode reserved characters in html variant', () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key: '<>&"\'' } }
        }, 'en');
        const { result } = renderHook(() => useTranslation('prefix'));
        expect(result.current.t.html('key')).toEqual({ __html: '&lt;&gt;&amp;&quot;&#39;' });
        expect(result.current.t.html('key', {})).toEqual({ __html: '&lt;&gt;&amp;&quot;&#39;' });
    });

    it('should return empty string as is', () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key1: '', key2: '' } },
            de: { prefix: { key1: '', key2: 'foo' } }
        }, 'de');
        const { result } = renderHook(() => useTranslation('prefix'));
        expect(result.current.t('key1')).toBe('');
        expect(result.current.t('key2')).toBe('');
    });

    it('should return empty string from evaluation', () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key: '{{foo}}' } }
        }, 'en');
        const { result } = renderHook(() => useTranslation('prefix'));
        expect(result.current.t('key', {})).toBe('');
    });

    it('should discard non-string value', () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key: '' } }
        }, 'en');
        const { result } = renderHook(() => useTranslation('prefix'));
        expect(result.current.t('hasOwnProperty')).toBe('hasOwnProperty');
    });

    it('should work without any prefixes', () => {
        const { useTranslation } = makeTranslation({
            en: { prefix: { key: 'en_string' } },
            de: { prefix: { key: 'de_string' } },
        }, 'de');
        const { result } = renderHook(() => useTranslation());
        expect(result.current.t('prefix.key')).toBe('en_string');
        expect(typeof result.current.t.lazy).toBe('function');
        expect(typeof result.current.t.html).toBe('function');
    });
});

describe('keys', () => {
    it('should return keys in default language', () => {
        const { keys } = makeTranslation({
            en: { prefix: { key: 'en_string' } },
            de: { prefix: { key: 'de_string', key1: '' } },
        }, 'en');
        expect(keys('prefix')).toEqual(['key']);
    });

    it('should return empty array for inexist prefix', () => {
        const { keys } = makeTranslation({
            en: { prefix: { key: 'en_string' } },
            de: { prefix: { key: 'de_string' } },
        }, 'en');
        expect(keys('prefix1')).toEqual([]);
    });
});

describe('Stringifiable', () => {
    it('should call toString for all primitive conversions', () => {
        const { translate } = makeTranslation({
            en: { prefix: { key: '42' } }
        }, 'en');
        const t = translate.lazy('prefix.key');
        jest.spyOn(t, 'toString');

        expect(+t).toBe(42);
        expect(`${t}`).toBe('42');
        expect(t + '').toBe('42');
        expect(t.toString).toBeCalledTimes(3);
    });
});
