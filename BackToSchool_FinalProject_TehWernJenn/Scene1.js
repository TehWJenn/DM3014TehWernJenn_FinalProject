let scene1Image;

const scene1Notes = [
  {
    x: 691, y: 117, w: 70, h: 64,
    title: 'Do not Dilly Dally! There is many things to do!!',
    // message: '.'
    noteColour: '#fff0a8' // yellowcolour of note
  },
  {
    x: 782, y: 91, w: 60, h: 72,
    title: 'Keep Focus! Finish your studies!',
    // message: 'How many have you completd?.'
    noteColour: '#8cfff5' // cyan colour of note
  },
  {
    x: 819, y: 169, w: 60, h: 39,
    title: 'WARNING: EXAM IN 3 DAYS!',
    // message: 'Remember to check your timetable.'
    noteColour: '#ffbdd7' // pink colour of note
  },
  {
    x: 644, y: 580, w: 87, h: 73,
    title: 'To Do List',
    message: 'Prep for quiz:\n- Scroll through research papers.\n- Write down notes for each chapter.',   // \n is skip line
    noteColour: '#fff0a8' // yellow colour of note
  }
];

// clickable note pad area
const notepad = { x: 200, y: 575, w: 155, h: 140 };

async function loadScene1() {
  scene1Image = await loadImage('assets/Cstudy.png');
}

function drawScene1() {
  drawStudyDesk(scene1Image, scene1Notes, study1State);
}

function drawStudyDesk(deskImage, notes, state) {
  image(deskImage, 0, 0, width, height);
  const openNote = state.openNote;



  const overNote = notes.some(note => inside(mouseX, mouseY, note));  // .some() checks if the cusor is in the note era, =>  creates function note 

  const overNotepad = inside(mouseX, mouseY, notepad);
  const overLaptop = inside(mouseX, mouseY, laptopScreen);

  const readingOpen = isReadingWindowOpen(state);
  const showNext = !openNote && !readingOpen && studyIsDone(state);
  const overNext = showNext && inside(mouseX, mouseY, studyNextButton);

  cursor(!readingOpen && (openNote || overNote || overNotepad || overLaptop || overNext) ? HAND : ARROW);

  if (!openNote) {
    if (showNext) {
      drawStudyNextButton(state.palette);
    } else {
      drawStudyLabel(state.palette);
    }
    return;
  }

  //1. black overlay to darken the screen
  fill(0, 200); 
  rect(0, 0, width, height);

  // Drawing the note box
    // Size of the note box
  const x = (width - 300) / 2; 
  const y = (height - 300) / 2;

  push();
  rectMode(CORNER);
  noStroke();
 
  fill(openNote.noteColour ?? '#fff9df');
  rect(x, y, 300, 300);

  // Display the title and message of the note
  fill('#262120');
  textFont('Chalkboard SE');
  textAlign(CENTER, TOP);
  // Title loaction
  textSize(24);
  text(openNote.title, x + 20, y + 36, 260);

  // Message location
  textAlign(openNote.centerMessage ? CENTER : LEFT, CENTER);
  textSize(16);
  text(openNote.message ?? '', x + 20, y + 90, 260, 100);   // text is not message is undefined '??' use ' ' empty 

  //Back to study button;
  const button = { x: x + 20, y: y + 242, w: 150, h: 38 };
  const hover = inside(mouseX, mouseY, button);
  // Shadow
  fill(state.palette?.shadow ?? '#38264d');
  rect(button.x, button.y + 2, button.w, button.h, 12);

  // Button
  fill(hover ? (state.palette?.hover ?? '#e1b2ff') : (state.palette?.button ?? '#ffffff'));
  rect(button.x, button.y, button.w, button.h, 12);

  // Label
  fill('#000000');
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Back to study', button.x + button.w / 2, button.y + button.h / 2);

  pop();
  
}
// Clickable screen
const laptopScreen = { x: 375, y: 272, w: 340, h: 205 };

const readingLinks = [ // adding links so that they open up web links
  'https://www.monash.edu/student-academic-success/biology/photosynthesis/the-process-of-photosynthesis',
  'https://doi.org/10.3390/plants11030441',
  'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0187590'
];

const study1State = {
  openNote: null,
  readingWindows: [],
  notebookId: '#notepad-popup',
  links: readingLinks
};

function openLaptopTab(state) {
  const nextReading = state.readingWindows.length;
  if (nextReading === state.links.length) return;

  const popup = window.open(state.links[nextReading], '_blank', 'popup,width=480,height=600');
  if (!popup) return;

  popup.opener = null;
  state.readingWindows.push(popup);
}

function clickScene1() {
  clickStudyDesk(scene1Notes, study1State);
}

function clickStudyDesk(notes, state) {
  if (isReadingWindowOpen(state)) return;

  const paper = document.querySelector(state.notebookId);
  if (paper?.open) return;

  if (state.openNote) {
    state.openNote = null;
    return;
  }

  if (inside(mouseX, mouseY, notepad)) {
    paper?.showModal();
    return;
  }

  if (inside(mouseX, mouseY, laptopScreen)) {
    openLaptopTab(state);
    return;
  }

  if (studyIsDone(state) && inside(mouseX, mouseY, studyNextButton)) {
    scene = 'walk';
    return;
  }

  state.openNote = notes.find(note => inside(mouseX, mouseY, note)) ?? null;
}

function isReadingWindowOpen(state) {
  return state.readingWindows.some(popup => !popup.closed);
}

function studyIsDone(state) {
  const paper = document.querySelector(state.notebookId);
  const notes = paper?.querySelector('textarea')?.value.trim() ?? '';

  return notes.length > 0 && !paper.open &&
    state.readingWindows.length === state.links.length &&
    !isReadingWindowOpen(state);
}

function drawStudyLabel(palette) {
  push();
  rectMode(CORNER);
  noStroke();
  fill(palette?.label ?? '#f5ddb7');
  rect(width / 2 - 150, 718, 300, 62, 12);
  fill('#262120');
  textFont('Chalkboard SE');
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Study!!!', width / 2, 749);
  pop();
}

const studyNextButton = { x: 461, y: 725, w: 200, h: 45 };

function drawStudyNextButton(palette) {
  const button = studyNextButton;
  const hover = inside(mouseX, mouseY, button);

  push();
  rectMode(CORNER);
  noStroke();
  fill(hover ? (palette?.hover ?? '#a7a7a7') : (palette?.button ?? '#ffffff'));
  rect(button.x, button.y, button.w, button.h, 12);

  fill('#262120');
  textFont('Chalkboard SE');
  textAlign(CENTER, CENTER);
  textSize(20);
  text('▶︎', button.x + button.w / 2, button.y + button.h / 2);
  pop();
}


// const scene1Laptop = { x: 375, y: 272, w: 340, h: 205 };
// const scene1Dialog = document.createElement('dialog');
// scene1Dialog.setAttribute('aria-label', 'Study desk');
// Object.assign(scene1Dialog.style, {
//   width: 'min(26rem, calc(100% - 3rem))',
//   boxSizing: 'border-box',
//   padding: '1.25rem',
//   borderRadius: '0.5rem',
//   backgroundColor: '#fff9df',
//   color: '#262120',
//   fontFamily: 'system-ui, sans-serif'

// });
// document.body.append(scene1Dialog);

// async function loadScene1() {
//   scene1Image = await loadImage('assets/Cstudy.png');
// }

// function drawScene1() {
//   image(scene1Image, 0, 0, width, height);

//   const overNote = scene1Notes.some((note) => inside(mouseX, mouseY, note));
//   const overLaptop = inside(mouseX, mouseY, scene1Laptop);
//   cursor(overNote || overLaptop ? HAND : ARROW);
// }

// function clickScene1() {
//   // if (scene1Dialog.open) return;

//   const note = scene1Notes.find((note) => inside(mouseX, mouseY, note));
//   if (note) {
//     showScene1Popup(note.title, note.message);
//   }
// }

// // function clickScene1(startWalking) {
// //   if (scene1Dialog.open) return;

// //   const note = scene1Notes.find((note) => inside(mouseX, mouseY, note));
// //   if (note) {
// //     showScene1Popup(note.title, note.message);
// //     return;
// //   }

// //   if (inside(mouseX, mouseY, scene1Laptop)) {
// //     showScene1Popup('Ready for school?', 'Head out when you’re done studying.', startWalking);
// //   }
// // }

// function showScene1Popup(title, message) { //function showScene1Popup(title, message, startWalking) {
//   const heading = document.createElement('h2');
//   heading.textContent = title;

//   const paragraph = document.createElement('p');
//   paragraph.textContent = message;

//   const close = document.createElement('button');
//   close.textContent = 'Back to desk';
//   close.onclick = () => scene1Dialog.close();

//   scene1Dialog.replaceChildren(heading, paragraph, close);

//   // if (startWalking) {
//   //   const walk = document.createElement('button');
//   //   walk.textContent = 'Walk to school';
//   //   walk.style.marginLeft = '0.5rem';
//   //   walk.onclick = () => {
//   //     scene1Dialog.close();
//   //     startWalking();
//   //   };
//   //   scene1Dialog.append(walk);
//   // }

//   scene1Dialog.showModal();
// }


