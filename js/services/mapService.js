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
  const enemies = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === TILE.BEAR) {
        enemies.push({
          x,
          y,
          alive: true,
          questionIndex: enemies.length
        });
      }
    }
  }

  return {
    map,
    enemies,
    start: { x: 0, y: 0 },
    goal: { x: map[0].length - 1, y: map.length - 1 }
  };
}

export { TILE };