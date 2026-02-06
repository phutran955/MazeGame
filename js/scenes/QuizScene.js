import { quizService } from "../services/quizService.js";
import { router } from "../router.js";
import { gameState } from "../state/gameState.js";
import GameScene from "./GameScene.js";
// import GameOverScene from "./GameOverScene.js"; // nếu có

export default async function QuizScene() {
  /* ===== ROOT ===== */
  const root = document.createElement("div");
  root.className = "quiz-scene";
  root.style.width = "1720px";
  root.style.height = "720px";

  root.innerHTML = "<div class='loading'>Loading quiz...</div>";

  /* ===== LOAD QUESTIONS ===== */
  const questions = await quizService.getQuestions();

  if (!questions || questions.length === 0) {
    root.innerHTML = "<p>No questions available</p>";
    return root;
  }

  /* ===== PICK RANDOM QUESTION ===== */
  const q = questions[Math.floor(Math.random() * questions.length)];

  /* ===== QUIZ BOX ===== */
  const box = document.createElement("div");
  box.className = "quiz-box";

  const title = document.createElement("h3");
  title.textContent = q.question;
  box.appendChild(title);

  /* ===== IMAGE ===== */
  if (q.img) {
    const img = document.createElement("img");
    img.src = q.img;
    img.alt = "quiz image";
    box.appendChild(img);
  }

  let answered = false;

  /* ===== MULTIPLE CHOICE ===== */
  if (q.typeQuestion === 100 && Array.isArray(q.answers)) {
    q.answers.forEach((ans, i) => {
      const btn = document.createElement("button");
      btn.className = "quiz-answer";
      btn.textContent = ans;

      btn.onclick = () => {
        if (answered) return;
        answered = true;

        if (i === q.correctIndex) {
          btn.classList.add("correct");
        } else {
          btn.classList.add("wrong");
          gameState.hearts--;
        }

        // delay cho trẻ em thấy đúng / sai
        setTimeout(() => {
          if (gameState.hearts <= 0) {
            // router.navigate(() => GameOverScene());
            router.navigate(() => GameScene()); // tạm quay lại game
          } else {
            router.navigate(() => GameScene());
          }
        }, 800);
      };

      box.appendChild(btn);
    });
  } else {
    const warn = document.createElement("p");
    warn.textContent = "Unsupported question type";
    box.appendChild(warn);
  }

  /* ===== RENDER ===== */
  root.innerHTML = "";
  root.appendChild(box);

  return root; // 🔴 BẮT BUỘC cho router
}
