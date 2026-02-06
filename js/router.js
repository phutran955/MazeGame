import StartScene from "./scenes/StartScene.js";
import GameScene from "./scenes/GameScene.js";
import QuizScene from "./scenes/QuizScene.js";

const app = document.getElementById("app");

const scenes = {
  start: StartScene,
  game: GameScene,
  quiz: QuizScene
};

export const router = {
  go(name, data) {
    app.innerHTML = "";
    scenes[name](app, data);
  }
};
