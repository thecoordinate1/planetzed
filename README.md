# Zambia Quiz Challenge: Android app and web app

An Android app (Capacitor) wrapping the quiz game, with Google AdMob banner, interstitial
and rewarded ads. It currently uses Google's TEST ads, which are safe to tap.

The same game also runs as a web app (PWA): players open a link, can install it like an app,
and it works without data after the first visit. See section 4.

## 1. Build the APK (no computer setup needed)

You need a free GitHub account.

1. Create a new repository on github.com (private is fine).
2. Upload everything in this folder to it. On a phone browser, use "Add file > Upload files".
   Make sure the hidden `.github` folder is included.
3. Open the **Actions** tab, choose **Build Android APK**, then **Run workflow**.
4. After about 5 to 10 minutes, open the finished run and download **zambia-quiz-apk**
   from the Artifacts section. Unzip it and install `app-debug.apk` on your Android phone
   (allow "install from unknown sources" when asked).

If the build fails, open the failed step in the run and send me the error text.

Prefer a laptop? Install Node 22, Java 21 and Android Studio, then run:

```
npm install
npm run sync
cd android && ./gradlew assembleDebug
```

The APK is created at `android/app/build/outputs/apk/debug/app-debug.apk`.

## 2. Switch to your real ads

1. At admob.google.com, add an app (Android) and create 3 ad units: Banner, Interstitial, Rewarded.
2. Open `admob.config.json` and replace all four values with your App ID and the 3 ad unit IDs.
   Use all of your own IDs, or all test IDs, never a mix. The build checks this for you.
3. Rebuild the APK (step 1).

**Important:** with real IDs, never tap your own ads and don't ask friends to tap them.
This is the most common reason AdMob accounts get banned. Test with Google's test IDs.
To get paid, your AdMob account also needs payment details and identity verification.
Check Google's AdMob support pages that payouts work for Zambia.

## 3. Before publishing on Google Play

- Change the app ID `com.zambiaquiz.game` to your own. It is permanent once published.
  It appears in several files, so ask Claude to change it for you throughout the project.
- Replace the default app icon (you can reuse the web version's icon in `www/icons/`).
- Build a signed release (AAB) instead of the debug APK. Google Play requires it.
- A Google Play developer account costs a one-time $25.

## 4. Web version (PWA)

The web version is the same game from the `www` folder, so any change you make to the game
applies to both. It is tiny, needs no "install from unknown sources", and after the first visit
it opens without data.

**Publish it free on GitHub Pages:**

1. Your repository must be public. (GitHub Pages only works with private repositories on a paid plan.)
2. In the repository, open **Settings > Pages**. Under "Build and deployment", set **Source** to
   **GitHub Actions**. You only do this once.
3. Open the **Actions** tab, choose **Publish web app**, then **Run workflow**. From then on it also
   runs by itself every time you change something.
4. After a minute or two, the game is live at `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.
   The finished run shows the exact link. Share that link.

Want to keep the repository private? Netlify and Cloudflare Pages are free and work with private
repositories: connect your GitHub repository, leave the build command empty and set the output
(publish) folder to `www`. Then delete `.github/workflows/deploy-web.yml`, which you won't need.

**How players install it:**

- **Android:** an **Install the app** button appears under Play. Or use Chrome's menu > **Add to Home screen**.
- **iPhone:** tap **Share**, then **Add to Home Screen**. The game shows this hint on iPhones.

**Good to know:**

- There are no ads in the web version: no banner, and no "Watch an ad to continue" button, so web
  players don't get the extra life. Ads stay in the Android app.
- Players get your changes by themselves. The game refreshes its saved copy in the background,
  so a change shows the next time they open it (allow a few minutes after publishing).
- On the web, "Share my score" adds the game's link, so friends can tap it and play straight away.
- If you set up the online leaderboard, web and Android players share it.

## Where things are

| What | Where |
| --- | --- |
| The game | `www/index.html` |
| Your AdMob IDs | `admob.config.json` |
| Online leaderboard URL | `FIREBASE_DB_URL` near the end of `www/index.html` |
| Cloud build recipe | `.github/workflows/build-apk.yml` |
| Web app name, colours and icons | `www/manifest.webmanifest` and `www/icons/` |
| Offline support for the web app | `www/sw.js` |
| Web publishing recipe | `.github/workflows/deploy-web.yml` |

## How ads behave

- **Banner:** fixed at the bottom of the screen.
- **Rewarded:** the player taps "Watch an ad to continue" and gets +1 life only if they finish it.
- **Interstitial:** shown on every 2nd "Play again", a natural break, never mid-question.
- If no ad is available, the game carries on and never gets stuck.
- **Web version:** no ads at all (see section 4).
