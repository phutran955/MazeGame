export default function ResultPopup({ type, correct, incorrect, onRestart, onExit }) {
  const overlay = document.createElement("div");
  overlay.className = "result-overlay";

  const isWin = type === "win";

  overlay.innerHTML = `
    <div class="result-popup ${isWin ? "win" : "lose"}">
      <h2>${isWin ? "WINNER" : "LOSER"}</h2>

      <div class="messenger">
      <p>
        ${isWin
      ? "Chúc mừng bạn đã tìm được kho báu"
      : "Hết đường để đi rùi"}
      </p>
      </div>

      <div class="stats">
        <p>✅ <b>${correct ?? 0}</b></p>
        <p>❌ <b>${incorrect ?? 0}</b></p>
      </div>

      <div class="buttons">
        <button class="restartBtn"></button>
        <button class="exitBtn"></button>
      </div>
    </div>
  `;

  overlay.querySelector(".restartBtn").onclick = () => {
    overlay.remove();
    onRestart?.();
  };

  overlay.querySelector(".exitBtn").onclick = () => {
    overlay.remove();
    onExit?.();
  };

  document.body.appendChild(overlay);
}
