import { router } from "../router.js";
import { gameState } from "../state/gameState.js";

export default function StartScene(app) {
  const div = document.createElement("div");
  div.innerHTML = `
    <h1>🐶 Maze Quiz Game</h1>
    <button id="startBtn">Start Game</button>
  `;

  gameState.map = [];
  gameState.hearts = 3;
  div.querySelector("#startBtn").onclick = () => {
    router.go("game");
  };

  app.appendChild(div);
}
