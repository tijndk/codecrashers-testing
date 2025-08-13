"use strict";

let translations = {};
let currentLang = localStorage.getItem("lang") || "en";

export async function loadLanguage(lang) {
    try {
        const response = await fetch(`./js/json/${lang}.json`);
        translations = await response.json();
        currentLang = lang;
        localStorage.setItem("lang", lang);
        applyTranslations();
    } catch (err) {
        console.error(`Error loading language file for "${lang}":`, err);
    }
}

export function t(key, params = {}) {
    const value = key.split(".").reduce((o, i) => o?.[i], translations) || key;
    return Object.keys(params).reduce((str, varKey) => {
        return str.replace(`{${varKey}}`, params[varKey]);
    }, value);
}

export function applyTranslations() {
    document.querySelectorAll("[data-lang]").forEach((el) => {
        const key = el.getAttribute("data-lang");
        el.textContent = t(key);
    });
}

export function setCurrentLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
}

export function setupLanguageSelector(selectId = "lang-select", onChangeCallback) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.value = localStorage.getItem("lang" || "en");

    select.addEventListener("change", async (e) => {
        const lang = e.target.value;
        await loadLanguage(lang);
        if (onChangeCallback) {
            onChangeCallback(lang);
        }
    });
}