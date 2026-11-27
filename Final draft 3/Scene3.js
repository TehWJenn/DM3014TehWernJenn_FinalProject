let scene3Image;

const scene3Notes = scene1Notes.map(note => ({ ...note }));
const scene3ReadingLinks = [...readingLinks];
const study3State = {
  openNote: null,
  readingWindows: [],
  notebookId: '#notepad-popup-study3',
  links: scene3ReadingLinks
};

async function loadScene3() {
  scene3Image = await loadImage('assets/BStudy.png');
}

function drawScene3() {
  drawStudyDesk(scene3Image, scene3Notes, study3State);
}

function clickScene3() {
  clickStudyDesk(scene3Notes, study3State);
}
