let scene3Image;

const scene3NoteColours = ['#e2e2e2', '#cbcbcb', '#bebebe', '#d7d7d7'];
const scene3Notes = scene1Notes.map((note, index) => ({
  ...note,
  noteColour: scene3NoteColours[index] ?? scene3NoteColours[0],
  ...(index === 2 ? {
    title: 'EXAM TODAY!',
    message: 'Hope you are ready!!.',
    centerMessage: true
  } : {})
}));
const scene3ReadingLinks = [...readingLinks,
  'https://my.clevelandclinic.org/health/articles/organs-in-the-body',
  'https://www.bbc.co.uk/bitesize/articles/zkf7xfr#zkxmtrd',
  'https://cdn.savemyexams.com/pdfs/LOs.pdf',
  'https://www.straitstimes.com/singapore/parenting-education/excessive-screen-use-often-a-coping-mechanism-for-deeper-issues-experts-say',
  'https://www.straitstimes.com/singapore/health/are-you-lonely',
  'https://www.montmarte.com/blogs/tips-techniques/8-art-tips-for-beginners',
  'https://cherryarts.org/education/art-at-home/',

];
const study3State = {
  openNote: null,
  readingWindows: [],
  notebookId: '#notepad-popup-study3',
  palette: {
    button: '#e5e5e5',
    hover: '#c5c5c5',
    shadow: '#555555',
    label: '#d4d4d4'
  },
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
