async function loadWalk2() {
  const [backdrop, sprite] = await Promise.all([
    loadImage('assets/Dwalkschool.png'),
    loadImage('assets/midwalk.png')
  ]);

  return {
    backdrop,
    sprite,
    // Visible character bounds when the sprite PNG is drawn at canvas size.
    bounds: { x: 455, y: 583, w: 45, h: 108 },
    // Movement values are in pixels per second.
    speed: 200,
    slideBack: 0
  };
}
