const QUIZ_SOURCE = "two_truths_and_a_lie.md";
const LEADERBOARD_KEY = "natalieTwoTruthsLeaderboard.v1";
const SCORE_EMAIL = "cartford@hey.com";
const FALLBACK_MARKDOWN = `# Two Truths and a Lie

A Natalie Trivia Game

## Q1
T: Natalie was a Theater Kid
T: Natalie has been to DC
L: Natalie's birthday is May 3rd

## Q2
T: Natalie's Dad is from Iceland
T: Natalie has thrown up in Iceland
L: Natalie's Dad is from Sweden

# Q3
T: Natalie's sisters are all Swedish citizens
T: Natalie speaks French
L: Natalie has thrown up in France

## Q4
T: Natalie has shot a crossbow
T: Natalie has taken shots with NFL players
L: Natalie has shot a gun

## Q5
T: Natalie loves Skrillex
T: Natalie loves Fleet Foxes
L: Natalie loves Mumford & Sons

## Q6
T: Natalie has ingested Potassium permanganate
T: Natalie has ingested Hydrogen Peroxide
L: Natalie has ingested Potassium Nitrate

## Q7
T: Natalie is alergic to mosquito bites
T: Natalie is alergic to kiwi skins
L: Natalie is alergic to latex (condoms lol)

## Q8
T: Natalie has been involved in a threesome
T: Natalie has testified in a domestic dispute
L: Natalie has been charged with lewd behavior on State Park grounds

## Q9
T: Natalie did every NYT crossword in 2024
T: Natalie's Dad took us on a roadtrip to see bigfoot
L: Natalie has seen a ghost

## Q10
T: Happy Birthday Natalie
T: Really Happy Birthday Natalie
L: Happy Birthday not-Natalie`;

const playerForm = document.getElementById("player-form");
const playerNameInput = document.getElementById("player-name");
const startButton = playerForm.querySelector("button");
const quizPanel = document.getElementById("quiz-panel");
const resultPanel = document.getElementById("result-panel");
const questionCounter = document.getElementById("question-counter");
const runningScore = document.getElementById("running-score");
const progressBar = document.getElementById("quiz-progress-bar");
const questionTitle = document.getElementById("question-title");
const optionList = document.getElementById("option-list");
const quizFeedback = document.getElementById("quiz-feedback");
const nextQuestionButton = document.getElementById("next-question");
const resultScore = document.getElementById("result-score");
const resultDetail = document.getElementById("result-detail");
const emailScoreLink = document.getElementById("email-score");
const playAgainButton = document.getElementById("play-again");
const leaderboardList = document.getElementById("leaderboard-list");
const emptyLeaderboard = document.getElementById("empty-leaderboard");
const clearLeaderboardButton = document.getElementById("clear-leaderboard");

let questions = [];
let activeQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let playerName = "";
let answeredCurrentQuestion = false;
let selectedAnswers = [];

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

function parseQuizMarkdown(markdown) {
  const parsedQuestions = [];
  let currentQuestion = null;

  markdown.split(/\r?\n/).forEach((line) => {
    const heading = line.trim().match(/^#+\s*Q(\d+)/i);
    const option = line.trim().match(/^(T|L):\s*(.+)$/i);

    if (heading) {
      if (currentQuestion) {
        parsedQuestions.push(currentQuestion);
      }

      currentQuestion = {
        number: Number(heading[1]),
        options: []
      };
      return;
    }

    if (currentQuestion && option) {
      currentQuestion.options.push({
        text: option[2].trim(),
        isLie: option[1].toUpperCase() === "L"
      });
    }
  });

  if (currentQuestion) {
    parsedQuestions.push(currentQuestion);
  }

  return parsedQuestions
    .filter((question) => (
      question.options.length === 3 &&
      question.options.filter((option) => option.isLie).length === 1
    ))
    .sort((a, b) => a.number - b.number);
}

async function loadQuestions() {
  try {
    const response = await fetch(QUIZ_SOURCE, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Quiz source returned ${response.status}`);
    }

    questions = parseQuizMarkdown(await response.text());
  } catch {
    questions = parseQuizMarkdown(FALLBACK_MARKDOWN);
  }

  if (!questions.length) {
    quizFeedback.textContent = "The quiz could not be loaded.";
    playerForm.querySelector("button").disabled = true;
  }
}

function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

function sortLeaderboard(entries) {
  return entries.sort((a, b) => (
    b.percent - a.percent ||
    b.score - a.score ||
    a.name.localeCompare(b.name)
  ));
}

function renderLeaderboard() {
  const entries = sortLeaderboard(loadLeaderboard());

  leaderboardList.replaceChildren();
  emptyLeaderboard.hidden = entries.length > 0;

  entries.forEach((entry) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const score = document.createElement("span");
    const detail = document.createElement("span");

    name.className = "leaderboard-name";
    score.className = "leaderboard-score";
    detail.className = "leaderboard-detail";
    name.textContent = entry.name;
    score.textContent = `${entry.percent}%`;
    detail.textContent = `${entry.score}/${entry.total} correct`;

    item.append(name, score, detail);
    leaderboardList.append(item);
  });
}

function recordScore() {
  const entries = loadLeaderboard();
  const normalizedName = playerName.trim().toLowerCase();
  const percent = Math.round((score / activeQuestions.length) * 100);
  const existingIndex = entries.findIndex((entry) => entry.normalizedName === normalizedName);
  const nextEntry = {
    name: playerName,
    normalizedName,
    score,
    total: activeQuestions.length,
    percent,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex === -1) {
    entries.push(nextEntry);
  } else {
    const existing = entries[existingIndex];
    const isBetterScore = percent > existing.percent || (
      percent === existing.percent && score > existing.score
    );

    entries[existingIndex] = isBetterScore ? nextEntry : {
      ...existing,
      name: playerName,
      updatedAt: nextEntry.updatedAt
    };
  }

  saveLeaderboard(sortLeaderboard(entries));
  renderLeaderboard();
}

function setActiveView(view) {
  playerForm.hidden = view !== "start";
  quizPanel.hidden = view !== "quiz";
  resultPanel.hidden = view !== "result";
}

function startQuiz(event) {
  event.preventDefault();

  playerName = playerNameInput.value.trim();

  if (!playerName || !questions.length) {
    return;
  }

  activeQuestions = questions.map((question) => ({
    ...question,
    options: shuffle([...question.options])
  }));
  currentQuestionIndex = 0;
  score = 0;
  selectedAnswers = [];

  setActiveView("quiz");
  renderQuestion();
}

function renderQuestion() {
  const question = activeQuestions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;

  answeredCurrentQuestion = false;
  nextQuestionButton.disabled = true;
  nextQuestionButton.textContent = questionNumber === activeQuestions.length ? "See Score" : "Next";
  quizFeedback.textContent = "";
  questionCounter.textContent = `Question ${questionNumber} / ${activeQuestions.length}`;
  runningScore.textContent = `${score} correct`;
  progressBar.style.width = `${((questionNumber - 1) / activeQuestions.length) * 100}%`;
  questionTitle.textContent = "Which one is the lie?";

  optionList.replaceChildren();
  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.type = "button";
    button.textContent = option.text;
    button.addEventListener("click", () => answerQuestion(option, button));
    optionList.append(button);
  });
}

function answerQuestion(option, selectedButton) {
  if (answeredCurrentQuestion) {
    return;
  }

  const question = activeQuestions[currentQuestionIndex];
  const correctAnswer = question.options.find((candidate) => candidate.isLie);
  const isCorrect = option.isLie;

  answeredCurrentQuestion = true;
  nextQuestionButton.disabled = false;
  progressBar.style.width = `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%`;

  selectedAnswers.push({
    questionNumber: question.number,
    selectedAnswer: option.text,
    correctAnswer: correctAnswer.text,
    isCorrect
  });

  if (isCorrect) {
    score += 1;
    selectedButton.classList.add("is-correct");
    quizFeedback.textContent = "Correct. That one was the lie.";
  } else {
    selectedButton.classList.add("is-wrong");
    quizFeedback.textContent = "Nope. The lie is highlighted.";
  }

  runningScore.textContent = `${score} correct`;

  optionList.querySelectorAll(".quiz-option").forEach((button) => {
    button.disabled = true;

    if (question.options.find((candidate) => (
      candidate.text === button.textContent && candidate.isLie
    ))) {
      button.classList.add("is-correct");
    }
  });
}

function buildScoreEmailHref(percent) {
  const subject = `Natalie quiz score: ${playerName} - ${percent}%`;
  const answerLines = selectedAnswers.map((answer) => (
    `Q${answer.questionNumber}: ${answer.isCorrect ? "correct" : "wrong"}\n` +
    `Picked: ${answer.selectedAnswer}\n` +
    `Lie: ${answer.correctAnswer}`
  ));
  const body = [
    `${playerName} finished Natalie's Two Truths and a Lie quiz.`,
    "",
    `Score: ${score}/${activeQuestions.length}`,
    `Percentage: ${percent}%`,
    `Submitted: ${new Date().toLocaleString()}`,
    "",
    "Answers:",
    answerLines.join("\n\n")
  ].join("\n");

  return `mailto:${SCORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function showResults() {
  const percent = Math.round((score / activeQuestions.length) * 100);

  recordScore();
  resultScore.textContent = `${percent}%`;
  resultDetail.textContent = `${playerName}, you got ${score} out of ${activeQuestions.length} correct.`;
  emailScoreLink.href = buildScoreEmailHref(percent);
  setActiveView("result");
}

function goToNextQuestion() {
  if (currentQuestionIndex === activeQuestions.length - 1) {
    showResults();
    return;
  }

  currentQuestionIndex += 1;
  renderQuestion();
}

function resetGame() {
  setActiveView("start");
  playerNameInput.focus();
}

function clearLeaderboard() {
  if (!window.confirm("Clear the leaderboard on this device?")) {
    return;
  }

  localStorage.removeItem(LEADERBOARD_KEY);
  renderLeaderboard();
}

playerForm.addEventListener("submit", startQuiz);
nextQuestionButton.addEventListener("click", goToNextQuestion);
playAgainButton.addEventListener("click", resetGame);
clearLeaderboardButton.addEventListener("click", clearLeaderboard);

startButton.disabled = true;

loadQuestions().then(() => {
  startButton.disabled = !questions.length;
});
renderLeaderboard();
