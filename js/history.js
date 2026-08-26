// History page logic: lists every saved attempt for the logged-in account,
// each expandable into a full right/wrong answer review.
(function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function codeBlock(example) {
    if (!example) return "";
    return "<pre class=\"code-block\"><code>" + escapeHtml(example) + "</code></pre>";
  }

  function formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) +
      " " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  // Question ids look like "html:easy:3" — look the question back up from
  // QUESTIONS instead of storing full question text in every history entry.
  function lookupQuestion(id) {
    const parts = id.split(":");
    const topic = parts[0], level = parts[1], idx = parseInt(parts[2], 10);
    const bank = QUESTIONS[topic] && QUESTIONS[topic][level];
    const q = bank && bank[idx];
    return q ? Object.assign({ level: level }, q) : null;
  }

  const topicLabels = { html: "HTML", css: "CSS" };
  const container = document.getElementById("history-content");

  function renderHistory() {
    const account = Auth.getCurrentAccount();

    if (!account) {
      container.innerHTML = "<div class=\"card\"><p>Please log in on the home page to view your history. <a href=\"index.html\">Go back home</a>.</p></div>";
      return;
    }

    document.getElementById("history-player").textContent = account.name;

    const history = Auth.getHistory(account.username);

    if (!history.length) {
      container.innerHTML = "<div class=\"card\"><p>No quiz attempts yet. <a href=\"index.html\">Take a quiz</a> to start building your history.</p></div>";
      return;
    }

    let html = "<div class=\"history-list\">";
    history.forEach(function (attempt) {
      const correctCount = attempt.answers.filter(function (a) { return a.correct; }).length;
      html += "<details class=\"card history-entry\">";
      html += "<summary class=\"history-summary\">";
      html += "<span class=\"history-topic\">" + topicLabels[attempt.topic] +
        (attempt.mode === "missed" ? " &middot; Missed Review" : "") + "</span>";
      html += "<span class=\"history-date\">" + formatDate(attempt.timestamp) + "</span>";
      html += "<span class=\"history-score\">" + attempt.score + " / " + attempt.maxScore + " pts &middot; " +
        correctCount + "/" + attempt.answers.length + " correct</span>";
      html += "</summary>";
      html += "<div class=\"review-list\">";
      attempt.answers.forEach(function (ans, i) {
        const q = lookupQuestion(ans.id);
        if (!q) return;
        html += "<div class=\"review-item\">";
        html += "<div class=\"review-item-head\">";
        html += "<span>Q" + (i + 1) + " &middot; <span class=\"badge " + q.level + "\">" + q.level + "</span></span>";
        html += "<span class=\"review-status " + (ans.correct ? "ok" : "bad") + "\">" + (ans.correct ? "Correct" : "Incorrect") + "</span>";
        html += "</div>";
        html += "<p class=\"q-text\" style=\"font-size:1rem;margin-bottom:0.4rem;\">" + escapeHtml(q.q) + "</p>";
        html += "<div class=\"review-answer\">Your answer: <strong>" + escapeHtml(q.choices[ans.chosenIndex]) + "</strong></div>";
        if (!ans.correct) {
          html += "<div class=\"review-answer\">Correct answer: <strong>" + escapeHtml(q.choices[q.answer]) + "</strong></div>";
        }
        html += "<div class=\"review-explanation\">" + escapeHtml(q.explanation) + "</div>";
        html += codeBlock(q.code || q.example);
        html += "</div>";
      });
      html += "</div>";
      html += "</details>";
    });
    html += "</div>";

    container.innerHTML = html;
  }

  Auth.ready.then(function () {
    renderHistory();
    Auth.onCloudSync(renderHistory);
  });
})();
