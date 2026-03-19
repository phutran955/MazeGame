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
      const loadingText = div.querySelector("#loadingText");

      loadingText.textContent = "📡 Fetching quiz data...";
      const allQuestions = await quizService.getQuestions();

      if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
        throw new Error("Quiz data empty or invalid");
      }

      gameState.difficulty = allQuestions[0].status;

      gameState.questions = allQuestions
        .filter(q => q.status === gameState.difficulty)
        .slice(0, 7);

      loadingText.textContent = "🖼️ Loading assets...";
      await preloadAssets();

      // Cho loading hiện tối thiểu 500ms
      setTimeout(() => {
        router.navigate(GameScene);
      }, 500);

    } catch (err) {
      console.error(err);

      div.classList.add("error");

      div.querySelector("#loadingText").textContent =
        "❌ Failed to load questions";
    }
  })();

  function preloadAssets() {
    const images = [
      "/assets/bg/1.png",
      "/assets/bg/7.png",
      "/assets/bg/8.png",
      "/assets/bg/9.png",
      "/assets/bg/Quiz_BG.png",
      "/assets/bg/result_BG.png",
      "/assets/button/home_Button.png",
      "/assets/button/mute_Button.png",
      "/assets/button/replay_Button.png",
      "/assets/button/unmute_Button.png",
      "/assets/enemy_advanced/Idle.png",
      "/assets/enemy_basic/idle.png",
      "/assets/enemy_level/Idle.png",
      "/assets/goal/2.png",
      "/assets/player/idle.png",
      "/assets/player/run.png",
      "/assets/rock/1.png",
      "/assets/rock/2.png",
      "/assets/rock/3.png",
      "/assets/sheep/1.png",
      "/assets/tree/1.png",
      "/assets/tree/2.png",
      "/assets/tree/3.png"
    ];

    const sounds = [
      "/assets/sound/mazebackground.mp3",
      "/assets/sound/mazecorrect.mp3",
      "/assets/sound/mazelose.mp3",
      "/assets/sound/mazerun.mp3",
      "/assets/sound/mazewin.mp3"
    ];

    const promises = [];

    // preload images
    images.forEach(src => {
      promises.push(new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      }));
    });

    // preload sounds
    sounds.forEach(src => {
      promises.push(new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.src = src;
        audio.oncanplaythrough = resolve;
        audio.onerror = reject;
      }));
    });

    return Promise.all(promises);
  }

  return div;
}
