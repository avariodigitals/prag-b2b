'use client';

import { useEffect } from 'react';

const CONSENT_SCRIPT_SRC = 'https://www.termsfeed.com/public/cookie-consent/4.2.0/cookie-consent.js';

const CONSENT_CONFIG = {
  notice_banner_type: 'simple',
  consent_type: 'express',
  palette: 'light',
  language: 'en',
  page_load_consent_levels: ['strictly-necessary'],
  notice_banner_reject_button_hide: false,
  preferences_center_close_button_hide: false,
  page_refresh_confirmation_buttons: false,
  website_name: 'PRAG B2B',
  website_privacy_policy_url: 'https://prag.global/privacy',
};

declare global {
  interface Window {
    cookieconsent?: {
      run: (config: typeof CONSENT_CONFIG) => void;
      openPreferencesCenter?: () => void;
      showPreferences?: () => void;
      showSettings?: () => void;
      show?: () => void;
    };
    __pragB2BCookieConsentInitialized?: boolean;
  }
}

export default function CookieConsentLoader() {
  useEffect(() => {
    const injectOverrides = () => {
      const existing = document.getElementById('prag-b2b-cookie-consent-overrides');
      if (existing) return;

      const style = document.createElement('style');
      style.id = 'prag-b2b-cookie-consent-overrides';
      style.textContent = `
        #termsfeed-com---nb,
        .termsfeed-com---nb,
        .termsfeed-com---nb-simple,
        #termsfeed-com---nb.termsfeed-com---is-visible,
        .termsfeed-com---nb.termsfeed-com---is-visible,
        .termsfeed-com---nb-simple.termsfeed-com---is-visible {
          position: fixed !important;
          top: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: transparent !important;
          z-index: 2147483647 !important;
          padding: 1rem !important;
          pointer-events: none !important;
        }

        #termsfeed-com---nb.termsfeed-com---is-hidden,
        .termsfeed-com---nb.termsfeed-com---is-hidden,
        .termsfeed-com---nb-simple.termsfeed-com---is-hidden {
          display: none !important;
        }

        #termsfeed-com---nb .cc-nb-main-container,
        .termsfeed-com---nb-simple .cc-nb-main-container,
        #termsfeed-com---preferences-center .termsfeed-com---pc-dialog,
        #termsfeed-com---preferences-center .cc-pc-head,
        #termsfeed-com---preferences-center .cc-cp-body,
        #termsfeed-com---preferences-center .cc-cp-foot {
          background: #ffffff !important;
        }

        #termsfeed-com---nb .cc-nb-main-container,
        .termsfeed-com---nb-simple .cc-nb-main-container {
          width: min(640px, 100%) !important;
          max-width: 640px !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.22) !important;
          margin: 0 !important;
          position: static !important;
          pointer-events: auto !important;
        }

        .termsfeed-com---nb-simple .cc-nb-okagree,
        #termsfeed-com---preferences-center .cc-cp-foot-save,
        #termsfeed-com---preferences-center .cc-cp-foot-button {
          border-radius: 9999px !important;
          border: 1px solid #0369a1 !important;
          background: #0369a1 !important;
          color: #ffffff !important;
          font-weight: 600 !important;
        }

        .termsfeed-com---nb-simple .cc-nb-reject {
          border-radius: 9999px !important;
          border: 1px solid #0369a1 !important;
          background: #ffffff !important;
          color: #0369a1 !important;
          font-weight: 600 !important;
        }

        .termsfeed-com---nb-simple .cc-nb-okagree:hover,
        #termsfeed-com---preferences-center .cc-cp-foot-save:hover,
        #termsfeed-com---preferences-center .cc-cp-foot-button:hover {
          background: #075985 !important;
          border-color: #075985 !important;
        }

        body.prag-b2b-consent-accepted #termsfeed-com---nb,
        body.prag-b2b-consent-accepted .termsfeed-com---nb,
        body.prag-b2b-consent-accepted .termsfeed-com---nb-simple {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;

      document.head.appendChild(style);
    };

    injectOverrides();

    const openPreferencesCenter = () => {
      if (!window.cookieconsent) return false;

      if (typeof window.cookieconsent.openPreferencesCenter === 'function') {
        window.cookieconsent.openPreferencesCenter();
        return true;
      }
      if (typeof window.cookieconsent.showPreferences === 'function') {
        window.cookieconsent.showPreferences();
        return true;
      }
      if (typeof window.cookieconsent.showSettings === 'function') {
        window.cookieconsent.showSettings();
        return true;
      }
      if (typeof window.cookieconsent.show === 'function') {
        window.cookieconsent.show();
        return true;
      }

      return false;
    };

    const runConsent = () => {
      if (window.__pragB2BCookieConsentInitialized) return true;
      if (!window.cookieconsent || typeof window.cookieconsent.run !== 'function') return false;

      window.cookieconsent.run(CONSENT_CONFIG);
      window.__pragB2BCookieConsentInitialized = true;
      return true;
    };

    const hideNoticeBanner = () => {
      const notice = document.getElementById('termsfeed-com---nb');
      if (!notice) return;

      notice.classList.remove('termsfeed-com---is-visible');
      notice.classList.add('termsfeed-com---is-hidden');
      (notice as HTMLElement).style.setProperty('display', 'none', 'important');
      (notice as HTMLElement).style.setProperty('visibility', 'hidden', 'important');
      (notice as HTMLElement).style.setProperty('opacity', '0', 'important');
      notice.remove();
    };

    const syncAcceptedClass = () => {
      const accepted = document.cookie.includes('cookie_consent_user_accepted=true');
      document.body.classList.toggle('prag-b2b-consent-accepted', accepted);
      if (accepted) {
        hideNoticeBanner();
      }
    };

    const bindNoticeButtons = () => {
      const agree = document.querySelector('.cc-nb-okagree') as HTMLButtonElement | null;
      const decline = document.querySelector('.cc-nb-reject') as HTMLButtonElement | null;

      const bind = (button: HTMLButtonElement | null) => {
        if (!button || button.getAttribute('data-prag-b2b-consent-bound') === 'true') return;

        button.setAttribute('data-prag-b2b-consent-bound', 'true');
        button.addEventListener('click', () => {
          window.setTimeout(syncAcceptedClass, 50);
        });
      };

      bind(agree);
      bind(decline);
    };

    const bindPreferencesLink = () => {
      const trigger = document.getElementById('open_preferences_center');
      if (!trigger || trigger.getAttribute('data-prag-b2b-bound') === 'true') return;

      trigger.setAttribute('data-prag-b2b-bound', 'true');
      trigger.addEventListener('click', (event) => {
        event.preventDefault();

        if (!openPreferencesCenter()) {
          window.__pragB2BCookieConsentInitialized = false;
          runConsent();
          openPreferencesCenter();
        }
      });
    };

    bindPreferencesLink();
    syncAcceptedClass();

    if (runConsent()) return;

    let script = document.querySelector('script[data-prag-b2b-cookie-consent="true"]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.src = CONSENT_SCRIPT_SRC;
      script.async = true;
      script.charset = 'UTF-8';
      script.dataset.pragB2BCookieConsent = 'true';
      document.head.appendChild(script);
    }

    const onLoad = () => {
      injectOverrides();
      runConsent();
      bindPreferencesLink();
      bindNoticeButtons();
      syncAcceptedClass();
    };

    script.addEventListener('load', onLoad);

    let attempts = 0;
    const maxAttempts = 60;
    const interval = window.setInterval(() => {
      attempts += 1;
      injectOverrides();
      bindPreferencesLink();
      bindNoticeButtons();
      syncAcceptedClass();
      if (runConsent() || attempts >= maxAttempts) {
        window.clearInterval(interval);
      }
    }, 250);

    return () => {
      script?.removeEventListener('load', onLoad);
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
