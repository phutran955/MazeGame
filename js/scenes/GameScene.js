import { gameState } from "../state/gameState.js";
import { generateValidMapRandom } from "../services/mapService.js";
import { router } from "../router.js";

const TILE = {
  EMPTY: 0,
  TREE: 1,
  ROCK: 2,
  GOAL: 3,
  BEAR: 4
};

const COLS = 8;
const ROWS = 4;
const HUD_HEIGHT = 64;

export default function GameScene(app) {
  app.innerHTML = "";

const TILE_SIZE = Math.min(
  window.innerWidth / COLS,
  (window.innerHeight - HUD_HEIGHT) / ROWS
);


  if (gameState.map.length === 0) {
    const { map, start } = generateValidMapRandom();
    gameState.map = map;
    gameState.player = start;
  }

  document.documentElement.style.setProperty(
    "--tile-size",
    TILE_SIZE + "px"
  );

  /* ===== DOM ===== */
  const container = document.createElement("div");
  container.id = "game-container";

  const hud = document.createElement("div");
  hud.id = "hud";
  hud.innerHTML = `❤️ ${gameState.hearts}`;

  const gameView = document.createElement("div");
  gameView.id = "game-view";

  const mapLayer = document.createElement("div");
  mapLayer.id = "map-layer";

  const playerEl = document.createElement("div");
  playerEl.id = "player";
  playerEl.className = "player idle";

  let isMoving = false;

  mapLayer.appendChild(playerEl);
  gameView.appendChild(mapLayer);
  container.append(hud, gameView);
  app.appendChild(container);

  /* ===== PLAYER STATE ===== */
  function setPlayerState(state) {
    playerEl.classList.remove("idle", "run");
    playerEl.classList.add(state);
  }

  /* ===== RENDER MAP ===== */
  function renderMap() {
    mapLayer.innerHTML = "";

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const bg = document.createElement("div");
        bg.className = "tile tile-bg";
        bg.style.left = x * TILE_SIZE + "px";
        bg.style.top = y * TILE_SIZE + "px";
        mapLayer.appendChild(bg);

        const tile = gameState.map[y][x];
        if (tile === TILE.EMPTY) continue;

        const el = document.createElement("div");
        el.className = "tile";
        el.style.left = x * TILE_SIZE + "px";
        el.style.top = y * TILE_SIZE + "px";

        if (tile === TILE.TREE) {
          el.classList.add("tree", "shake");
        }
        if (tile === TILE.ROCK) el.textContent = "🪨";
        if (tile === TILE.GOAL) el.textContent = "🍯";
        if (tile === TILE.BEAR) {
          el.classList.add("enemy", "bear");
        }

        mapLayer.appendChild(el);
      }
    }

    mapLayer.appendChild(playerEl);
    mapLayer.style.width = COLS * TILE_SIZE + "px";
    mapLayer.style.height = ROWS * TILE_SIZE + "px";
  }

  /* ===== RENDER PLAYER ===== */
  function renderPlayer() {
    playerEl.style.left = gameState.player.x * TILE_SIZE + "px";
    playerEl.style.top = gameState.player.y * TILE_SIZE + "px";
  }

  /* ===== MOVE ===== */
  function move(dx, dy) {
    if (isMoving) return;

    const fromX = gameState.player.x;
    const fromY = gameState.player.y;
    const nx = fromX + dx;
    const ny = fromY + dy;

    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return;

    const tile = gameState.map[ny][nx];
    if (tile === TILE.TREE || tile === TILE.ROCK) return;

    if (tile === TILE.BEAR) {
      router.go("quiz");
      return;
    }

    isMoving = true;
    setPlayerState("run");

    // Animate tới ô mới (chưa update state)
    playerEl.style.left = nx * TILE_SIZE + "px";
    playerEl.style.top = ny * TILE_SIZE + "px";

    // Lưu vị trí target tạm thời
    playerEl.dataset.nextX = nx;
    playerEl.dataset.nextY = ny;
  }


  playerEl.addEventListener("transitionend", () => {
    if (!isMoving) return;

    gameState.player.x = Number(playerEl.dataset.nextX);
    gameState.player.y = Number(playerEl.dataset.nextY);

    isMoving = false;
    setPlayerState("idle");
  });


  window.onkeydown = (e) => {
    if (e.key === "ArrowUp") move(0, -1);
    if (e.key === "ArrowDown") move(0, 1);
    if (e.key === "ArrowLeft") move(-1, 0);
    if (e.key === "ArrowRight") move(1, 0);
  };

  renderMap();
  renderPlayer();
}
