const classroomNextButton = { x: 412, y: 630, w: 300, h: 44 };

//telling what scene next after each classroom
const classroomQuizzes = {
  classroom1: { asset: 'Cclassroom.png', size: 3, spacing: 84, next: 'study2' },
  classroom2: { asset: 'Dclassroom.png', size: 5, spacing: 66, next: 'study3' },
  classroom3: { asset: 'Bclassroom.png', size: 10, spacing: 42, next: 'ending' }
};

async function loadClassrooms() {
  await Promise.all(Object.values(classroomQuizzes).map(async quiz => {
    quiz.backdrop = await loadImage('assets/' + quiz.asset);
    quiz.selected = new Set();
  }));
}

function drawClassroom(quiz) {
  image(quiz.backdrop, 0, 0, width, height);

  push();
  rectMode(CORNER);
  ellipseMode(CENTER);
  noStroke();
  fill(0, 140);
  rect(0, 0, width, height);
  fill('#fffdf2');
  rect(300, 85, 523, 620, 12);

  const total = quiz.size * quiz.size;
  const button = classroomNextButton;
  textFont('Chalkboard SE');
  textAlign(CENTER, CENTER);
  fill('#262120');
  textSize(28);

  text(quiz.next === 'ending' ? 'Final Quiz' : 'Pop Quiz', width / 2, 125);
  textSize(17);
  text('Select all circles · ' + quiz.selected.size + '/' + total, width / 2, 165);

  // creating the grid to select the answers 
  const gridSize = quiz.size * quiz.spacing;
  const gridX = (width - gridSize) / 2;
  const dotSize = Math.min(30, quiz.spacing - 4);
  const hovered = hoveredAnswer(quiz);
  for (let index = 0; index < total; index++) {
    const x = gridX + (index % quiz.size + 0.5) * quiz.spacing;
    const y = 195 + (Math.floor(index / quiz.size) + 0.5) * quiz.spacing;
    const selected = quiz.selected.has(index);

    stroke(selected || index === hovered ? '#2459e0' : '#727985');
    strokeWeight(dotSize < 16 ? 1.5 : 3);
    fill('#ffffff');
    circle(x, y, dotSize);
    noStroke();
    if (selected) {
      fill('#2459e0');
      circle(x, y, dotSize * 0.6);
    }
  }

  const ready = quiz.selected.size === total;
  fill(ready ? '#e1b2ff' : '#ded9d3');
  rect(button.x, button.y, button.w, button.h, 10);
  fill('#262120');
  text(quiz.next === 'ending' ? 'Finish quiz' : 'Lock in and continue',
    button.x + button.w / 2, button.y + button.h / 2);

  pop();
  const overContinue = ready && inside(mouseX, mouseY, button);
  cursor(hovered >= 0 || overContinue ? HAND : ARROW);
}

function hoveredAnswer(quiz) {
  const gridX = (width - quiz.size * quiz.spacing) / 2;
  const column = Math.floor((mouseX - gridX) / quiz.spacing);
  const row = Math.floor((mouseY - 195) / quiz.spacing);
  if (column < 0 || column >= quiz.size || row < 0 || row >= quiz.size) return -1;
  return row * quiz.size + column;
}

function clickClassroom(quiz) {
  if (inside(mouseX, mouseY, classroomNextButton)) {
    if (quiz.selected.size !== quiz.size * quiz.size) return;
    scene = quiz.next;
    return;
  }

  const index = hoveredAnswer(quiz);
  if (index < 0) return;
  if (quiz.selected.has(index)) {
    quiz.selected.delete(index);
  } else {
    quiz.selected.add(index);
  }
}
