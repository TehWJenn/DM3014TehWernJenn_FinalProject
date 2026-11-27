
// adding animaiton to the wlakign scene at the top 
let rounds;
let walkingFrames;
let walkingTime = 0;
const walkingFrameCount = 21;
const walkingFrameDuration = 62;
let roundIndex = 0;

const houseX = 168.5;
const schoolX = 984;
const feetY = 694;
const arrivalDistance = 4;
const finalPullMultiplier = 1.25;

let characterX = houseX;
let dragging = false;
let grabOffsetX = 0;
let lastMouseX = 0;
let finished = false;

async function loadWalkScene() {
  const frames = Array.from({ length: walkingFrameCount }, (_, index) =>
    loadImage('assets/walk-frames/frame-' + (index + 1) + '.png')
  );

  [rounds, walkingFrames] = await Promise.all([
    Promise.all([loadWalk1(), loadWalk2(), loadWalk3()]),
    Promise.all(frames)
  ]);
}

function drawWalkScene() {
  const round = rounds[roundIndex];
  const seconds = min(deltaTime, 50) / 1000;

  if (!finished && round.slideBack > 0) {
    // Pull toward the house whether the mouse is held or released.
    if (characterX < schoolX) {
      characterX = max(houseX, characterX - round.slideBack * seconds);
    }
  } else if (dragging && round.speed === Infinity) {
    characterX = constrain(mouseX - grabOffsetX, houseX, schoolX);
  } else if (dragging) {
    // Midwalk catches up to the mouse at a limited speed.
    const targetX = constrain(mouseX - grabOffsetX, houseX, schoolX);
    const step = round.speed * seconds;
    characterX += constrain(targetX - characterX, -step, step);
  }

  image(round.backdrop, 0, 0, width, height);

  const frameIndex = Math.floor(walkingTime / walkingFrameDuration);
  const frame = walkingFrames[frameIndex];
  const animationWidth = width -10 ;
  const animationHeight = height -10;
  const animationX = (width - animationWidth) / 2;
  const animationY = height * 0.07 - 45;
  image(frame, animationX, animationY, animationWidth, animationHeight);
  const loopDuration = walkingFrameDuration * walkingFrames.length;
  walkingTime = (walkingTime + deltaTime) % loopDuration;

  const { x, y, w, h } = round.bounds;
  image(round.sprite, characterX - x - w / 2, feetY - y - h, width, height);

  cursor(!finished && (dragging || overCharacter()) ? 'ew-resize' : ARROW);
}

function pressWalk() {
  if (!finished && overCharacter()) {
    dragging = true;
    grabOffsetX = mouseX - characterX;
    lastMouseX = mouseX;
  }
}

function dragWalk() {
  if (!dragging || rounds[roundIndex].slideBack === 0 || characterX === schoolX) return;

  const pull = (mouseX - lastMouseX) * finalPullMultiplier;
  characterX = constrain(characterX + pull, houseX, schoolX);
  lastMouseX = mouseX;

  if (characterX >= schoolX - arrivalDistance) characterX = schoolX;
}

function releaseWalk(onArrival) {
  if (!dragging) return;
  dragging = false;

  const round = rounds[roundIndex];

  if (round.speed === Infinity) {
    characterX = constrain(mouseX - grabOffsetX, houseX, schoolX);
  } else if (round.slideBack > 0 && characterX < schoolX) {
    const pull = (mouseX - lastMouseX) * finalPullMultiplier;
    characterX = constrain(characterX + pull, houseX, schoolX);
  }

  if (characterX < schoolX - arrivalDistance) return;

  const arrival = roundIndex + 1;
  if (roundIndex < rounds.length - 1) {
    roundIndex++;
    characterX = houseX;
  } else {
    characterX = schoolX;
    finished = true;
  }
  onArrival(arrival);
}

function overCharacter() {
  const { w, h } = rounds[roundIndex].bounds;
  return inside(mouseX, mouseY, {
    x: characterX - w / 2,
    y: feetY - h,
    w,
    h
  });
}
