let clickAudio;

export function initSound() {
  clickAudio = new Audio("/sounds/click.mp3");
  clickAudio.volume = 0.2;

  // preload fully
  clickAudio.load();
}

export function playClick() {
  if (!clickAudio) return;

  clickAudio.currentTime = 0;

  const playPromise = clickAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
}
