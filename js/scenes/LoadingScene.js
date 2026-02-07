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
    // 1️⃣ gọi API
    const allQuestions = await quizService.getQuestions();

    // 2️⃣ lấy 7 câu đầu
    const selectedQuestions = allQuestions.slice(0, 7);

    // 3️⃣ lưu vào gameState
    gameState.questions = selectedQuestions;

    // reset trạng thái khác nếu cần
    gameState.hearts = 3;

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
