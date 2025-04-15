// sketch.js - purpose and description here
// Author: Joshua Acosta
// Date: 4/15/25

/* exported setup, draw */
let canvasContainer;
let seed = 0;
let trails = [];

const stoneColor = "#5a698a";
const grassColor = "#717f30";
const treeColor = "#2d3828";
const waterColor = "#426492";
const splashColor = "#ffffff"
const flowerColor = "#b29607";
const skyColor = "#b9dbf7";
const peaks = 7;

function resizeScreen() {
  let w = canvasContainer.width();
  let h = canvasContainer.height();
  if (h === 0) h = 400;
  resizeCanvas(w, h);
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
   $("#reimagine").click(() => seed++);
}

function draw() {
  randomSeed(seed);  // ensures consistent randomness
  background(100);
  
  noStroke(); // disables outlines for shapes
  
  // Add sky and grass
  fill(skyColor);
  rect(0, 0, width, height/2);
  fill(grassColor);
  rect(0, height/2, width, height/2);
  
  // Add the lake
  fill(waterColor);
  rect(width/10, height/2, width-width/8, height/4, random(1, 50), random(1, 70), random(1, 100), random(15, 200));
  
  // Add the mountains
  fill(stoneColor);
  beginShape();
  vertex(random(-width/5, 0), height/2);
  for (let i = 1; i <= 2*peaks+1; i++) {
    let x = (i * width/(2*peaks+1)) - random(3*i, 5*i);
    if(i % 2 == 1){  // Peaks
      let y = random(height/12, -height/6);
      vertex(x, y);
    }else{          // Valleys
      let y = random(height*3/8, height/10);
      vertex(x, y);
    }
  }
  vertex(random(width, width*6/5), height/2);
  endShape(CLOSE);
  
  // Add the flowers
  fill(flowerColor)
  const flowers = random(500, 1000);
  for(let i = 0; i < flowers; i++){
    let x = width * random();
    let y = (height*3/4) + random(height/4);
    ellipse(x, y, height/100);
  }
  
  /*******************************************************************************************
   * Water glint effect                                                                      *
   * ----------------------------------------------------------------------------------------*
   * Code for cursor trail effect: https://editor.p5js.org/MindForCode/sketches/fDEsXqQBS    *
   * ChatGPT modification: https://chatgpt.com/share/67fe1d23-5318-800c-bfb4-33f359c924eb    *
   *******************************************************************************************/
  fill(splashColor);
  // Add new trail points (if inside the lake)
  if(mouseX > width/10 && mouseX < width*39/40 && mouseY > height/2 && mouseY < height*3/4){
    trails.push({
      pos: createVector(mouseX, mouseY),
      life: 5.0,
      size: width/100
    });
  }
  // Update and draw trail points
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    // Fade and shrink over time
    t.life -= 0.01;
    t.size *= 0.98;
    // Remove if fully faded
    if (t.life <= 0 || t.size <= 1) {
      trails.splice(i, 1);
      continue;
    }
    ellipse(t.pos.x, t.pos.y, t.size, t.size/4);
  }
  
  // TREES
  fill(treeColor);
  // Far tree line
  let trees = random(1000,2000);
  for(let i = 0; i < trees; i++){
    let x = random(-width/20, width);
    let y = height/2 - random(height/10);
    let treeHeight = 20;
    let treeWidth = 10;
    triangle(x, y, x+(treeWidth/2), y-treeHeight,x+treeWidth, y);
  }
  // Trees left of the lake
  trees = random(80,100);
  for(let i = 0; i < trees; i++){
    let x = random(-width/20, width/10);
    let y = (height/2) + random(height/4);
    let treeHeight = 40;
    let treeWidth = 20;
    triangle(x, y, x+(treeWidth/2), y-treeHeight,x+treeWidth, y);
  }
  // Near tree line
  trees = random(80,100);
  for(let i = 0; i < trees; i++){
    let x = random(-width/20, width);
    let y = (height*3/4) + random(height/4);
    let treeHeight = 60;
    let treeWidth = 30;
    triangle(x, y, x+(treeWidth/2), y-treeHeight,x+treeWidth, y);
  }
}
