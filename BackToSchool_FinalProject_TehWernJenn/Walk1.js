async function loadWalk1() {
  const [backdrop, sprite] = await Promise.all([
    loadImage('assets/Cwalkschool.png'),
    loadImage('assets/happy walk.png')
  ]);

  return {
    backdrop,
    sprite,
    bounds: { x: 296, y: 576, w: 65, h: 118 }, //added bounds so that it can only go form let to right
    speed: 700, // giving it higher speed than the rest, easy to drag
    slideBack: 0
  };
}
