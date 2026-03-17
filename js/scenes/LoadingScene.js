import { router } from "../router.js";
import { quizService } from "../services/quizService.js";
import { gameState } from "../state/gameState.js";
import GameScene from "./GameScene.js";

export default function LoadingScene() {
  const div = document.createElement("div");
  div.className = "loading-scene";
  div.style.width = "1720px";
  div.style.height = "720px";

  div.innerHTML = `
    <h2>⏳ Loading questions...</h2>
    <p id="loadingText">Fetching quiz data</p>
  `;

  // ✅ Load data sau khi UI đã render
  (async () => {
    try {
      const allQuestions = await quizService.getQuestions();

      if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
        throw new Error("Quiz data empty or invalid");
      }

      gameState.difficulty = allQuestions[0].status;

      gameState.questions = allQuestions
        .filter(q => q.status === gameState.difficulty)
        .slice(0, 7);

      // Cho loading hiện tối thiểu 500ms
      setTimeout(() => {
        router.navigate(GameScene);
      }, 500);

    } catch (err) {
      console.error(err);
      div.querySelector("#loadingText").textContent =
        "❌ Failed to load questions";
    }
  })();

  return div;
}
