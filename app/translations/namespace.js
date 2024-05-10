import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './it';
import it from './it';

const namespace = new I18n({
    en: en,
    it: it,
});

namespace.locale = getLocales()[0].languageCode;

export default namespace;
