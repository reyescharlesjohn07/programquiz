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

  const account = Auth.getCurrentAccount();
  if (!account) {
    document.getElementById("question-card").innerHTML =
      "<p>Please log in on the home page before starting a quiz. <a href=\"index.html\">Go back home</a>.</p>";
    return;
  }
  const player = account.name;

  document.getElementById("quiz-title").textContent = topicLabels[topic] + " Quiz";
  document.getElementById("quiz-player").textContent = "Playing as " + player;

  // Build a flat, ordered list of questions tagged with their difficulty.
  const items = [];
  ROUND_ORDER.forEach(function (level) {
    QUESTIONS[topic][level].forEach(function (q) {
      items.push(Object.assign({ level: level }, q));
    });
  });

  const maxScore = items.reduce((sum, item) => sum + POINTS[item.level], 0);

  let index = 0;
  let score = 0;
  const answers = []; // { chosenIndex, correct }
  const roundStats = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
  ROUND_ORDER.forEach(function (level) {
    roundStats[level].total = QUESTIONS[topic][level].length;
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

  function renderQuestion() {
    const item = items[index];
    progressBar.style.width = ((index / items.length) * 100) + "%";
    roundLabel.innerHTML = "Round: <span class=\"badge " + item.level + "\">" +
      item.level.charAt(0).toUpperCase() + item.level.slice(1) + "</span> &middot; worth " +
      POINTS[item.level] + " pt" + (POINTS[item.level] > 1 ? "s" : "");

    let html = "";
    html += "<div class=\"q-meta\"><span class=\"q-count\">Question " + (index + 1) + " of " + items.length + "</span></div>";
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
  }

  function handleAnswer(chosenIndex) {
    const item = items[index];
    const correct = chosenIndex === item.answer;
    answers.push({ chosenIndex: chosenIndex, correct: correct });

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

  function saveProgress() {
    return Auth.recordScore(account.username, topic, score);
  }

  function showResults() {
    progressBar.style.width = "100%";
    quizMain.classList.add("hidden");
    progressWrap.classList.add("hidden");
    roundLabel.classList.add("hidden");
    resultsEl.classList.remove("hidden");

    const isNewBest = saveProgress();
    const percent = Math.round((score / maxScore) * 100);

    let html = "<div class=\"results-summary\">";
    html += "<div>" + escapeHtml(player) + "'s " + topicLabels[topic] + " Quiz &mdash; Complete</div>";
    html += "<div class=\"results-score\">" + score + " <span>/ " + maxScore + " pts (" + percent + "%)</span></div>";
    html += "<div class=\"results-breakdown\">";
    ROUND_ORDER.forEach(function (level) {
      const stat = roundStats[level];
      html += "<div class=\"score-item\"><span class=\"badge " + level + "\">" + level.charAt(0).toUpperCase() + level.slice(1) + "</span> " +
        stat.correct + " / " + stat.total + " correct</div>";
    });
    html += "</div>";
    if (isNewBest) html += "<div class=\"new-best\">New personal best!</div>";
    html += "<div class=\"results-actions\">";
    html += "<a class=\"btn btn-start\" href=\"quiz.html?topic=" + topic + "\">Retry Quiz</a>";
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
})();
