import { router } from "../router.js";
import { quizService } from "../services/quizService.js";
import { gameState } from "../state/gameState.js";
import GameScene from "./GameScene.js";

export default async function LoadingScene() {
  const div = document.createElement("div");
  div.className = "loading-scene";
  div.style.width = "1720px";
  div.style.height = "720px";

  div.innerHTML = `
    <h2>⏳ Loading questions...</h2>
    <p id="loadingText">Fetching quiz data</p>
  `;

  try {
    const allQuestions = await quizService.getQuestions();

    if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
      throw new Error("Quiz data empty or invalid");
    }

    // 👉 difficulty do API quyết định
    gameState.difficulty = allQuestions[0].status;

    // 👉 lọc câu hỏi theo difficulty đó
    gameState.questions = allQuestions
      .filter(q => q.status === gameState.difficulty)
      .slice(0, 7);

    // 👉 set heart theo difficulty
    const HEART_BY_DIFFICULTY = {
      basic: 5,
      level: 3,
      advanced: 2
    };

    gameState.hearts =
      HEART_BY_DIFFICULTY[gameState.difficulty] ?? 3;



    // 4️⃣ chuyển scene sau 1 nhịp nhỏ (cho mượt)
    setTimeout(() => {
      router.navigate(GameScene);
    }, 500);

  } catch (err) {
    console.error(err);
    div.querySelector("#loadingText").textContent =
      "❌ Failed to load questions";
  }

  return div;
}
