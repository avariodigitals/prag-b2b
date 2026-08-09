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
  website_name: 'PRAG',
  website_privacy_policy_url: 'https://www.prag.global/privacy',
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
    __pragConsentCookieConsentInitialized?: boolean;
  }
}

export default function CookieConsentLoader() {
  useEffect(() => {
    const injectOverrides = () => {
      const existing = document.getElementById('prag-cookie-consent-overrides');
      if (existing) return;

      const style = document.createElement('style');
      style.id = 'prag-cookie-consent-overrides';
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
          max-height: calc(100vh - 2rem) !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
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

        body.prag-consent-accepted #termsfeed-com---nb,
        body.prag-consent-accepted .termsfeed-com---nb,
        body.prag-consent-accepted .termsfeed-com---nb-simple {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        @media (max-width: 768px) {
          #termsfeed-com---nb,
          .termsfeed-com---nb,
          .termsfeed-com---nb-simple,
          #termsfeed-com---nb.termsfeed-com---is-visible,
          .termsfeed-com---nb.termsfeed-com---is-visible,
          .termsfeed-com---nb-simple.termsfeed-com---is-visible {
            padding: 0.75rem !important;
          }

          #termsfeed-com---nb .cc-nb-main-container,
          .termsfeed-com---nb-simple .cc-nb-main-container {
            width: calc(100vw - 1.5rem) !important;
            max-width: 420px !important;
            max-height: calc(100vh - 1.5rem) !important;
            border-radius: 14px !important;
          }

          #termsfeed-com---nb .cc-nb-title,
          .termsfeed-com---nb-simple .cc-nb-title {
            font-size: 2rem !important;
            line-height: 1.15 !important;
          }

          #termsfeed-com---nb .cc-nb-text,
          .termsfeed-com---nb-simple .cc-nb-text {
            font-size: 1rem !important;
            line-height: 1.45 !important;
          }

          #termsfeed-com---nb .cc-nb-buttons-container,
          .termsfeed-com---nb-simple .cc-nb-buttons-container {
            display: flex !important;
            flex-direction: column !important;
            gap: 0.5rem !important;
          }

          #termsfeed-com---nb .cc-nb-buttons-container button,
          .termsfeed-com---nb-simple .cc-nb-buttons-container button,
          #termsfeed-com---nb .cc-nb-buttons-container .cc-nb-changep,
          .termsfeed-com---nb-simple .cc-nb-buttons-container .cc-nb-changep {
            width: 100% !important;
            min-height: 48px !important;
            font-size: 1rem !important;
          }

          #termsfeed-com---preferences-center .cc-cp-foot,
          .termsfeed-com---pc-overlay .cc-cp-foot {
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.6rem !important;
            padding: 0.75rem !important;
          }

          #termsfeed-com---preferences-center .cc-cp-foot-save,
          #termsfeed-com---preferences-center .cc-cp-foot-button,
          .termsfeed-com---pc-overlay .cc-cp-foot-save,
          .termsfeed-com---pc-overlay .cc-cp-foot-button {
            width: 100% !important;
            max-width: 100% !important;
            min-height: 48px !important;
            box-sizing: border-box !important;
            font-size: 1rem !important;
            line-height: 1.2 !important;
          }

          #termsfeed-com---preferences-center .cc-cp-foot-byline,
          .termsfeed-com---pc-overlay .cc-cp-foot-byline {
            margin: 0 !important;
            text-align: left !important;
            font-size: 0.9rem !important;
            line-height: 1.3 !important;
          }
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
      if (window.__pragConsentCookieConsentInitialized) return true;
      if (!window.cookieconsent || typeof window.cookieconsent.run !== 'function') return false;

      window.cookieconsent.run(CONSENT_CONFIG);
      window.__pragConsentCookieConsentInitialized = true;
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
      document.body.classList.toggle('prag-consent-accepted', accepted);
      if (accepted) {
        hideNoticeBanner();
      }
    };

    const bindNoticeButtons = () => {
      const agree = document.querySelector('.cc-nb-okagree') as HTMLButtonElement | null;
      const decline = document.querySelector('.cc-nb-reject') as HTMLButtonElement | null;

      const bind = (button: HTMLButtonElement | null) => {
        if (!button || button.getAttribute('data-prag-consent-bound') === 'true') return;

        button.setAttribute('data-prag-consent-bound', 'true');
        button.addEventListener('click', () => {
          window.setTimeout(syncAcceptedClass, 50);
        });
      };

      bind(agree);
      bind(decline);
    };

    const bindPreferencesLink = () => {
      const trigger = document.getElementById('open_preferences_center');
      if (!trigger || trigger.getAttribute('data-prag-bound') === 'true') return;

      trigger.setAttribute('data-prag-bound', 'true');
      trigger.addEventListener('click', (event) => {
        event.preventDefault();

        if (!openPreferencesCenter()) {
          window.__pragConsentCookieConsentInitialized = false;
          runConsent();
          openPreferencesCenter();
        }
      });
    };

    bindPreferencesLink();
    syncAcceptedClass();

    if (runConsent()) return;

    let script = document.querySelector('script[data-prag-cookie-consent="true"]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.src = CONSENT_SCRIPT_SRC;
      script.async = true;
      script.charset = 'UTF-8';
      script.dataset.pragCookieConsent = 'true';
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
