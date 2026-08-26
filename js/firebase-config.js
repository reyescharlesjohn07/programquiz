// Fill this in with your OWN free Firebase project's config to turn on
// cross-device score syncing for everyone using this site. Until you do,
// the site keeps working exactly as before — scores just stay local to
// each device/browser.
//
// How to get these values (free, no credit card required):
//   1. Go to https://console.firebase.google.com and sign in with any Google account.
//   2. "Add project" -> give it any name -> you can skip Google Analytics -> Create.
//   3. In the left sidebar: Build -> Realtime Database -> "Create Database" ->
//      pick any region -> start in "test mode" (we set proper rules below).
//   4. Click the gear icon (top-left) -> Project settings -> scroll to "Your apps" ->
//      click the </> (Web) icon -> register a nickname -> Firebase shows you a
//      firebaseConfig object. Copy those values into FIREBASE_CONFIG below.
//   5. Back in Realtime Database -> Rules tab -> replace the rules with:
//        {
//          "rules": {
//            "users": { ".read": true, ".write": true }
//          }
//        }
//      Publish. (This makes the scoreboard data publicly readable/writable by
//      anyone with the site open, same trust level as the static passwords in
//      accounts.js — fine for a classroom study tool, not for sensitive data.)
//   6. Save this file and redeploy — every login/quiz/history page will start
//      reading and writing through your shared database automatically.
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
