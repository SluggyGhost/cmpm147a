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

function p3_preload() {}

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

let anchorSpacing = 10;  // every 10 tiles all directions
let anchorCache = {};    // memoization to store anchor colors

function getAnchorColor(ai, aj) {
  let key = `${ai},${aj}`;
  if(anchorCache[key]) return anchorCache[key];
  
  let hash = XXH.h32("anchor:" + [ai,aj], worldSeed);
  randomSeed(hash);
  
  let r = random(100, 255);
  let g = random(100, 255);
  let b = random(100, 255);
  
  anchorCache[key] = [r, g, b];
  return anchorCache[key];
}

function p3_drawTile(i, j) {
  noStroke();
  
  // Find the anchor tile nearest this tile
  let ai = Math.round(i / anchorSpacing) * anchorSpacing;
  let aj = Math.round(j / anchorSpacing) * anchorSpacing;
  
  let [r, g, b] = getAnchorColor(ai, aj);
  
  // Distance from anchor (used to darken farther tiles)
  let dist = Math.hypot(i - ai, j - aj);
  let brightness = map(dist, 0, anchorSpacing * 2, 1.0, 0.6);
  brightness = constrain(brightness, 0.6, 1.0);
  
  fill(r * brightness, g * brightness, b * brightness, 255);

  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();
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
