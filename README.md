# PlanetZed: the Africa quiz

A quiz game about Africa, in English and French, made for phones. It runs in the browser as a web app
(PWA): players open a link, can install it like an app, and after the first visit it works without data.

**Play it:** https://thecoordinate1.github.io/planetzed/

## What's in the game

- **210 questions** in 7 categories: Geography, Capitals, History, Football & Sport, Music & Culture,
  Wildlife & Nature, and a **Zambia pack**. Every question is in English and French.
- **Quick Play** mixes the six Africa-wide categories. Players also get their own country's pack
  (Zambians get the Zambia questions). Or tap a category to play just that one.
- **Rules:** 3 lives and 20 seconds per question, getting harder as you go. Fast answers and answer
  streaks (combo ×2, ×3) score more. One 50:50, one +10 s and one Skip per game.
- **Daily Challenge:** the same 10 questions for everyone each day, with a result grid to share on
  WhatsApp and a daily streak. A new one starts at midnight UTC (02:00 in Zambia).
- **Challenge a friend:** sends a link with exactly the same questions and the score to beat. No account
  or server needed.
- **Progress:** levels and titles (Explorer → Griot → PlanetZed Champion), stats and best scores.
- **Leaderboard:** on the phone, or shared online once you set up Firebase (see `firebase-setup.md`).
- **Sound and vibration:** both can be switched off in Settings.
- **Light and offline:** a first visit downloads about 60 KB (compressed), and the game keeps working
  without data after that.

## How players install it

- **Android:** an **Install the app** button appears on the home screen of the game. Or use Chrome's menu > **Add to Home screen**.
- **iPhone:** tap **Share**, then **Add to Home Screen**. The game shows this hint on iPhones.

## Publishing changes

Every push to `main` publishes the `www` folder to GitHub Pages (workflow **Publish web app**). It's live
a minute or two later. Players get the new version by themselves the next time they open the game
(allow a few minutes).

## Add or edit questions

All questions are in `www/questions.js`, one per line:

```js
['geo', 1, ['What is the longest river in Africa?', 'Nile', 'Congo', 'Niger', 'Zambezi'], ['Quel est le plus long fleuve d\'Afrique ?', 'Le Nil', 'Le Congo', 'Le Niger', 'Le Zambèze']],
```

- **Format:** category, difficulty (1 easy, 2 medium, 3 hard), then the English and French versions.
- **Answers:** the **correct answer always comes first**. The game shuffles the answers on screen.
  English and French answers must be in the same order.
- **Length:** keep questions under about 90 characters and answers under about 24, so they fit on small phones.
- **French spacing:** put a normal space before `? ! : ;`. The game handles the rest.
- **Safety net:** a broken line is skipped, not fatal, so a typo won't break the game.
- **New country pack:** use the country's 2-letter code in lowercase as the category, e.g. `ng` for
  Nigeria or `ke` for Kenya. The game adds a tile for it by itself, and players from that country get it
  in Quick Play.

The Daily Challenge only uses the six Africa-wide categories, never the country packs.

## Change the texts or add a language

Every word on screen is in `www/strings.js`, in English and French. Edit them there. Adding another
language (Portuguese, Swahili…) means adding one more block there and translating the questions: ask
Claude to set it up.

## Online leaderboard

See [firebase-setup.md](firebase-setup.md). Until it's set up, each phone keeps its own leaderboard.

## Where things are

| What | Where |
| --- | --- |
| The game (screens, style, logic) | `www/index.html` |
| Questions | `www/questions.js` |
| All texts, English and French, plus the country list | `www/strings.js` |
| Online leaderboard address | `FIREBASE_DB_URL` in `www/index.html` ("SETTINGS YOU MAY CHANGE") |
| Time per question, lives | `TIME`, `LIVES` in the same section |
| App name, colours, home screen shortcuts | `www/manifest.webmanifest` |
| Logo, icons, WhatsApp link preview | `www/icons/` (`logo.svg`, `og-image.jpg`, …) |
| Offline support | `www/sw.js` |
| Web publishing recipe | `.github/workflows/deploy-web.yml` |

## The Android app (for later)

The `android/` folder, `capacitor.config.ts`, `admob.config.json`, `scripts/` and the **Build Android APK**
workflow are from the earlier Android version. They are left as they were, ready for when the mobile app
work starts. The workflow still builds a test APK on every push. It isn't needed for the website, and
you can ignore it.

- **Ads:** they only ever show inside the Android app, using Google AdMob (currently Google's safe test
  ads). There are three kinds:
  - a banner,
  - "Watch an ad to continue (+1 life)",
  - a full-screen ad on every 2nd "Play again".

  The web version has no ads.
- **Real ads:** put your own AdMob IDs in `admob.config.json`. Use all test IDs or all your own, never a
  mix. Never tap your own ads.
- **Before Google Play:**
  - Change the app ID `com.zambiaquiz.game`; it is permanent once published.
  - Use the PlanetZed icon from `www/icons/`.
  - Build a signed release (AAB).
