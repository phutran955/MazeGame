import { gameState } from "../state/gameState.js";

const TILE = {
  EMPTY: 0,
  TREE: 1,
  ROCK: 2,
  GOAL: 3,
  BEAR: 4,
  SHEEP: 5 
};

const MAPS_BY_DIFFICULTY = {
  basic: [
    [
      [0,0,4,1,0,2,0,4,0],
      [1,1,0,1,0,1,0,1,0],
      [0,0,0,0,0,1,0,0,0],
      [0,1,1,1,0,0,0,1,0],
      [0,0,4,0,0,1,0,0,0],
      [1,0,1,1,0,1,1,1,0],
      [0,0,0,0,0,0,4,0,0],
      [0,1,1,1,1,0,1,1,0],
      [0,0,0,0,0,0,0,0,3],
    ]
  ],

  level: [
    [
      [0,4,0,2,0,4,0,2,0],
      [1,1,0,1,0,1,4,1,0],
      [0,0,0,0,2,1,0,0,0],
      [0,1,1,1,0,0,0,1,0],
      [4,0,4,0,0,1,0,4,0],
      [1,0,1,1,2,1,1,1,0],
      [0,0,0,0,0,0,4,0,0],
      [0,1,1,1,1,0,1,1,0],
      [0,0,0,0,0,0,0,0,3],
    ]
  ],

  advanced: [
    [
      [0,0,2,4,1,2,4,1,0],
      [1,0,4,1,2,1,4,1,0],
      [0,2,0,4,0,1,2,0,0],
      [4,1,1,1,0,4,0,1,0],
      [0,0,4,0,2,1,0,4,0],
      [1,2,1,1,4,1,1,1,0],
      [0,0,0,2,0,4,4,0,0],
      [0,1,1,1,1,2,1,1,0],
      [0,0,0,0,4,0,0,0,3],
    ]
  ]
};


export function generateValidMapRandom() {
  const difficulty = gameState.difficulty;
  const maps = MAPS_BY_DIFFICULTY[difficulty];

  const rawMap =
    maps[Math.floor(Math.random() * maps.length)];

  const map = rawMap.map(row => [...row]);

  const rows = map.length;
  const cols = map[0].length;

  const start = { x: 0, y: 0 };

  /* ================= BFS: Tìm vùng đi được ================= */

  const visited = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );

  const queue = [];

  const blocked = [
    TILE.TREE,
    TILE.ROCK,
    TILE.SHEEP
  ];

  queue.push([start.x, start.y]);
  visited[start.y][start.x] = true;

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];

  while (queue.length) {
    const [x, y] = queue.shift();

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx < 0 || ny < 0 ||
        nx >= cols || ny >= rows
      ) continue;

      if (visited[ny][nx]) continue;

      if (blocked.includes(map[ny][nx]))
        continue;

      visited[ny][nx] = true;
      queue.push([nx, ny]);
    }
  }

  /* ================= Tạo Enemy ================= */

  const enemies = [];
  const questions = gameState.questions || [];

  let qIndex = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      // Chỉ xử lý BEAR
      if (map[y][x] !== TILE.BEAR) continue;

      // ❌ Không tới được → xóa
      if (!visited[y][x]) {
        map[y][x] = TILE.EMPTY;
        continue;
      }

      // ❌ Hết câu hỏi → thành vật cản
      if (qIndex >= questions.length) {
        map[y][x] = TILE.SHEEP; // hoặc EMPTY
        continue;
      }

      // ✅ Bear hợp lệ
      enemies.push({
        x,
        y,
        alive: true,
        questionIndex: qIndex
      });

      qIndex++;
    }
  }

  return {
    map,
    enemies,
    start,
    goal: {
      x: cols - 1,
      y: rows - 1
    }
  };
}


export { TILE };