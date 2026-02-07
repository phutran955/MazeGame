export default function ResultPopup({ type, onRestart, onExit }) {
    const overlay = document.createElement("div");
    overlay.className = "result-overlay";

    const isWin = type === "win";

    overlay.innerHTML = `
    <div class="result-popup ${isWin ? "win" : "lose"}">
      <h2>${isWin ? "🎉 YOU WIN!" : "💀 GAME OVER"}</h2>
      <p>
        ${isWin
            ? "Bạn đã đến được đích 🎯"
            : "Bạn đã hết tim 😢"}
      </p>

      <div class="buttons">
        <button id="restartBtn">🔄 Chơi lại</button>
        <button id="exitBtn">🚪 Thoát</button>
      </div>
    </div>
  `;

    overlay.querySelector("#restartBtn").onclick = () => {
        overlay.remove();
        onRestart?.();
    };

    overlay.querySelector("#exitBtn").onclick = () => {
        overlay.remove();
        onExit?.();
    };

    document.body.appendChild(overlay);
}
