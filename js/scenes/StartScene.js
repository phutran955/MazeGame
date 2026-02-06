import { router } from "../router.js";
import { gameState } from "../state/gameState.js";
import GameScene from "./GameScene.js";

export default function StartScene() {
  const div = document.createElement("div");
  div.className = "start-scene";
  div.style.width = "1720px";
  div.style.height = "720px";

  div.innerHTML = `
    <h1>🐶 Maze Quiz Game</h1>
    <button id="startBtn">Start Game</button>
  `;

  gameState.map = [];
  gameState.hearts = 3;

  div.querySelector("#startBtn").onclick = () => {
    router.navigate(GameScene);
  };

  return div; 
}
