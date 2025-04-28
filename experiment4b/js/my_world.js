"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let terrainImages = {};

function p3_preload() {
  terrainImages["grass"] = loadImage("https://cdn.glitch.global/c5f1910d-1aff-4d76-84d7-10fce56f3cd2/grass.png?v=1745739720365");
  terrainImages["ground"] = loadImage("https://cdn.glitch.global/c5f1910d-1aff-4d76-84d7-10fce56f3cd2/ground(1).png?v=1745739686473");
}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

function getTerrainType(i, j) {
  let hash = XXH.h32("terrain:" + [i, j], worldSeed);
  randomSeed(hash);
  let r = random();
  if (r < 0.7) return "grass";
  else return "ground";
}

function p3_drawTile(i, j) {
  noStroke();

  let type = getTerrainType(i, j);
  let img = terrainImages[type];
  
  if (img) {
    push();
    imageMode(CENTER);
    
    let imgWidth = tw * 2;
    let imgHeight = th * 3.5;  // Vertical stretch
    image(img, 0, th * 0.6, imgWidth, imgHeight);
    pop();
  } else {
    // fallback in case image didn't load
    fill(200);
    push();
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);
    pop();
  }

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    fill(0, 0, 0, 32);
    ellipse(0, 0, 10, 5);
    translate(0, -10);
    fill(255, 255, 100, 128);
    ellipse(0, 0, 10, 10);
  }
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
