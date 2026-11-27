/* TEH WERN JENN_FINAL PROJECT_ BACKTOSCHOOL GAME

Things Learnt:
-how to set up the canvas in style so that it keeps its shape and same ratios of the orginal image bg while staying in the middle of the screen
-creating my own scenes in js files and trying to piece them together using a main file to organise.

*/


let intro;
let scene = 'intro';

const startButton = { x: 348, y: 493, w: 391, h: 180 };
const playAgainButton = { x: 200, y: 500, w: 700, h: 200 };
const exitButton = { x: 10, y: 50, w: 120, h: 44 };
let exitTargetX = exitButton.x;
let exitTargetY = exitButton.y;
let nextExitDodge = 0;

async function setup() {
  createCanvas(1123, 794).parent('game');

  const [introImage] = await Promise.all([
    loadImage('assets/intro.png'),
    loadScene1(),
    loadWalkScene(),
    loadClassrooms(),
    loadScene2(),
    loadScene3()
  ]);
  intro = introImage;

  //added this so that i can test one scene rather than go through all of it again and again to test the page thats not working.
  const testScene = new URLSearchParams(window.location.search).get('scene');
  if (['study1', 'study2', 'study3', 'classroom1', 'classroom2',
      'classroom3', 'ending'].includes(testScene)) {
    scene = testScene;
  }
  if (['walk1', 'walk2', 'walk3'].includes(testScene)) {
    roundIndex = Number(testScene.slice(-1)) - 1;
    scene = 'walk';

  }
}

function draw() {
  updateStageMusic(scene, roundIndex, deltaTime);
  background(220);
  if (!intro) return;

  if (scene === 'intro') {
    image(intro, 0, 0, width, height);

    push();
    textFont('Bradley Hand');
    textStyle(BOLD);
    textSize(150);
    textAlign(CENTER, CENTER);
    fill(0);
    translate(width / 2, height / 3);
    rotate(sin(millis() / 50) * 0.08);
    text('Back to school!', 0, 0);
    pop();

    push();
    textFont('Another Typewriter');
    // textFont('Arial Rounded MT Bold');
    textStyle(BOLD);
    textSize(25);
    textAlign(CENTER, CENTER);
    fill(0);
    translate(width/2, height /3 + 100);
    text('by Teh Wern Jenn', 0, 0);
    pop();

    cursor(inside(mouseX, mouseY, startButton) ? HAND : ARROW);
    return;
  }

  if (scene === 'study1') {
  drawScene1();
  return;
}

  if (scene === 'ending') {
    background(0);
    push();
    noStroke();
    fill(255);
    textFont('Bradley Hand');
    textStyle(BOLD);
    textSize(100);
    textAlign(CENTER, CENTER);
    text('Congradualtions!', width / 2, height / 2 - 150 );
    textSize(60);
    text('You survived again!\nWell done!', width / 2, height / 2);


    const button = playAgainButton;
    const hover = inside(mouseX, mouseY, button);

    rectMode(CORNER);

    fill('#38264d');
    rect(button.x, button.y + 2, button.w, button.h, 12);
    fill(hover ? '#e1b2ff' : '#ffffff');
    rect(button.x, button.y, button.w, button.h, 12);

    fill(0);
    textFont('Chalkboard SE');
    textStyle(NORMAL);
    textSize(50);
    text('Play again?', button.x + button.w / 2, button.y + button.h / 2);

    // exit button that does not work 
    const exit = exitButton;
const distanceToExit = dist(
  mouseX, mouseY,
  exit.x + exit.w / 2, exit.y + exit.h / 2
);

if (distanceToExit < 100 && millis() >= nextExitDodge) {
  exitTargetX = mouseX < width / 2 ? width - exit.w - 30 : 30;

  if (mouseY < height / 2) {
    exitTargetY = random(height / 2, height - exit.h - 20);
  } else {
    exitTargetY = random(20, height / 2 - exit.h);
  }

  nextExitDodge = millis() + 350;
}

    exit.x = lerp(exit.x, exitTargetX, 0.25);
    exit.y = lerp(exit.y, exitTargetY, 0.25);

    fill('#555555');
    rect(exit.x, exit.y, exit.w, exit.h, 12);

    fill('#ffffff');
    textSize(20);
    text('Exit', exit.x + exit.w / 2, exit.y + exit.h / 2);
    pop();

    cursor(hover ? HAND : ARROW);
    return;

z
  }

  if (classroomQuizzes[scene]) {
    drawClassroom(classroomQuizzes[scene]);
    return;
  }

  if (scene === 'study2') {
    drawScene2();
    return;
  }

  if (scene === 'study3') {
    drawScene3();
    return;
  }

  if (scene === 'walk') {
    drawWalkScene();
  }
}

function mouseMoved() {
  if (scene !== 'ending') return;

  const button = playAgainButton;
  const targetX = constrain(mouseX - button.w / 2, 0, width - button.w);
  const targetY = constrain(mouseY - button.h / 2, 0, height - button.h);

  // using lerp to to add value to the x and y value to move the button to follow the mouse. faster
  button.x = lerp(button.x, targetX, 0.25);
  button.y = lerp(button.y, targetY, 0.25);
}

function mousePressed() {
  startStageMusic(scene, roundIndex);
  if (!intro) return;

  if (scene === 'ending') {
    if (inside(mouseX, mouseY, exitButton)) return;

    if (inside(mouseX, mouseY, playAgainButton)) {
      const url = new URL(window.location.href);
      if (url.searchParams.has('scene')) {
        url.searchParams.delete('scene');
        window.location.replace(url.href);
      } else {
        window.location.reload();
      }
    }
    return;
  }

  if (scene === 'intro') {
    if (inside(mouseX, mouseY, startButton)) {
      scene = 'study1';
    }
    return;
  }

  if (scene === 'study1') {
    clickScene1();
    return;
  }

  if (classroomQuizzes[scene]) {
    clickClassroom(classroomQuizzes[scene]);
    return;
  }

  if (scene === 'study2') {
    clickScene2();
    return;
  }

  if (scene === 'study3') {
    clickScene3();
    return;
  }

  if (scene === 'walk') pressWalk();
}

function mouseDragged() {
  if (scene === 'walk') dragWalk();
}

function mouseReleased() {
  if (scene === 'walk') {
    releaseWalk(arrival => {
      scene = 'classroom' + arrival;
    });
  }
}

function inside(x, y, box) {
  return x >= box.x && x <= box.x + box.w &&
         y >= box.y && y <= box.y + box.h;
}