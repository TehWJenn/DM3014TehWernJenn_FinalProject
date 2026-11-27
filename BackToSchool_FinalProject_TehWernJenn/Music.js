const stageTracks = [
  'assets/leberch-soft-piano-589658.mp3',
  'assets/leberch-soft-piano-soft-piano-music-603947.mp3',
  'assets/leberch-to-the-clouds-soft-piano-614719.mp3'
].map(path => {
  const track = new Audio(path);
  track.loop = true;
  track.preload = 'none';
  track.volume = 0;
  return track;
});

const musicVolume = 0.135;
const musicFadeMs = 900;
let musicStarted = false;
let musicDisabled = false;
let currentTrackIndex = -1;
let playbackAttempt = 0;

const musicButton = document.createElement('button');
musicButton.type = 'button';
musicButton.textContent = 'Enable music';
Object.assign(musicButton.style, {
  position: 'fixed',
  bottom: '12px',
  left: '12px',
  zIndex: '10',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer'
});
// Keep the music button separate from the other controls so that it doesnt interfer with the rest.
for (const eventName of ['pointerdown', 'mousedown', 'mouseup', 'touchstart', 'touchend']) {
  musicButton.addEventListener(eventName, event => event.stopPropagation());
}
musicButton.addEventListener('click', event => {
  event.stopPropagation();
  if (musicButton.textContent === 'Disable music') {
    disableStageMusic();
    return;
  }
  musicDisabled = false;
  startStageMusic(scene, roundIndex);
});
document.body.append(musicButton);

window.addEventListener('DOMContentLoaded', () => {
  startStageMusic(scene, roundIndex);
}, { once: true });

// Retry from a real browser click when autoplay was blocked.
document.addEventListener('click', event => {
  if (event.target !== musicButton && !musicDisabled &&
      musicButton.textContent === 'Enable music') {
    startStageMusic(scene, roundIndex);
  }
}, true);

function trackForScene(sceneName, walkIndex) {
  if (sceneName === 'walk') return walkIndex;
  if (sceneName === 'study2' || sceneName === 'classroom2') return 1;
  if (sceneName === 'study3' || sceneName === 'classroom3') return 2;
  return 0;
}

function playStageTrack(index) {
  currentTrackIndex = index;
  const track = stageTracks[index];
  const attempt = ++playbackAttempt;
  track.muted = false;

  if (stageTracks.every(other => other === track || other.paused || other.volume === 0)) {
    track.volume = musicVolume;
  }

  track.play().then(() => {
    if (attempt === playbackAttempt && !musicDisabled) {
      musicButton.textContent = 'Disable music';
    }
  }).catch(error => {
    if (attempt !== playbackAttempt || musicDisabled) return;
    if (stageTracks.every(other => other.paused)) {
      musicStarted = false;
      musicButton.textContent = 'Enable music';
    }
    if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
      console.warn('Could not play ' + track.src, error);
    }
  });
}

function startStageMusic(sceneName, walkIndex) {
  if (musicDisabled) return;
  const index = trackForScene(sceneName, walkIndex);
  if (musicStarted && currentTrackIndex === index &&
      musicButton.textContent === 'Disable music' && !stageTracks[index].paused) return;

  musicStarted = true;
  playStageTrack(index);
}

function disableStageMusic() {
  musicDisabled = true;
  musicStarted = false;
  currentTrackIndex = -1;
  playbackAttempt++;
  stageTracks.forEach(track => {
    track.muted = true;
    track.pause();
    track.volume = 0;
  });
  musicButton.textContent = 'Enable music';
}

function updateStageMusic(sceneName, walkIndex, elapsedMs) {
  if (!musicStarted) return;

  const index = trackForScene(sceneName, walkIndex);
  if (currentTrackIndex !== index) playStageTrack(index);

  // Keep the previous track audible until the incoming track can play.
  const incoming = stageTracks[index];
  if (incoming.paused || incoming.readyState < 2) return;

  const step = musicVolume * Math.min(elapsedMs, 100) / musicFadeMs;
  stageTracks.forEach((track, trackIndex) => {
    if (trackIndex === index) {
      track.volume = Math.min(musicVolume, track.volume + step);
    } else {
      track.volume = Math.max(0, track.volume - step);
      if (track.volume === 0 && !track.paused) {
        track.pause();
        track.currentTime = 0;
      }
    }
  });
}
