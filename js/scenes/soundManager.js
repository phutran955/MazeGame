const sounds = {
  move: new Audio("/assets/sound/mazerun.mp3"),
  correct: new Audio("/assets/sound/mazecorrect.mp3"),
  win: new Audio("/assets/sound/mazewin.mp3"),
  lose: new Audio("/assets/sound/mazelose.mp3"),
  bgm: new Audio("/assets/sound/mazebackground.mp3")
};

// Nhạc nền lặp
sounds.bgm.loop = true;
sounds.bgm.volume = 0.1;

export function playSound(name) {
  const sound = sounds[name];
  if (!sound) return;

  sound.currentTime = 0;
  sound.play();

  // 🔥 Nếu là mazerun (move) thì chỉ phát 1 giây
  if (name === "move") {
    setTimeout(() => {
      sound.pause();
      sound.currentTime = 0;
    }, 2000); 
  }
}

export function playBGM() {
  sounds.bgm.play();
}

export function stopBGM() {
  sounds.bgm.pause();
}