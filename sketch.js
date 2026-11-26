let intro;
let rounds;
let roundIndex = -1; // -1 means the intro is showing.

const startButton = { x: 348, y: 493, w: 391, h: 180 };
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

async function setup() {
  createCanvas(1123, 794);

  const [introImage, cWalk, happyWalk, dWalk, midWalk, greyWalk, dontWalk] =
    await Promise.all([
      loadImage('assets/intro.png'),
      loadImage('assets/Cwalkschool.png'),
      loadImage('assets/happy walk.png'),
      loadImage('assets/Dwalkschool.png'),
      loadImage('assets/midwalk.png'),
      loadImage('assets/walkschoolbg.png'),
      loadImage('assets/Dontwalk.png')
    ]);

  intro = introImage;

  // Bounds of each visible figure when its PNG is drawn at canvas size.
  // Speed and slideBack are measured in pixels per second.
  rounds = [
    {
      backdrop: cWalk,
      sprite: happyWalk,
      bounds: { x: 296, y: 576, w: 65, h: 118 },
      speed: 700,
      slideBack: 0
    },
    {
      backdrop: dWalk,
      sprite: midWalk,
      bounds: { x: 455, y: 583, w: 45, h: 108 },
      speed: 200,
      slideBack: 0
    },
    {
      backdrop: greyWalk,
      sprite: dontWalk,
      bounds: { x: 579, y: 584, w: 73, h: 105 },
      speed: 170,
      slideBack: 150
    }
  ];
}

function draw() {
  background(220);

  if (!rounds) return;

  if (roundIndex === -1) {
    image(intro, 0, 0, width, height);

    push();
    textFont('Go around the books');
    textStyle(BOLD);
    textSize(100);
    textAlign(CENTER, CENTER);
    fill(0);
    translate(width / 2, height / 3);
    rotate(sin(millis() / 50) * 0.08);
    text('Do it again!', 0, 0);
    pop();

    cursor(inside(mouseX, mouseY, startButton) ? HAND : ARROW);
    return;
  }

  const round = rounds[roundIndex];
  const seconds = min(deltaTime, 50) / 1000;

  if (!finished && round.slideBack > 0) {
    // Pull toward the house whether the mouse is held or released.
    characterX = max(houseX, characterX - round.slideBack * seconds);
  } else if (dragging && round.speed === Infinity) {
    characterX = constrain(mouseX - grabOffsetX, houseX, schoolX);
  } else if (dragging) {
    // Midwalk catches up to the mouse at a limited speed.
    const targetX = constrain(mouseX - grabOffsetX, houseX, schoolX);
    const step = round.speed * seconds;
    characterX += constrain(targetX - characterX, -step, step);
  }

  const { x, y, w, h } = round.bounds;
  image(round.backdrop, 0, 0, width, height);
  image(round.sprite, characterX - x - w / 2, feetY - y - h, width, height);

  cursor(!finished && (dragging || overCharacter()) ? 'ew-resize' : ARROW);
}

function mousePressed() {
  if (!rounds) return;

  if (roundIndex === -1) {
    if (inside(mouseX, mouseY, startButton)) {
      roundIndex = 0;
    }
    return;
  }

  if (!finished && overCharacter()) {
    dragging = true;
    grabOffsetX = mouseX - characterX;
    lastMouseX = mouseX;
  }
}

function mouseDragged() {
  if (!dragging || rounds[roundIndex].slideBack === 0) return;

  const pull = (mouseX - lastMouseX) * finalPullMultiplier;
  characterX = constrain(characterX + pull, houseX, schoolX);
  lastMouseX = mouseX;
}

function mouseReleased() {
  if (!dragging) return;
  dragging = false;

  const round = rounds[roundIndex];

  if (round.speed === Infinity) {
    characterX = constrain(mouseX - grabOffsetX, houseX, schoolX);
  } else if (round.slideBack > 0) {
    const pull = (mouseX - lastMouseX) * finalPullMultiplier;
    characterX = constrain(characterX + pull, houseX, schoolX);
  }

  if (characterX < schoolX - arrivalDistance) return;

  if (roundIndex < rounds.length - 1) {
    roundIndex++;
    characterX = houseX;
  } else {
    characterX = schoolX;
    finished = true;
  }
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

function inside(x, y, box) {
  return x >= box.x && x <= box.x + box.w &&
         y >= box.y && y <= box.y + box.h;
}