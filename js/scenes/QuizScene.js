import { quizService } from "../services/quizService.js";
import { router } from "../router.js";
import { gameState } from "../state/gameState.js";

export default async function QuizScene(app) {
  app.innerHTML = "<div>Loading quiz...</div>";

  const questions = await quizService.getQuestions();
  if (questions.length === 0) {
    app.innerHTML = "No questions!";
    return;
  }

  // random 1 câu
  const q = questions[Math.floor(Math.random() * questions.length)];

  const box = document.createElement("div");
  box.className = "quiz-box";

  const title = document.createElement("h3");
  title.textContent = q.question;
  box.appendChild(title);

  if (q.img) {
    const img = document.createElement("img");
    img.src = q.img;
    box.appendChild(img);
  }

  // MULTIPLE CHOICE
  if (q.typeQuestion === 100) {
    q.answers.forEach((ans, i) => {
      const btn = document.createElement("button");
      btn.textContent = ans;

      btn.onclick = () => {
        if (i === q.correctIndex) {
          router.go("game");
        } else {
          gameState.hearts--;
          router.go("game");
        }
      };

      box.appendChild(btn);
    });
  }

  app.innerHTML = "";
  app.appendChild(box);
}
