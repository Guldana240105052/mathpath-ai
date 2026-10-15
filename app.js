const levelButtons = [...document.querySelectorAll(".level-card")];
const problemTitle = document.querySelector("#problemTitle");
const problemText = document.querySelector("#problemText");
const levelBadge = document.querySelector("#levelBadge");
const answerInput = document.querySelector("#answerInput");
const statusBox = document.querySelector("#status");
const responseBox = document.querySelector("#responseBox");
const responseTitle = document.querySelector("#responseTitle");
const responseText = document.querySelector("#responseText");
const newBtn = document.querySelector("#newBtn");
const hintBtn = document.querySelector("#hintBtn");
const solutionBtn = document.querySelector("#solutionBtn");
const checkBtn = document.querySelector("#checkBtn");

let currentLevel = "foundation";
let currentProblem = "";
let busy = false;

const levelNames = { foundation: "FOUNDATION", standard: "STANDARD", advanced: "ADVANCED" };

function showStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.classList.toggle("error", isError);
}
function showResponse(title, text) {
  responseTitle.textContent = title || "Your guidance";
  responseText.textContent = text || "No explanation was returned. Try again.";
  responseBox.classList.remove("hidden");
}
function setBusy(value) {
  busy = value;
  [newBtn, hintBtn, solutionBtn, checkBtn, ...levelButtons].forEach(button => button.disabled = value);
}
function selectLevel(level) {
  currentLevel = level;
  levelButtons.forEach(button => {
    const selected = button.dataset.level === level;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  levelBadge.textContent = levelNames[level];
  responseBox.classList.add("hidden");
  showStatus("");
}
levelButtons.forEach(button => button.addEventListener("click", () => selectLevel(button.dataset.level)));

async function requestAI(action, task = "") {
  if (busy) return;
  setBusy(true);
  showStatus("Your AI tutor is preparing guidance…");
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: "linear equations", level: currentLevel, task, action })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    if (data.problem) {
      currentProblem = data.problem;
      problemText.textContent = data.problem;
      problemTitle.textContent = data.title || "Your challenge";
      answerInput.value = "";
    }
    if (action === "hint") {
      showResponse("A hint for you", data.hint || data.feedback || data.solution);
    } else if (action === "solution") {
      showResponse("Step-by-step solution", `${data.solution || data.feedback || ""}${data.answer ? `\n\nAnswer: ${data.answer}` : ""}`);
    } else if (action === "check") {
      showResponse("Answer feedback", data.feedback || data.solution || "Check complete.");
    } else {
      showResponse("Your learning path", `${data.feedback || "A new problem is ready."}${data.hint ? `\n\nHint: ${data.hint}` : ""}`);
    }
    showStatus("Ready — keep going!");
  } catch (error) {
    showStatus(error.message || "Could not connect. Please try again.", true);
  } finally {
    setBusy(false);
  }
}

newBtn.addEventListener("click", () => requestAI("generate"));
hintBtn.addEventListener("click", () => {
  if (!currentProblem) return showStatus("Generate a problem first.", true);
  requestAI("hint", currentProblem);
});
solutionBtn.addEventListener("click", () => {
  if (!currentProblem) return showStatus("Generate a problem first.", true);
  requestAI("solution", currentProblem);
});
checkBtn.addEventListener("click", () => {
  if (!currentProblem) return showStatus("Generate a problem first.", true);
  if (!answerInput.value.trim()) return showStatus("Type an answer or some working first.", true);
  requestAI("check", `Problem: ${currentProblem}\nLearner's answer: ${answerInput.value.trim()}`);
});
answerInput.addEventListener("keydown", event => {
  if (event.key === "Enter") checkBtn.click();
});
