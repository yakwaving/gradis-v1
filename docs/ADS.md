# Ads on the website (Google AdSense)

After every finished quiz, the results screen shows one "Advertisement" box under the score. Study mode shows none.
If the person is offline, uses an ad blocker, or Google has no ad to give, the box simply doesn't appear.
It is OFF until you add your ids in `js/ads-config.js`.

## What AdSense needs (check Google's current rules before applying)
- **Your own domain** (for example gradis.app or gradis.com). Free addresses like `*.workers.dev` or `*.github.io` are generally not accepted. Buy a domain, then attach it to your Cloudflare site.
- A **privacy policy** page that mentions Google ads and cookies, plus About and Contact pages.
- Enough **real content**. A quiz app with few quizzes may be refused at first; more subjects and quizzes help.
- You must be 18+, or have a parent/guardian own the AdSense account.
- Never click your own ads or ask others to.

## Going live
1. Apply at adsense.google.com with your domain and wait for approval.
2. Create one **Display ad** unit, type "Responsive".
3. In `js/ads-config.js`, under `web`, set `enabled:true`, `client:"ca-pub-…"` (your publisher id) and `slot:"…"` (the ad unit id).
4. Upload `js/ads-config.js`, bump `VERSION` in `sw.js`, and upload that too.
5. In AdSense, turn on the consent message (Privacy & messaging) so visitors from Europe and the UK are asked for consent.

## Students
`ageTreatment:2` tells Google to treat visitors as teens: no personalised ads. That earns less but is the safer default while many users are students. Under-13 audiences have stricter rules (set it to 1). You are responsible for following the laws where your users live.

## Until you have a domain
Nothing is shown and nothing is lost. You can keep building features. Other ad networks accept free addresses but usually pay less and show lower-quality ads, so check them carefully before using one.
