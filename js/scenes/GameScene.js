import { gameState } from "../state/gameState.js";
import { generateValidMapRandom } from "../services/mapService.js";
import { router } from "../router.js";
import {  SPRITES  } from "../configs/sprites.js";
import StartScene from "./StartScene.js";
import QuizPopup from "../components/QuizPopup.js";
import ResultPopup from "../components/ResultPopup.js";

const TILE = {
  EMPTY: 0,
  TREE: 1,
  ROCK: 2,
  GOAL: 3,
  BEAR: 4
};

const MAP_COLS = 9;
const MAP_ROWS = 9;

const VIEW_COLS = 8;
const VIEW_ROWS = 4;

const HUD_HEIGHT = 64;


export default function GameScene() {
  let isQuizOpen = false;
  let isMoving = false;
  let camera = { x: 0, y: 0 };

  const DESIGN_WIDTH = 1720;
  const DESIGN_HEIGHT = 720;
  const TILE_SIZE = Math.min(
    DESIGN_WIDTH / VIEW_COLS,
    (DESIGN_HEIGHT - HUD_HEIGHT) / VIEW_ROWS
  );

   const difficulty = gameState.difficulty;

  const sprite = SPRITES[difficulty];

  if (!sprite) {
    throw new Error(`❌ Missing SPRITES config for difficulty: ${difficulty}`);
  }

  if (gameState.map.length === 0) {
    const { map, start, enemies } = generateValidMapRandom();
    gameState.map = map;
    gameState.player = start;
    gameState.enemies = enemies;
  }

  document.documentElement.style.setProperty(
    "--tile-size",
    TILE_SIZE + "px"
  );

  /* ================= ROOT ================= */
  const div = document.createElement("div");
  div.id = "game-container";
  div.style.width = "1720px";
  div.style.height = "720px";

  /* ================= HUD ================= */
  const hud = document.createElement("div");
  hud.id = "hud";
  hud.innerHTML = `❤️ ${gameState.hearts}`;

  /* ================= GAME VIEW ================= */
  const gameView = document.createElement("div");
  gameView.id = "game-view";
  gameView.style.width = "100%";
  gameView.style.height = "100%";
  gameView.style.position = "relative";
  gameView.style.touchAction = "none";

  const mapLayer = document.createElement("div");
  mapLayer.id = "map-layer";

  const playerEl = document.createElement("div");
  playerEl.id = "player";
  playerEl.className = "player idle";

  mapLayer.appendChild(playerEl);
  gameView.appendChild(mapLayer);
  div.append(hud, gameView);

  /* ================= HELPERS ================= */
  function setPlayerState(state) {
    playerEl.classList.remove("idle", "run");
    playerEl.classList.add(state);
  }

  function isAdjacent(x, y) {
    const px = gameState.player.x;
    const py = gameState.player.y;

    return (
      (Math.abs(px - x) === 1 && py === y) ||
      (Math.abs(py - y) === 1 && px === x)
    );
  }

  function getEnemyAt(x, y) {
    return gameState.enemies.find(
      e => e.x === x && e.y === y && e.alive
    );
  }

  function doMove(nx, ny) {
    isMoving = true;
    setPlayerState("run");

    playerEl.style.left = nx * TILE_SIZE + "px";
    playerEl.style.top = ny * TILE_SIZE + "px";

    playerEl.dataset.nextX = nx;
    playerEl.dataset.nextY = ny;
  }

  function resetGame() {
    gameState.map = [];
    gameState.enemies = [];

    const HEART_BY_DIFFICULTY = {
      basic: 5,
      level: 3,
      advanced: 2
    };

    gameState.hearts =
      HEART_BY_DIFFICULTY[gameState.difficulty] ?? 3;
  }


  /* ================= CAMERA ================= */

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function updateCamera() {
    const px = gameState.player.x;
    const py = gameState.player.y;

    const targetX = px - Math.floor(VIEW_COLS / 2);
    const targetY = py - Math.floor((VIEW_ROWS - 1) / 2);

    camera.x = clamp(targetX, 0, MAP_COLS - VIEW_COLS);
    camera.y = clamp(targetY, 0, MAP_ROWS - VIEW_ROWS);

    mapLayer.style.transform = `translate(
    ${-camera.x * TILE_SIZE}px,
    ${-camera.y * TILE_SIZE}px
  )`;
  }


  /* ================= MAP ================= */
  function renderMap() {
    mapLayer.innerHTML = "";

    for (let y = 0; y < MAP_ROWS; y++) {
      for (let x = 0; x < MAP_COLS; x++) {

        // BG
        const bg = document.createElement("div");
        bg.className = "tile tile-bg";
        bg.style.backgroundImage = `url(${sprite.tile})`;

        bg.style.left = x * TILE_SIZE + "px";
        bg.style.top = y * TILE_SIZE + "px";
        mapLayer.appendChild(bg);

        // CLICK TILE (LUÔN TẠO)
        const el = document.createElement("div");
        el.className = "tile";
        el.style.left = x * TILE_SIZE + "px";
        el.style.top = y * TILE_SIZE + "px";
        el.dataset.x = x;
        el.dataset.y = y;

        const tile = gameState.map[y][x];

        if (tile === TILE.TREE) {
          el.classList.add("tree", "shake");
          el.style.backgroundImage = `url(${sprite.tree})`;

        }
        if (tile === TILE.ROCK) {
          el.classList.add("rock");
          el.style.backgroundImage = `url(${sprite.rock})`;

        }
        if (tile === TILE.GOAL) {
          el.classList.add("goal", "gold");
        }
        if (tile === TILE.SHEEP) {
          el.classList.add("sheep", "grass");
        }
        const enemy = getEnemyAt(x, y);
        if (enemy) {
          el.classList.add("enemy", "bear");
          el.style.backgroundImage = `url(${sprite.enemy.bear})`;
        }

        // CLICK / TAP
        el.addEventListener("click", () => {
          const tx = Number(el.dataset.x);
          const ty = Number(el.dataset.y);

          // chỉ cho click tile đang nằm trong camera
          if (
            tx < camera.x ||
            ty < camera.y ||
            tx >= camera.x + VIEW_COLS ||
            ty >= camera.y + VIEW_ROWS
          ) return;

          if (!isAdjacent(tx, ty)) return;

          move(tx - gameState.player.x, ty - gameState.player.y);
        });


        if (isAdjacent(x, y)) {
          el.classList.add("can-move");
        }

        mapLayer.appendChild(el);
      }
    }

    mapLayer.appendChild(playerEl);
    mapLayer.style.width = MAP_COLS * TILE_SIZE + "px";
    mapLayer.style.height = MAP_ROWS * TILE_SIZE + "px";
  }

  /* ================= PLAYER ================= */
  function renderPlayer() {
    playerEl.style.left = gameState.player.x * TILE_SIZE + "px";
    playerEl.style.top = gameState.player.y * TILE_SIZE + "px";
  }

  /* ================= MOVE ================= */
  function move(dx, dy) {
    if (isMoving || isQuizOpen) return;

    const nx = gameState.player.x + dx;
    const ny = gameState.player.y + dy;

    if (nx < 0 || ny < 0 || nx >= MAP_COLS || ny >= MAP_ROWS) return;

    const tile = gameState.map[ny][nx];
    if (tile === TILE.TREE ||
      tile === TILE.ROCK ||
      tile === TILE.SHEEP)
      return;

    /* ====== GOAL ====== */
    if (tile === TILE.GOAL) {
      doMove(nx, ny);

      setTimeout(() => {
        ResultPopup({
          type: "win",
          onRestart: () => {
            resetGame();
            router.navigate(GameScene);
          },
          onExit: () => {
            resetGame();
            router.navigate(StartScene);
          }

        });
      }, 300);

      return;
    }

    /* ====== ENEMY ====== */
    const enemy = getEnemyAt(nx, ny);
    if (enemy) {
      isQuizOpen = true;

      const question = gameState.questions[enemy.questionIndex];
      if (!question) {
        console.error("❌ Missing question for enemy:", enemy);
        isQuizOpen = false;
        return;
      }

      QuizPopup({
        question,
        onWin: () => {
          enemy.alive = false;
          gameState.map[ny][nx] = TILE.EMPTY;
          isQuizOpen = false;
          doMove(nx, ny);
        },
        onLose: () => {
          enemy.alive = false;
          gameState.map[ny][nx] = TILE.SHEEP;
          gameState.hearts -= 1;
          hud.innerHTML = `❤️ ${gameState.hearts}`;
          isQuizOpen = false;

          if (gameState.hearts <= 0) {
            ResultPopup({
              type: "lose",
              onRestart: () => {
                resetGame();
                router.navigate(GameScene);
              },
              onExit: () => {
                resetGame();
                router.navigate(StartScene);
              }
            });
            return;
          }

          renderMap();
        }

      });

      return;
    }

    /* ====== MOVE NORMAL ====== */
    doMove(nx, ny);
  }


  playerEl.addEventListener("transitionend", () => {
    if (!isMoving) return;

    gameState.player.x = Number(playerEl.dataset.nextX);
    gameState.player.y = Number(playerEl.dataset.nextY);

    isMoving = false;
    setPlayerState("idle");

    updateCamera();
    renderMap();
  });


  /* ================= KEYBOARD ================= */
  function handleKey(e) {
    switch (e.key) {
      case "ArrowUp":
      case "w":
      case "W":
        move(0, -1);
        break;
      case "ArrowDown":
      case "s":
      case "S":
        move(0, 1);
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        move(-1, 0);
        break;
      case "ArrowRight":
      case "d":
      case "D":
        move(1, 0);
        break;
    }
  }

  window.addEventListener("keydown", handleKey);

  renderMap();
  renderPlayer();
  updateCamera();


  return div;
}
