/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "Pepsi Globe", 
      assetUrl: "https://cdn.glitch.global/93922e1d-49b8-4480-9efe-7536ac022e6c/pepsi_logo.png?v=1746696158711",
      credit: "https://en.wikipedia.org/wiki/Pepsi"
    },
    {
      name: "Firefox Logo", 
      assetUrl: "https://cdn.glitch.global/93922e1d-49b8-4480-9efe-7536ac022e6c/Firefox_logo%2C_2019.svg.png?v=1746696148506",
      credit: "https://en.wikipedia.org/wiki/Firefox"
    },
    {
      name: "Seal of Tolaria", 
      assetUrl: "https://cdn.glitch.global/93922e1d-49b8-4480-9efe-7536ac022e6c/600px-Tolaria.png?v=1746696140729",
      credit: "https://geddon.org/index.php?title=Tolaria&redirect=no"
    },
  ];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
  
  let design = {
    bg: 128,
    fg: []
  }
  
  for(let i = 0; i < 100; i++) {
    design.fg.push({
      x: random(width),
      y: random(height),
      w: random(width/2),
      h: random(height/2),
      fill: random(255)})
  }
  
  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  for(let box of design.fg) {
    fill(box.fill, 128);
    rect(box.x, box.y, box.w, box.h);
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width/2, rate);
    box.h = mut(box.h, 0, height/2, rate);
  }
}


function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
