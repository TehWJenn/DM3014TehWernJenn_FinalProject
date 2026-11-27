async function loadWalk3() {
  const [backdrop, sprite] = await Promise.all([
    loadImage('assets/walkschoolbg.png'),
    loadImage('assets/Dontwalk.png')
  ]);

  return {
    backdrop,
    sprite,
    // Visible character bounds when the sprite PNG is drawn at canvas size.
    bounds: { x: 579, y: 584, w: 73, h: 105 },
    // Movement values are in pixels per second.
    speed: 170,
    slideBack: 150
  };
}
