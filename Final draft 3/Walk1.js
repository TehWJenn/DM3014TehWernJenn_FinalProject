async function loadWalk1() {
  const [backdrop, sprite] = await Promise.all([
    loadImage('assets/Cwalkschool.png'),
    loadImage('assets/happy walk.png')
  ]);

  return {
    backdrop,
    sprite,
    bounds: { x: 296, y: 576, w: 65, h: 118 },
    speed: 700,
    slideBack: 0
  };
}
