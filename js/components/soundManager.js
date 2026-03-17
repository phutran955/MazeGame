const sounds = {
  move: new Audio("/assets/sound/mazerun.mp3"),
  correct: new Audio("/assets/sound/mazecorrect.mp3"),
  win: new Audio("/assets/sound/mazewin.mp3"),
  lose: new Audio("/assets/sound/mazelose.mp3"),
  bgm: new Audio("/assets/sound/mazebackground.mp3")
};

let bgmEnabled = true;

// Nhạc nền lặp
sounds.bgm.loop = true;
sounds.bgm.volume = 0.1;
sounds.correct.volume = 0.3;

export function playSound(name) {
  const sound = sounds[name];
  if (!sound || name === "bgm") return;

  sound.currentTime = 0;
  sound.play();

  if (name === "move") {
    setTimeout(() => {
      sound.pause();
      sound.currentTime = 0;
    }, 2000);
  }
}

export function playBGM() {
  if (!bgmEnabled) return;
  sounds.bgm.play();
}

export function toggleSound() {
  bgmEnabled = !bgmEnabled;

  if (!bgmEnabled) {
    sounds.bgm.pause();
  } else {
    sounds.bgm.play();
  }

  return bgmEnabled;
}

export function stopBGM() {
  sounds.bgm.pause();
}