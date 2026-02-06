const TILE = {
  EMPTY: 0,
  TREE: 1,
  ROCK: 2,
  GOAL: 3,
  BEAR: 4
};

const MAPS = [
  [
    [0,0,4,0,1,0,4,1],
    [0,0,1,0,0,0,1,0],
    [4,1,0,4,0,1,0,0],
    [1,0,0,0,4,0,0,3],
  ],
  [
    [0,0,0,4,1,0,4,1],
    [0,1,0,0,0,1,0,0],
    [4,0,1,4,0,0,1,0],
    [1,0,0,0,4,0,0,3],
  ],
  [
    [0,0,4,0,1,0,0,1],
    [0,1,0,0,0,1,4,0],
    [0,0,1,4,0,0,1,0],
    [1,0,0,0,4,0,0,3],
  ]
];

export function generateValidMapRandom() {
  const rawMap = MAPS[Math.floor(Math.random() * MAPS.length)];

  const map = rawMap.map(row => [...row]);

  return {
    map,
    start: { x: 0, y: 0 },                 // góc trái
    goal: { x: map[0].length - 1, y: map.length - 1 } // góc phải
  };
}

export { TILE };
