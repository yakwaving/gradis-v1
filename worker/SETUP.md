# Gradis accounts: one-time setup

Everything is already in the project. You only need to create the database and paste its ID once.
(Takes about 10 minutes, all in the Cloudflare dashboard on your phone browser.)

## 1. Create the database
1. Cloudflare dashboard → **Storage & databases** → **D1 SQL database** → **Create database**.
2. Name it `gradis`, create it.
3. Open it. Copy the **Database ID** (a long code like `682f5427-b6ec-4329-a44d-519e727943b0`).


## 2. Create the tables
1. In the database page open the **Console** tab.
2. Paste the whole text of `worker/schema.sql` and press **Execute**.
   If it complains, paste one `CREATE ...;` statement at a time.

## 3. Tell the project the database ID
1. Open `wrangler.jsonc` in Spck.
2. Replace `PUT-YOUR-D1-DATABASE-ID-HERE` with the Database ID you copied.
3. Commit and push. Cloudflare deploys automatically, like before.

Keep the Worker name in `wrangler.jsonc` (`"name": "gradis-v1"`) the same as your existing Worker,
so the address `gradis-v1.yakwaving.workers.dev` does not change.

## 4. Check it works
Open the app. An **account icon** (a person) appears at the top of Home. Tap it and create an account.
If the icon does not appear, the server part is not running yet: check the Cloudflare build log.

## 5. Google sign-in (optional, do it later)
1. console.cloud.google.com → create a project.
2. **APIs & Services → OAuth consent screen**: choose External, app name Gradis, your email, and
   privacy policy link `https://gradis-v1.yakwaving.workers.dev/privacy`. Then **Publish app** (basic sign-in needs no review).
3. **Credentials → Create credentials → OAuth client ID → Web application**.
   Under **Authorized JavaScript origins** add `https://gradis-v1.yakwaving.workers.dev`
   (and your own domain later). No redirect URI is needed.
4. Copy the **Client ID** and paste it into `wrangler.jsonc` as `"GOOGLE_CLIENT_ID": "...apps.googleusercontent.com"`.
5. Commit and push. The "Continue with Google" button now appears.

## When you get your own domain
Add the domain to the Worker in Cloudflare (Settings → Domains), add it to the Google authorised origins, and
nothing else changes: accounts keep working.
