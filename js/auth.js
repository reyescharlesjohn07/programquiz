// Login session + per-account score tracking, checked against the static ACCOUNTS list.
//
// Storage strategy: localStorage is always the fast, synchronous read cache every
// page renders from immediately. When js/firebase-config.js has real credentials,
// this also mirrors every write to a shared Firebase Realtime Database and keeps
// the local cache updated from a live listener — so everyone's points/history sync
// across devices/browsers, not just within one machine. With no config filled in,
// this module behaves exactly like local-only storage (today's behavior).
const Auth = (function () {
  const SESSION_KEY = "programquiz-session";
  const PROGRESS_KEY = "programquiz-progress-v2";

  function findAccount(username) {
    const needle = String(username || "").trim().toLowerCase();
    return ACCOUNTS.find(function (a) { return a.username.toLowerCase() === needle; });
  }

  function login(username, password) {
    const account = findAccount(username);
    if (!account || account.password !== password) {
      return { ok: false, error: "Incorrect username or password." };
    }
    localStorage.setItem(SESSION_KEY, account.username);
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getCurrentAccount() {
    const username = localStorage.getItem(SESSION_KEY);
    return username ? findAccount(username) : null;
  }

  function blankTopicProgress() {
    return { best: 0, attempts: 0, missed: [] };
  }

  function loadProgress() {
    let data;
    try {
      data = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    } catch (e) {
      data = null;
    }
    return data && typeof data === "object" ? data : {};
  }

  // ---------- cloud sync (optional — only active once FIREBASE_CONFIG is real) ----------
  let db = null;
  const syncListeners = [];
  let readyResolve;
  const ready = new Promise(function (resolve) { readyResolve = resolve; });

  const hasRealConfig = typeof FIREBASE_CONFIG !== "undefined" &&
    FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey.indexOf("YOUR_") !== 0;

  if (hasRealConfig && typeof firebase !== "undefined") {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.database();
    db.ref("users").on("value", function (snapshot) {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(snapshot.val() || {}));
      readyResolve();
      syncListeners.forEach(function (fn) { fn(); });
    }, function () {
      // Permission denied or offline — fall back to whatever's cached locally.
      readyResolve();
    });
  } else {
    readyResolve();
  }

  // Call fn to be notified whenever fresh cloud data has been merged into the
  // local cache, so a page can re-render with everyone's latest scores.
  function onCloudSync(fn) {
    syncListeners.push(fn);
  }

  // Saves the whole local blob (unchanged local-only behavior), then — if cloud
  // sync is on — also pushes just this one user's slice up to Firebase, so a
  // stale full local snapshot never overwrites other users' live cloud data.
  function persistUser(username, data) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    if (db) db.ref("users/" + username).set(data[username]);
  }

  function getTopicProgress(username, topic) {
    const data = loadProgress();
    const user = data[username];
    if (!user || !user[topic]) return blankTopicProgress();
    const record = user[topic];
    // Older saved records predate the `missed` list, so default it in.
    return { best: record.best || 0, attempts: record.attempts || 0, missed: record.missed || [] };
  }

  // Records a completed quiz attempt for a topic, keeping the best score seen.
  function recordScore(username, topic, score) {
    const data = loadProgress();
    if (!data[username]) data[username] = { html: blankTopicProgress(), css: blankTopicProgress() };
    const prev = data[username][topic] || blankTopicProgress();
    const isNewBest = score > prev.best;
    data[username][topic] = { best: isNewBest ? score : prev.best, attempts: prev.attempts + 1, missed: prev.missed || [] };
    persistUser(username, data);
    return isNewBest;
  }

  // Tracks a single answered question so it can be retried later: wrong answers
  // join the missed list, right answers (including on a retry) drop off it.
  function recordAnswer(username, topic, questionId, correct) {
    const data = loadProgress();
    if (!data[username]) data[username] = { html: blankTopicProgress(), css: blankTopicProgress() };
    if (!data[username][topic]) data[username][topic] = blankTopicProgress();
    const record = data[username][topic];
    const missed = record.missed || [];
    const idx = missed.indexOf(questionId);
    if (correct) {
      if (idx !== -1) missed.splice(idx, 1);
    } else if (idx === -1) {
      missed.push(questionId);
    }
    record.missed = missed;
    persistUser(username, data);
  }

  function resetProgress(username) {
    const data = loadProgress();
    const existingHistory = (data[username] && data[username].history) || [];
    data[username] = { html: blankTopicProgress(), css: blankTopicProgress(), history: existingHistory };
    persistUser(username, data);
  }

  const MAX_HISTORY = 30;

  // Saves an attempt for the history page — normal quiz, missed-review, or a
  // still-in-progress run (attempt.complete === false). Upserts by attempt.id,
  // so calling this after every single answer just updates the same entry in
  // place instead of creating duplicates. That's what makes a quiz left
  // unfinished (closed tab, clicked Home, browser crash) still show up in
  // history instead of vanishing — only recordScore's best/attempts count
  // requires actually finishing.
  // Only stores { id, chosenIndex, correct } per question — the question text
  // itself is looked up from QUESTIONS at render time, not duplicated here.
  function recordAttempt(username, attempt) {
    const data = loadProgress();
    if (!data[username]) data[username] = { html: blankTopicProgress(), css: blankTopicProgress(), history: [] };
    if (!data[username].history) data[username].history = [];
    const history = data[username].history;
    const idx = history.findIndex(function (a) { return a.id === attempt.id; });
    if (idx !== -1) {
      history[idx] = attempt;
    } else {
      history.unshift(attempt);
      if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
    }
    persistUser(username, data);
  }

  function getHistory(username) {
    const data = loadProgress();
    const user = data[username];
    return (user && user.history) || [];
  }

  function totalPoints(username) {
    return getTopicProgress(username, "html").best + getTopicProgress(username, "css").best;
  }

  function leaderboard() {
    return ACCOUNTS.map(function (a) {
      return {
        username: a.username,
        name: a.name,
        total: totalPoints(a.username),
        html: getTopicProgress(a.username, "html").best,
        css: getTopicProgress(a.username, "css").best
      };
    }).sort(function (a, b) { return b.total - a.total; });
  }

  return {
    ready: ready,
    onCloudSync: onCloudSync,
    login: login,
    logout: logout,
    getCurrentAccount: getCurrentAccount,
    getTopicProgress: getTopicProgress,
    recordScore: recordScore,
    recordAnswer: recordAnswer,
    recordAttempt: recordAttempt,
    getHistory: getHistory,
    resetProgress: resetProgress,
    totalPoints: totalPoints,
    leaderboard: leaderboard
  };
})();
