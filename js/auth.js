// Login session + per-account score tracking, checked against the static ACCOUNTS list.
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

  function saveProgress(data) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
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
    saveProgress(data);
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
    saveProgress(data);
  }

  function resetProgress(username) {
    const data = loadProgress();
    data[username] = { html: blankTopicProgress(), css: blankTopicProgress() };
    saveProgress(data);
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
    login: login,
    logout: logout,
    getCurrentAccount: getCurrentAccount,
    getTopicProgress: getTopicProgress,
    recordScore: recordScore,
    recordAnswer: recordAnswer,
    resetProgress: resetProgress,
    totalPoints: totalPoints,
    leaderboard: leaderboard
  };
})();
