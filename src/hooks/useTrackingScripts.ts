import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useTrackingScripts() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;

    supabase
      .from('site_content')
      .select('section_key, metadata')
      .like('section_key', 'integration_%')
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setLoaded(true);

        const get = (key: string, field: string): string => {
          const item = data.find(d => d.section_key === `integration_${key}`);
          return ((item?.metadata as Record<string, string>) ?? {})[field] ?? '';
        };

        const gaId = get('google_analytics', 'measurement_id');
        const gtmId = get('google_tag_manager', 'container_id');
        const adsId = get('google_ads', 'conversion_id');

        // Initialize dataLayer once, shared by GA4, GTM, and Google Ads
        const needsDataLayer = gaId || gtmId || adsId;
        if (needsDataLayer) {
          const dlScript = document.createElement('script');
          dlScript.textContent = `window.dataLayer=window.dataLayer||[];`;
          document.head.appendChild(dlScript);
        }

        // Google Tag Manager (if used, GTM manages GA4/Ads tags — don't add standalone gtag)
        if (gtmId) {
          const s = document.createElement('script');
          s.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
          document.head.appendChild(s);
          // Note: When GTM is active, GA4 and Google Ads should be configured
          // inside GTM itself, not via standalone gtag. We still allow standalone
          // below for users who don't configure them inside GTM.
        }

        // Shared gtag function (used by GA4 and Google Ads standalone)
        const needsGtag = (gaId || adsId) && !gtmId;
        if (needsGtag) {
          const gtagFn = document.createElement('script');
          gtagFn.textContent = `function gtag(){dataLayer.push(arguments);}gtag('js',new Date());`;
          document.head.appendChild(gtagFn);
        }

        // Google Analytics GA4 (standalone, skip if GTM handles it)
        if (gaId && !gtmId) {
          const s1 = document.createElement('script');
          s1.async = true;
          s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          document.head.appendChild(s1);

          const s2 = document.createElement('script');
          s2.textContent = `gtag('config','${gaId}');`;
          document.head.appendChild(s2);
        }

        // Google Ads conversion tracking (standalone, skip if GTM handles it)
        if (adsId && !gtmId) {
          // Only load gtag/js if GA4 didn't already load it
          if (!gaId) {
            const s1 = document.createElement('script');
            s1.async = true;
            s1.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
            document.head.appendChild(s1);
          }

          const convLabel = get('google_ads', 'conversion_label');
          const s2 = document.createElement('script');
          s2.textContent = `gtag('config','${adsId}');${convLabel ? `gtag('event','conversion',{'send_to':'${adsId}/${convLabel}'});` : ''}`;
          document.head.appendChild(s2);
        }

        // Google Search Console verification meta tag
        // Note: Google's crawler renders JS, so dynamically injected meta tags
        // ARE detected. Google confirmed JS-rendered content is indexed.
        const gscCode = get('google_search_console', 'verification_code');
        if (gscCode) {
          const meta = document.createElement('meta');
          meta.name = 'google-site-verification';
          meta.content = gscCode;
          document.head.appendChild(meta);
        }

        // Bing Webmaster verification
        const bingCode = get('bing_webmaster', 'verification_code');
        if (bingCode) {
          const meta = document.createElement('meta');
          meta.name = 'msvalidate.01';
          meta.content = bingCode;
          document.head.appendChild(meta);
        }

        // Facebook/Meta Pixel
        const fbPixel = get('facebook_pixel', 'pixel_id');
        if (fbPixel) {
          const s = document.createElement('script');
          s.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbPixel}');fbq('track','PageView');`;
          document.head.appendChild(s);
        }

        // Custom Head Scripts
        const customCode = get('custom_head_scripts', 'code');
        if (customCode) {
          const div = document.createElement('div');
          div.innerHTML = customCode;
          Array.from(div.children).forEach(child => {
            document.head.appendChild(child.cloneNode(true));
          });
        }
      });
  }, [loaded]);
}
