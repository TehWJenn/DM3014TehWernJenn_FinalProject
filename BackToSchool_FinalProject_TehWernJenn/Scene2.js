let scene2Image;

const scene2NoteColours = ['#e5dbb4', '#bdd8d3', '#d8bdc9', '#e7d8ab'];
const scene2Notes = scene1Notes.map((note, index) => ({
  ...note,
  noteColour: scene2NoteColours[index] ?? note.noteColour,
  ...(index === 2 ? {
    title: 'EXAM IN 2 DAYS!',
    message: 'Review the topics you struggled with in class.',
    centerMessage: true
  } : {})
}));
const scene2ReadingLinks = [...readingLinks,
  'https://my.clevelandclinic.org/health/articles/organs-in-the-body',
  'https://www.bbc.co.uk/bitesize/articles/zkf7xfr#zkxmtrd',
  'https://cdn.savemyexams.com/pdfs/LOs.pdf',
];
const study2State = {
  openNote: null,
  readingWindows: [],
  notebookId: '#notepad-popup-study2',
  palette: {
    button: '#e2dce4',
    hover: '#c8b8ce',
    shadow: '#625567',
    label: '#d8c9b3'
  },
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
