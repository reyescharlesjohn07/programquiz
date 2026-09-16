// Quiz engine: runs Easy -> Medium -> Hard rounds for the chosen topic.
(function () {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic");
  const topicLabels = { html: "HTML", css: "CSS" };

  if (!topic || !QUESTIONS[topic]) {
    document.getElementById("question-card").innerHTML =
      "<p>Unknown quiz topic. <a href=\"index.html\">Go back home</a>.</p>";
    return;
  }

  document.getElementById("question-card").innerHTML = "<p>Loading&hellip;</p>";

  // Wait for the initial cloud sync (a no-op if Firebase isn't configured) so a
  // missed-questions review always starts from the latest data, even if the
  // wrong answer was recorded on a different device.
  Auth.ready.then(startQuiz);

  function startQuiz() {
  const account = Auth.getCurrentAccount();
  if (!account) {
    document.getElementById("question-card").innerHTML =
      "<p>Please log in on the home page before starting a quiz. <a href=\"index.html\">Go back home</a>.</p>";
    return;
  }
  const player = account.name;
  const isMissedMode = params.get("mode") === "missed";

  // Build a flat, ordered list of every question, tagged with its difficulty
  // and a stable id ("html:easy:3") used to track which ones get missed.
  let items = [];
  ROUND_ORDER.forEach(function (level) {
    QUESTIONS[topic][level].forEach(function (q, i) {
      items.push(Object.assign({ level: level, id: topic + ":" + level + ":" + i }, q));
    });
  });

  if (isMissedMode) {
    const missedIds = Auth.getTopicProgress(account.username, topic).missed;
    items = items.filter(function (item) { return missedIds.indexOf(item.id) !== -1; });
  }

  document.getElementById("quiz-title").textContent =
    topicLabels[topic] + (isMissedMode ? " — Missed Questions Review" : " Quiz");
  document.getElementById("quiz-player").textContent = "Playing as " + player;

  if (isMissedMode && items.length === 0) {
    document.getElementById("question-card").innerHTML =
      "<p>You have no missed " + topicLabels[topic] + " questions right now &mdash; nice work!</p>" +
      "<p><a href=\"index.html\">Back to Home</a> &middot; <a href=\"quiz.html?topic=" + topic + "\">Take the full quiz</a></p>";
    return;
  }

  const maxScore = items.reduce((sum, item) => sum + POINTS[item.level], 0);

  // Identifies this one quiz session so repeated saves (after every answer)
  // update the same history entry instead of creating duplicates — see
  // saveSnapshot() below.
  const attemptId = topic + ":" + (isMissedMode ? "missed" : "normal") + ":" + Date.now();
  const attemptStarted = Date.now();

  let index = 0;
  let score = 0;
  const answers = []; // { chosenIndex, correct }
  const roundStats = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
  items.forEach(function (item) {
    roundStats[item.level].total += 1;
  });

  const questionCard = document.getElementById("question-card");
  const progressBar = document.getElementById("progress-bar");
  const roundLabel = document.getElementById("round-label");
  const scoreEl = document.getElementById("current-score");
  const quizMain = document.getElementById("quiz-main");
  const progressWrap = document.querySelector(".progress-wrap");
  const resultsEl = document.getElementById("results");

  const letters = ["A", "B", "C", "D", "E", "F"];

  // Question/choice/explanation text can itself contain literal tags like "<img>",
  // so it must be escaped before going into innerHTML or the browser will parse it as markup.
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

  // Upserts this session's history entry (same attemptId every call) so
  // progress is saved after every single answer, not just at the very end —
  // that way closing the tab, clicking Home, or the browser crashing mid-quiz
  // never loses what was already answered. Only recordScore (leaderboard
  // best/attempts) still requires finishing the whole quiz.
  function saveSnapshot(complete) {
    if (answers.length === 0) return;
    Auth.recordAttempt(account.username, {
      id: attemptId,
      topic: topic,
      mode: isMissedMode ? "missed" : "normal",
      timestamp: attemptStarted,
      complete: complete,
      totalQuestions: items.length,
      score: score,
      maxScore: maxScore,
      answers: answers.map(function (ans, i) {
        return { id: items[i].id, chosenIndex: ans.chosenIndex, correct: ans.correct };
      })
    });
  }

  function renderQuestion() {
    const item = items[index];
    progressBar.style.width = ((index / items.length) * 100) + "%";
    roundLabel.innerHTML = "Round: <span class=\"badge " + item.level + "\">" +
      item.level.charAt(0).toUpperCase() + item.level.slice(1) + "</span> &middot; worth " +
      POINTS[item.level] + " pt" + (POINTS[item.level] > 1 ? "s" : "");

    let html = "";
    html += "<div class=\"q-meta\"><span class=\"q-count\">Question " + (index + 1) + " of " + items.length + "</span>" +
      "<button type=\"button\" class=\"btn btn-ghost btn-small\" id=\"exit-btn\">Exit &amp; Save</button></div>";
    html += "<p class=\"q-text\">" + escapeHtml(item.q) + "</p>";
    if (item.code) {
      html += codeBlock(item.code);
      html += "<p class=\"code-hint\">Read the code above, then choose the correct answer:</p>";
    }
    html += "<div class=\"choices\" id=\"choices\">";
    item.choices.forEach(function (choice, i) {
      html += "<button class=\"choice\" data-i=\"" + i + "\">" +
        "<span class=\"choice-letter\">" + letters[i] + "</span><span>" + escapeHtml(choice) + "</span></button>";
    });
    html += "</div>";
    html += "<div id=\"feedback-slot\"></div>";

    questionCard.innerHTML = html;

    Array.from(questionCard.querySelectorAll(".choice")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        handleAnswer(parseInt(btn.getAttribute("data-i"), 10));
      });
    });

    document.getElementById("exit-btn").addEventListener("click", function () {
      saveSnapshot(false);
      window.location.href = "index.html";
    });
  }

  function handleAnswer(chosenIndex) {
    const item = items[index];
    const correct = chosenIndex === item.answer;
    answers.push({ chosenIndex: chosenIndex, correct: correct });
    Auth.recordAnswer(account.username, topic, item.id, correct);
    saveSnapshot(false);

    if (correct) {
      score += POINTS[item.level];
      roundStats[item.level].correct += 1;
      scoreEl.textContent = score;
    }

    const buttons = Array.from(questionCard.querySelectorAll(".choice"));
    buttons.forEach(function (btn, i) {
      btn.disabled = true;
      if (i === item.answer) btn.classList.add("correct");
      else if (i === chosenIndex) btn.classList.add("wrong");
      else btn.classList.add("dim");
    });

    const slot = document.getElementById("feedback-slot");
    const isLast = index === items.length - 1;
    slot.innerHTML =
      "<div class=\"feedback " + (correct ? "is-correct" : "is-wrong") + "\">" +
      "<div class=\"feedback-title\">" + (correct ? "Correct! +" + POINTS[item.level] + " pt" + (POINTS[item.level] > 1 ? "s" : "") : "Not quite.") + "</div>" +
      (correct ? "" : "<div class=\"correct-answer-line\">Correct answer: <strong>" + escapeHtml(item.choices[item.answer]) + "</strong></div>") +
      "<div class=\"feedback-explanation\">" + escapeHtml(item.explanation) + "</div>" +
      codeBlock(item.example) +
      "</div>" +
      "<div class=\"q-footer\"><button class=\"btn btn-start\" id=\"next-btn\">" + (isLast ? "See Results" : "Next Question") + "</button></div>";

    document.getElementById("next-btn").addEventListener("click", function () {
      index += 1;
      if (index >= items.length) {
        showResults();
      } else {
        renderQuestion();
      }
    });
  }

  function showResults() {
    progressBar.style.width = "100%";
    quizMain.classList.add("hidden");
    progressWrap.classList.add("hidden");
    roundLabel.classList.add("hidden");
    resultsEl.classList.remove("hidden");

    const isNewBest = isMissedMode ? false : Auth.recordScore(account.username, topic, score);
    saveSnapshot(true);
    const percent = Math.round((score / maxScore) * 100);

    let html = "<div class=\"results-summary\">";
    html += "<div>" + escapeHtml(player) + "'s " + topicLabels[topic] +
      (isMissedMode ? " Review &mdash; Complete" : " Quiz &mdash; Complete") + "</div>";
    html += "<div class=\"results-score\">" + score + " <span>/ " + maxScore + " pts (" + percent + "%)</span></div>";
    html += "<div class=\"results-breakdown\">";
    ROUND_ORDER.forEach(function (level) {
      const stat = roundStats[level];
      if (stat.total === 0) return;
      html += "<div class=\"score-item\"><span class=\"badge " + level + "\">" + level.charAt(0).toUpperCase() + level.slice(1) + "</span> " +
        stat.correct + " / " + stat.total + " correct</div>";
    });
    html += "</div>";
    if (isMissedMode) {
      html += "<div class=\"new-best\">This was a practice review, so it doesn't count toward your leaderboard score &mdash; only your missed-questions list was updated.</div>";
    } else if (isNewBest) {
      html += "<div class=\"new-best\">New personal best!</div>";
    }
    html += "<div class=\"results-actions\">";
    if (isMissedMode) {
      html += "<a class=\"btn btn-start\" href=\"quiz.html?topic=" + topic + "&mode=missed\">Review Missed Again</a>";
    } else {
      html += "<a class=\"btn btn-start\" href=\"quiz.html?topic=" + topic + "\">Retry Quiz</a>";
    }
    html += "<a class=\"btn btn-ghost\" href=\"history.html\">View History</a>";
    html += "<a class=\"btn btn-ghost\" href=\"index.html\">Back to Home</a>";
    html += "</div></div>";

    html += "<h2>Review your answers</h2><div class=\"review-list\">";
    items.forEach(function (item, i) {
      const ans = answers[i];
      html += "<div class=\"review-item\">";
      html += "<div class=\"review-item-head\">";
      html += "<span>Q" + (i + 1) + " &middot; <span class=\"badge " + item.level + "\">" + item.level + "</span></span>";
      html += "<span class=\"review-status " + (ans.correct ? "ok" : "bad") + "\">" + (ans.correct ? "Correct" : "Incorrect") + "</span>";
      html += "</div>";
      html += "<p class=\"q-text\" style=\"font-size:1rem;margin-bottom:0.4rem;\">" + escapeHtml(item.q) + "</p>";
      html += "<div class=\"review-answer\">Your answer: <strong>" + escapeHtml(item.choices[ans.chosenIndex]) + "</strong></div>";
      if (!ans.correct) {
        html += "<div class=\"review-answer\">Correct answer: <strong>" + escapeHtml(item.choices[item.answer]) + "</strong></div>";
      }
      html += "<div class=\"review-explanation\">" + escapeHtml(item.explanation) + "</div>";
      html += codeBlock(item.code || item.example);
      html += "</div>";
    });
    html += "</div>";

    resultsEl.innerHTML = html;
  }

  renderQuestion();
  }
})();
