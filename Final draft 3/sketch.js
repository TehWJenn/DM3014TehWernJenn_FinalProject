/* TEH WERN JENN_FINAL PROJECT_ BACKTOSCHOOL GAME

Things Learnt:
-how to set up the canvas in style so that it keeps its shape and same ratios of the orginal image bg while staying int he middle of the screen
*/


let intro;
let scene = 'intro';

const startButton = { x: 348, y: 493, w: 391, h: 180 };

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
}

function draw() {
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

function mousePressed() {
  if (!intro) return;

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