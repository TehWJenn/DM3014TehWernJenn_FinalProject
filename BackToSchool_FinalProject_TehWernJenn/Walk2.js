async function loadWalk2() {
  const [backdrop, sprite] = await Promise.all([
    loadImage('assets/Dwalkschool.png'),
    loadImage('assets/midwalk.png')
  ]);

  return {
    backdrop,
    sprite,
 
    bounds: { x: 455, y: 583, w: 45, h: 108 },
    speed: 200, // speed decreased make it harder to drag. 
    slideBack: 0
  };
}
