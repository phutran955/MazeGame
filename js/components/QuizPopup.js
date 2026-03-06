export default function QuizPopup({ question, onWin, onLose }) {
  if (!question) {
    console.error("❌ QuizPopup received invalid question", question);
    return;
  }

  const overlay = document.createElement("div");
  overlay.className = "quiz-overlay";

  let content = "";

  /* ================= MULTIPLE CHOICE ================= */
  if (question.typeQuestion === 100) {
    content = `
      <h3>${question.question}</h3>
      <div class="answers">
        ${question.answers.map((a, i) =>
          `<button data-i="${i}">${a}</button>`
        ).join("")}
      </div>
    `;
  }

  /* ================= FILL BLANK ================= */
  if (question.typeQuestion === 200) {
    content = `
      <h3>${question.question}</h3>
      <div class="fill-blank">
        <span>${question.fill.leftText}</span>
        <input id="fillInput" type="text" />
        <span>${question.fill.rightText}</span>
        <br/>
        <button id="submitFill">OK</button>
      </div>
    `;
  }

  overlay.innerHTML = `
    <div class="quiz-popup">
      ${content}
    </div>
  `;

  /* ================= EVENTS ================= */
  overlay.addEventListener("click", e => {

    /* MULTI CHOICE */
    if (e.target.tagName === "BUTTON" && e.target.dataset.i !== undefined) {
      const i = Number(e.target.dataset.i);
      overlay.remove();
      i === question.correctIndex ? onWin() : onLose();
    }

    /* FILL BLANK */
    if (e.target.id === "submitFill") {
      const value = overlay.querySelector("#fillInput").value.trim();
      overlay.remove();
      value === question.fill.answerText ? onWin() : onLose();
    }
  });

  document.body.appendChild(overlay);
}
