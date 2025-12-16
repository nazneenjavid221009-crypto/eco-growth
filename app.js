let qIndex = 0;
let totalScore = 0;

const screens = document.querySelectorAll(".screen");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");

function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* PRODUCT QUESTIONS */
function loadQuestion() {
  const q = evaluationQuestions[qIndex];
  questionEl.textContent = q.q;
  optionsEl.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      totalScore += q.scores[i]; // Accumulate weighted scores
      qIndex++;
      if (qIndex < evaluationQuestions.length) loadQuestion();
      else setTimeout(showEnvironment, 400);
    };
    optionsEl.appendChild(btn);
  });

  progressEl.textContent = `Step ${qIndex + 1} of ${evaluationQuestions.length}`;
}

/* ENVIRONMENT RESULT */
function showEnvironment() {
  showScreen("screen-tree");

  // Maximum possible score
  const maxScore = evaluationQuestions.reduce((sum, q) => sum + Math.max(...q.scores), 0);
  const ecoScore = Math.round((totalScore / maxScore) * 100);

  const plant = document.querySelector(".plant");
  const sun = document.querySelector(".sun");
  const birds = document.querySelector(".birds");

  // Animate environment
  plant.style.height = 20 + ecoScore + "px";
  plant.querySelector("::after")?.remove();

  if (ecoScore >= 30) plant.style.backgroundColor = "#2e7d32";
  if (ecoScore >= 50) sun.style.opacity = 1;
  else sun.style.opacity = 0;
  if (ecoScore >= 80) birds.style.opacity = 1;
  else birds.style.opacity = 0;

  document.getElementById("eco-score").textContent = `Eco Score: ${ecoScore}/100`;
  document.getElementById("recommendation").textContent =
    ecoScore < 60
      ? "Try reusable products and minimal packaging 🌿"
      : "Great eco-friendly choice 🌟";

  setTimeout(() => showScreen("screen-quiz-prompt"), 3500);
}

/* QUIZ */
let quizPool = [];
let quizIndex = 0;
let quizScore = 0;
let timer;
const QUESTION_TIME = 6;

function startQuiz() {
  showScreen("screen-quiz");
  quizPool = shuffle([...quizQuestions]).slice(0, 5);
  quizIndex = 0;
  quizScore = 0;
  loadQuiz();
}

function loadQuiz() {
  if (quizIndex >= quizPool.length) {
    showScreen("screen-quiz-result");
    document.getElementById("final-score").textContent =
      `You scored ${quizScore} / 5 🌍`;
    return;
  }

  const q = quizPool[quizIndex];
  document.getElementById("quiz-question").textContent = q.q;
  const opts = document.getElementById("quiz-options");
  opts.innerHTML = "";

  ["True", "False"].forEach(val => {
    const btn = document.createElement("button");
    btn.textContent = val;
    btn.onclick = () => {
      if ((val === "True") === q.a) quizScore++;
      clearInterval(timer);
      quizIndex++;
      loadQuiz();
    };
    opts.appendChild(btn);
  });

  let timeLeft = QUESTION_TIME;
  document.getElementById("timer").textContent = `⏳ ${timeLeft}`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `⏳ ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      quizIndex++;
      loadQuiz();
    }
  }, 1000);
}

/* RESTART WITHOUT QUIZ */
function restartEco() {
  qIndex = 0;
  totalScore = 0;
  showScreen("screen-questions");
  loadQuestion();
}

function showOutro() {
  showScreen("screen-outro");
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

loadQuestion();
