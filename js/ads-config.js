/* Ads. Two separate settings:
   - "web": Google AdSense on the results screen of the website / installed web app (off until you add your ids).
   - the rest: AdMob inside the Android app (only used if you build the APK later).
   Web: put your AdSense publisher id and ad unit id below and set web.enabled:true (see ADS.md).
   Everything here uses Google's public TEST ids, so nothing earns money yet and nothing can break your AdMob account.
   To go live: create an AdMob account, add the app, then put your own ids below and set testMode:false (see ADS.md). */
window.ADS_CONFIG={
 web:{
  enabled:false,
  client:"",          /* your AdSense publisher id, like ca-pub-1234567890123456 */
  slot:"",            /* the ad unit id (digits) of a responsive display ad unit */
  every:1,            /* 1 = after every finished quiz */
  ageTreatment:2      /* 2 = treat users as teens: no personalised ads. 1 = under 13. 0 = none */
 },
 enabled:true,
 testMode:true,
 interstitialId:"ca-app-pub-3940256099942544/1033173712",   /* Google test interstitial */
 skipFirst:1,        /* no ad after the very first quiz */
 every:2,            /* then one ad every 2 finished quizzes */
 minGapSec:180,      /* and never closer together than 3 minutes */
 childDirected:true, /* students may be under 18: no personalised ads, family-safe content (earns less) */
 maxRating:"G"
};
