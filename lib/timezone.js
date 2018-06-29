var isoCountries = {
    "ab": "Abkhaz",
    "aa": "Afar",
    "af": "Afrikaans",
    "ak": "Akan",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "an": "Aragonese",
    "hy": "Armenian",
    "as": "Assamese",
    "av": "Avaric",
    "ae": "Avestan",
    "ay": "Aymara",
    "az": "Azerbaijani",
    "bm": "Bambara",
    "ba": "Bashkir",
    "eu": "Basque",
    "be": "Belarusian",
    "bn": "Bengali; Bangla",
    "bh": "Bihari",
    "bi": "Bislama",
    "bs": "Bosnian",
    "br": "Breton",
    "bg": "Bulgarian",
    "my": "Burmese",
    "ca": "Catalan; Valencian",
    "ch": "Chamorro",
    "ce": "Chechen",
    "ny": "Chichewa; Chewa; Nyanja",
    "zh-Hans": "Chinese",
    "cv": "Chuvash",
    "kw": "Cornish",
    "co": "Corsican",
    "cr": "Cree",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "dv": "Divehi; Dhivehi; Maldivian;",
    "nl": "Dutch",
    "dz": "Dzongkha",
    "en": "English",
    "eo": "Esperanto",
    "et": "Estonian",
    "ee": "Ewe",
    "fo": "Faroese",
    "fj": "Fijian",
    "fi": "Finnish",
    "fr": "French",
    "ff": "Fula; Fulah; Pulaar; Pular",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek, Modern",
    "gn": "GuaranÃ­",
    "gu": "Gujarati",
    "ht": "Haitian; Haitian Creole",
    "ha": "Hausa",
    "he": "Hebrew (modern)",
    "hz": "Herero",
    "hi": "Hindi",
    "ho": "Hiri Motu",
    "hu": "Hungarian",
    "ia": "Interlingua",
    "id": "Indonesian",
    "ie": "Interlingue",
    "ga": "Irish",
    "ig": "Igbo",
    "ik": "Inupiaq",
    "io": "Ido",
    "is": "Icelandic",
    "it": "Italian",
    "iu": "Inuktitut",
    "ja": "Japanese",
    "jv": "Javanese",
    "kl": "Kalaallisut, Greenlandic",
    "kn": "Kannada",
    "kr": "Kanuri",

    "ks": "Kashmiri",

    "kk": "Kazakh",

    "km": "Khmer",

    "ki": "Kikuyu, Gikuyu",

    "rw": "Kinyarwanda",

    "ky": "Kyrgyz",

    "kv": "Komi",

    "kg": "Kongo",

    "ko": "Korean",

    "ku": "Kurdish",

    "kj": "Kwanyama, Kuanyama",

    "la": "Latin",

    "lb": "Luxembourgish, Letzeburgesch",

    "lg": "Ganda",

    "li": "Limburgish, Limburgan, Limburger",

    "ln": "Lingala",

    "lo": "Lao",

    "lt": "Lithuanian",

    "lu": "Luba-Katanga",

    "lv": "Latvian",

    "gv": "Manx",

    "mk": "Macedonian",

    "mg": "Malagasy",

    "ms": "Malay",

    "ml": "Malayalam",

    "mt": "Maltese",

    "mi": "MÄori",

    "mr": "Marathi (MarÄá¹­hÄ«)",

    "mh": "Marshallese",

    "mn": "Mongolian",

    "na": "Nauru",

    "nv": "Navajo, Navaho",

    "nb": "Norwegian BokmÃ¥l",

    "nd": "North Ndebele",

    "ne": "Nepali",

    "ng": "Ndonga",

    "nn": "Norwegian Nynorsk",

    "no": "Norwegian",

    "ii": "Nuosu",

    "nr": "South Ndebele",

    "oc": "Occitan",

    "oj": "Ojibwe, Ojibwa",

    "cu": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",

    "om": "Oromo",

    "or": "Oriya",

    "os": "Ossetian, Ossetic",

    "pa": "Panjabi, Punjabi",

    "pi": "PÄli",

    "fa": "Persian (Farsi)",

    "pl": "Polish",

    "ps": "Pashto, Pushto",

    "pt": "Portuguese",

    "qu": "Quechua",

    "rm": "Romansh",

    "rn": "Kirundi",

    "ro": "Romanian, [])",

    "ru": "Russian",

    "sa": "Sanskrit (Saá¹ská¹›ta)",

    "sc": "Sardinian",

    "sd": "Sindhi",

    "se": "Northern Sami",

    "sm": "Samoan",

    "sg": "Sango",

    "sr": "Serbian",

    "gd": "Scottish Gaelic; Gaelic",

    "sn": "Shona",

    "si": "Sinhala, Sinhalese",

    "sk": "Slovak",

    "sl": "Slovene",

    "so": "Somali",

    "st": "Southern Sotho",

    "az": "South Azerbaijani",

    "es": "Spanish; Castilian",

    "su": "Sundanese",

    "sw": "Swahili",

    "ss": "Swati",

    "sv": "Swedish",

    "ta": "Tamil",

    "te": "Telugu",

    "tg": "Tajik",

    "th": "Thai",

    "ti": "Tigrinya",

    "bo": "Tibetan Standard, Tibetan, Central",

    "tk": "Turkmen",

    "tl": "Tagalog",

    "tn": "Tswana",

    "to": "Tonga (Tonga Islands)",

    "tr": "Turkish",

    "ts": "Tsonga",

    "tt": "Tatar",

    "tw": "Twi",

    "ty": "Tahitian",

    "ug": "Uyghur, Uighur",

    "uk": "Ukrainian",

    "ur": "Urdu",

    "uz": "Uzbek",

    "ve": "Venda",

    "vi": "Vietnamese",

    "vo": "VolapÃ¼k",

    "wa": "Walloon",

    "cy": "Welsh",

    "wo": "Wolof",

    "fy": "Western Frisian",

    "xh": "Xhosa",

    "yi": "Yiddish",

    "yo": "Yoruba",

    "za": "Zhuang, Chuang",

    "zu": "Zulu"

        ,
    "ab": "Abkhaz",

    "aa": "Afar",

    "af": "Afrikaans",

    "ak": "Akan",

    "sq": "Albanian",

    "am": "Amharic",

    "ar": "Arabic",

    "an": "Aragonese",

    "hy": "Armenian",

    "as": "Assamese",

    "av": "Avaric",

    "ae": "Avestan",

    "ay": "Aymara",

    "az": "Azerbaijani",

    "bm": "Bambara",

    "ba": "Bashkir",

    "eu": "Basque",

    "be": "Belarusian",

    "bn": "Bengali; Bangla",

    "bh": "Bihari",

    "bi": "Bislama",

    "bs": "Bosnian",

    "br": "Breton",

    "bg": "Bulgarian",

    "my": "Burmese",

    "ca": "Catalan; Valencian",

    "ch": "Chamorro",

    "ce": "Chechen",

    "ny": "Chichewa; Chewa; Nyanja",

    "zh-Hans": "Chinese",

    "cv": "Chuvash",

    "kw": "Cornish",

    "co": "Corsican",

    "cr": "Cree",

    "hr": "Croatian",

    "cs": "Czech",

    "da": "Danish",

    "dv": "Divehi; Dhivehi; Maldivian;",

    "nl": "Dutch",

    "dz": "Dzongkha",

    "en": "English",

    "eo": "Esperanto",

    "et": "Estonian",

    "ee": "Ewe",

    "fo": "Faroese",

    "fj": "Fijian",

    "fi": "Finnish",

    "fr": "French",

    "ff": "Fula; Fulah; Pulaar; Pular",

    "gl": "Galician",

    "ka": "Georgian",

    "de": "German",

    "el": "Greek, Modern",

    "gn": "GuaranÃ­",

    "gu": "Gujarati",

    "ht": "Haitian; Haitian Creole",

    "ha": "Hausa",

    "he": "Hebrew (modern)",

    "hz": "Herero",

    "hi": "Hindi",

    "ho": "Hiri Motu",

    "hu": "Hungarian",

    "ia": "Interlingua",

    "id": "Indonesian",

    "ie": "Interlingue",

    "ga": "Irish",

    "ig": "Igbo",

    "ik": "Inupiaq",

    "io": "Ido",

    "is": "Icelandic",

    "it": "Italian",

    "iu": "Inuktitut",

    "ja": "Japanese",

    "jv": "Javanese",

    "kl": "Kalaallisut, Greenlandic",

    "kn": "Kannada",

    "kr": "Kanuri",

    "ks": "Kashmiri",

    "kk": "Kazakh",

    "km": "Khmer",

    "ki": "Kikuyu, Gikuyu",

    "rw": "Kinyarwanda",

    "ky": "Kyrgyz",

    "kv": "Komi",

    "kg": "Kongo",

    "ko": "Korean",

    "ku": "Kurdish",

    "kj": "Kwanyama, Kuanyama",

    "la": "Latin",

    "lb": "Luxembourgish, Letzeburgesch",

    "lg": "Ganda",

    "li": "Limburgish, Limburgan, Limburger",

    "ln": "Lingala",

    "lo": "Lao",

    "lt": "Lithuanian",

    "lu": "Luba-Katanga",

    "lv": "Latvian",

    "gv": "Manx",

    "mk": "Macedonian",

    "mg": "Malagasy",

    "ms": "Malay",

    "ml": "Malayalam",

    "mt": "Maltese",

    "mi": "MÄori",

    "mr": "Marathi (MarÄá¹­hÄ«)",

    "mh": "Marshallese",

    "mn": "Mongolian",

    "na": "Nauru",

    "nv": "Navajo, Navaho",

    "nb": "Norwegian BokmÃ¥l",

    "nd": "North Ndebele",

    "ne": "Nepali",

    "ng": "Ndonga",

    "nn": "Norwegian Nynorsk",

    "no": "Norwegian",

    "ii": "Nuosu",

    "nr": "South Ndebele",

    "oc": "Occitan",

    "oj": "Ojibwe, Ojibwa",

    "cu": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",

    "om": "Oromo",

    "or": "Oriya",

    "os": "Ossetian, Ossetic",

    "pa": "Panjabi, Punjabi",

    "pi": "PÄli",

    "fa": "Persian (Farsi)",

    "pl": "Polish",

    "ps": "Pashto, Pushto",

    "pt": "Portuguese",

    "qu": "Quechua",

    "rm": "Romansh",

    "rn": "Kirundi",

    "ro": "Romanian, [])",

    "ru": "Russian",

    "sa": "Sanskrit (Saá¹ská¹›ta)",

    "sc": "Sardinian",

    "sd": "Sindhi",

    "se": "Northern Sami",

    "sm": "Samoan",

    "sg": "Sango",

    "sr": "Serbian",

    "gd": "Scottish Gaelic; Gaelic",

    "sn": "Shona",

    "si": "Sinhala, Sinhalese",

    "sk": "Slovak",

    "sl": "Slovene",

    "so": "Somali",

    "st": "Southern Sotho",

    "az": "South Azerbaijani",

    "es": "Spanish; Castilian",

    "su": "Sundanese",

    "sw": "Swahili",

    "ss": "Swati",

    "sv": "Swedish",

    "ta": "Tamil",

    "te": "Telugu",

    "tg": "Tajik",

    "th": "Thai",

    "ti": "Tigrinya",

    "bo": "Tibetan Standard, Tibetan, Central",

    "tk": "Turkmen",

    "tl": "Tagalog",

    "tn": "Tswana",

    "to": "Tonga (Tonga Islands)",

    "tr": "Turkish",

    "ts": "Tsonga",

    "tt": "Tatar",

    "tw": "Twi",

    "ty": "Tahitian",

    "ug": "Uyghur, Uighur",

    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "ve": "Venda",
    "vi": "Vietnamese",
    "vo": "VolapÃ¼k",
    "wa": "Walloon",
    "cy": "Welsh",
    "wo": "Wolof",
    "fy": "Western Frisian",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "za": "Zhuang, Chuang",
    "zu": "Zulu"
}

function getCountryFromHTTP(accept_language) {

    var CC; //Country Code
    //in some cases like "fr" or "hu" the language and the country codes are the same
    if (accept_language.length === 2) {
        CC = accept_language.toUpperCase();
    }
    //get "PT" out of "pt-PT"
    else if (accept_language.length === 5) {
        CC = accept_language.substring(3, 5);
    }
    //ex: "pt-PT,pt;q=0.9,en;q=0.8,en-GB;q=0.7,de-DE;q=0.6,de;q=0.5,fr-FR;q=0.4,fr;q=0.3,es;q=0.2"
    //gets the first two capial letters that fit into 2-letter ISO country code
    else if (accept_language.length > 5) {
        var substr;
        for (var i = 7; i + 2 < accept_language.length; i++) {
            substr = accept_language.substring(i, i + 2);
            if (isoCountries.hasOwnProperty(substr)) {
                return substr;
            }
        }
    }
    if (isoCountries.hasOwnProperty(CC)) {
        return CC;
    }
    return false;
};


module.exports = {
    isoCountries: isoCountries,
    getCountryFromHTTP: getCountryFromHTTP,
}