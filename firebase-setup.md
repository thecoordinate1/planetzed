# Online leaderboard (Firebase): optional

Without this, PlanetZed keeps a leaderboard on each phone. With it, everyone shares two
leaderboards: **🌍 Africa** (top 20 overall) and **your country** (top 20 from your country).
Only Quick Play scores are listed. It takes about 10 minutes and is free to start.

## 1. Create the database

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with a Google account.
2. **Create a project** (any name, e.g. `planetzed`). You can turn Google Analytics off.
3. In the left menu open **Build > Realtime Database**, then **Create Database**.
4. Location: choose **Belgium (europe-west1)**, the closest to Africa. Start in **locked mode**.

## 2. Paste the security rules

Open the **Rules** tab, replace everything with the rules below, and click **Publish**.

```json
{
  "rules": {
    "scores": {
      ".read": true,
      ".indexOn": ["score"],
      "$id": {
        ".write": "!data.exists() || (newData.exists() && newData.child('score').val() > data.child('score').val() && newData.child('name').val() === data.child('name').val())",
        ".validate": "$id.matches(/^r[0-9]+$/) && newData.hasChildren(['name', 'cc', 'score', 'date'])",
        "name": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 24" },
        "cc": { ".validate": "newData.isString() && (newData.val() === '' || newData.val().matches(/^[A-Z][A-Z]$/))" },
        "score": { ".validate": "newData.isNumber() && newData.val() > 0 && newData.val() <= 1000000" },
        "date": { ".validate": "newData.isNumber()" },
        "$other": { ".validate": false }
      }
    },
    "countries": {
      "$cc": {
        ".read": "$cc.matches(/^[A-Z][A-Z]$/)",
        ".indexOn": ["score"],
        "$id": {
          ".write": "!data.exists() || (newData.exists() && newData.child('score').val() > data.child('score').val() && newData.child('name').val() === data.child('name').val())",
          ".validate": "$id.matches(/^r[0-9]+$/) && newData.hasChildren(['name', 'cc', 'score', 'date'])",
          "name": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 24" },
          "cc": { ".validate": "newData.val() === $cc" },
          "score": { ".validate": "newData.isNumber() && newData.val() > 0 && newData.val() <= 1000000" },
          "date": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    }
  }
}
```

What the rules do:
- **New scores:** anyone can add one.
- **Existing scores:** a score can only go up, under the same name. Nobody can delete or rename other players' scores.
- **Country lists:** only accept scores from that country.
- **Size limits:** names and scores are capped.

## 3. Connect the game

1. On the **Data** tab, copy the database address at the top. It looks like
   `https://planetzed-xxxxx-default-rtdb.europe-west1.firebasedatabase.app`.
2. In `www/index.html`, find `FIREBASE_DB_URL` (in the "SETTINGS YOU MAY CHANGE" section) and paste the
   address between the quotes, **without** a slash at the end:
   ```js
   const FIREBASE_DB_URL = 'https://planetzed-xxxxx-default-rtdb.europe-west1.firebasedatabase.app';
   ```
3. Push the change to GitHub. A few minutes later the Leaderboard screen shows the two online tabs.

## Good to know

- **Cost:** the free (Spark) plan includes 1 GB of storage and 10 GB of downloads a month. Opening the
  leaderboard downloads about 2 KB, so that covers millions of views a month. If the game outgrows it,
  switch to the pay-as-you-go (Blaze) plan and set a budget alert in Google Cloud.
- **Cheating:** the game sends scores straight from the phone, so a determined person could post a fake
  score. To remove one, open the **Data** tab and delete the entry under both `scores` and
  `countries/<country code>`. Making scores cheat-proof needs a small server that checks each game,
  which is a good next step if the leaderboard becomes popular.
- **Offline:** if the database can't be reached, the game quietly shows the scores saved on the phone.
