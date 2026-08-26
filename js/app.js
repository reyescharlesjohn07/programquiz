// Home page logic: login form, per-account best scores, and leaderboard.
(function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function firstName(fullName) {
    return String(fullName).trim().split(/\s+/)[0];
  }

  function maxScoreFor(topic) {
    return ROUND_ORDER.reduce(function (sum, level) {
      return sum + QUESTIONS[topic][level].length * POINTS[level];
    }, 0);
  }

  const gate = document.getElementById("auth-gate");
  const appContent = document.getElementById("app-content");

  function renderGate() {
    const account = Auth.getCurrentAccount();

    if (account) {
      gate.innerHTML =
        "<div class=\"login-active\">" +
        "<span>Logged in as <strong>" + escapeHtml(account.name) + "</strong></span>" +
        "<button id=\"logout-btn\" class=\"btn btn-ghost\">Log out</button>" +
        "</div>";
      document.getElementById("logout-btn").addEventListener("click", function () {
        Auth.logout();
        renderGate();
      });
      appContent.classList.remove("hidden");
      renderTopicScores(account.username);
      renderStats(account.username);
    } else {
      appContent.classList.add("hidden");
      gate.innerHTML =
        "<h2>Log in</h2>" +
        "<p class=\"gate-hint\">Use the account your instructor/classmate gave you.</p>" +
        "<form id=\"login-form\" class=\"login-form\">" +
        "<input id=\"login-username\" type=\"text\" placeholder=\"Username\" autocomplete=\"username\">" +
        "<input id=\"login-password\" type=\"password\" placeholder=\"Password\" autocomplete=\"current-password\">" +
        "<button type=\"submit\" class=\"btn btn-start\">Log In</button>" +
        "</form>" +
        "<div id=\"login-error\" class=\"login-error\"></div>";

      document.getElementById("login-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;
        const result = Auth.login(username, password);
        if (!result.ok) {
          document.getElementById("login-error").textContent = result.error;
          return;
        }
        renderGate();
      });
    }

    renderLeaderboard(account ? account.username : null);
  }

  function renderTopicScores(username) {
    document.querySelectorAll("[data-best]").forEach(function (el) {
      const topic = el.getAttribute("data-best");
      const record = Auth.getTopicProgress(username, topic);
      const max = maxScoreFor(topic);
      if (record.attempts > 0) {
        el.innerHTML = "Best score: <strong>" + record.best + " / " + max + " pts</strong>";
      } else {
        el.innerHTML = "Best score: <strong>Not attempted yet</strong> (max " + max + " pts)";
      }
    });

    document.querySelectorAll("[data-missed]").forEach(function (el) {
      const topic = el.getAttribute("data-missed");
      const missedCount = Auth.getTopicProgress(username, topic).missed.length;
      el.innerHTML = missedCount > 0
        ? "<a class=\"missed-link\" href=\"quiz.html?topic=" + topic + "&mode=missed\">Review " + missedCount + " missed question" + (missedCount > 1 ? "s" : "") + "</a>"
        : "";
    });
  }

  function renderStats(username) {
    const totalEl = document.getElementById("stat-total-points");
    const doneEl = document.getElementById("stat-quizzes-done");
    const htmlProgress = Auth.getTopicProgress(username, "html");
    const cssProgress = Auth.getTopicProgress(username, "css");
    if (totalEl) totalEl.textContent = Auth.totalPoints(username);
    if (doneEl) doneEl.textContent = htmlProgress.attempts + cssProgress.attempts;
  }

  function renderLeaderboard(currentUsername) {
    const list = document.getElementById("leaderboard-list");
    const rows = Auth.leaderboard();
    let html = "<div class=\"leaderboard-table\">";
    rows.forEach(function (row, i) {
      const isMe = row.username === currentUsername;
      html += "<div class=\"leaderboard-row" + (isMe ? " is-me" : "") + "\">" +
        "<span class=\"lb-rank\">#" + (i + 1) + "</span>" +
        "<span class=\"lb-name\">" + escapeHtml(firstName(row.name)) + (isMe ? " (you)" : "") + "</span>" +
        "<span class=\"lb-total\">" + row.total + " pts</span>" +
        "<span class=\"lb-detail\">HTML " + row.html + " &middot; CSS " + row.css + "</span>" +
        "</div>";
    });
    html += "</div>";
    list.innerHTML = html;
  }

  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      const account = Auth.getCurrentAccount();
      if (!account) return;
      if (confirm("Reset " + account.name + "'s saved scores? This cannot be undone.")) {
        Auth.resetProgress(account.username);
        renderGate();
      }
    });
  }

  Auth.ready.then(function () {
    renderGate();
    Auth.onCloudSync(renderGate);
  });
})();
