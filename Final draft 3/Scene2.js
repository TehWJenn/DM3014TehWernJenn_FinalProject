let scene2Image;

const scene2Notes = scene1Notes.map(note => ({ ...note }));
const scene2ReadingLinks = [...readingLinks];
const study2State = {
  openNote: null,
  readingWindows: [],
  notebookId: '#notepad-popup-study2',
  links: scene2ReadingLinks
};

async function loadScene2() {
  scene2Image = await loadImage('assets/D.png');
}

function drawScene2() {
  drawStudyDesk(scene2Image, scene2Notes, study2State);
}

function clickScene2() {
  clickStudyDesk(scene2Notes, study2State);
}
