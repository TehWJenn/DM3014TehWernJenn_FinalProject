async function loadWalk3() {
  const [backdrop, sprite] = await Promise.all([
    loadImage('assets/walkschoolbg.png'),
    loadImage('assets/Dontwalk.png')
  ]);

  return {
    backdrop,
    sprite,
    bounds: { x: 579, y: 584, w: 73, h: 105 },
    speed: 170,
    slideBack: 150 // slide back addeed to reflect the idea of not wanting to go to school it keeps running back as you let go of it.
  };
}
