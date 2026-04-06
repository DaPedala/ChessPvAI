import { writable, derived } from 'svelte/store';
import { t, type Lang } from '$lib/lang';

const storedLang = typeof localStorage !== 'undefined'
    ? (localStorage.getItem('lang') as Lang) ?? 'en'
    : 'en';

export const lang = writable<Lang>(storedLang);

lang.subscribe(val => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('lang', val);
    }
});

export const i18n = derived(lang, $lang => t[$lang]);