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
let treeImages = {};
let stoneImages = {};
let houseImages = {};

function p3_preload() {
  terrainImages["grass"] = loadImage("https://cdn.glitch.global/c5f1910d-1aff-4d76-84d7-10fce56f3cd2/grass.png?v=1745739720365");
  terrainImages["ground"] = loadImage("https://cdn.glitch.global/c5f1910d-1aff-4d76-84d7-10fce56f3cd2/ground(1).png?v=1745739686473");
  treeImages["tree1"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/tree(1).png?v=1745897786226");
  treeImages["tree2"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/tree(2).png?v=1745897790479");
  treeImages["tree3"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/tree(3).png?v=1745817909496");
  treeImages["tree4"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/tree(4).png?v=1745897777139");
  stoneImages["stone1"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/stone(1).png?v=1745897933385");
  stoneImages["stone2"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/stone(2).png?v=1745897937014");
  stoneImages["stone3"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/stone(3).png?v=1745897940516");
  stoneImages["stone4"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/stone(4).png?v=1745897944948");
  stoneImages["stone1b"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/stone_ground%20(1).png?v=1745897947714");
  stoneImages["stone2b"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/stone_ground%20(2).png?v=1745897950018");
  stoneImages["stone3b"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/stone_ground%20(3).png?v=1745897952609");
  stoneImages["stone4b"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/stone_ground%20(4).png?v=1745897954948");
  houseImages["redHouse"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/white_red_house(1).png?v=1745898050308");
  houseImages["greenHouse"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/white_green_house(1).png?v=1745898043073");
  houseImages["blueHouse"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/white_blue_house(1).png?v=1745898039500");
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

function getDecoration(i, j) {
  let hash = XXH.h32("decoration:" + [i, j], worldSeed);
  let value = hash % 100;
  
  if (value < 10) {  // Stones
    return "stone3";
  } else if (value < 25) {  // Trees
    return "tree3";
  } else {  // Empty
    return null;
  }
}

function p3_drawTile(i, j) {
  noStroke();

  // Tile terrain
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
  
  // Tile decorations
  let deco = getDecoration(i, j);
  if (deco === "tree3" && treeImages["tree3"]) {
    push();
    imageMode(CENTER);
    image(treeImages["tree3"], 0, -th * 1.2, tw, th * 3);
    pop();
  } else if (deco === "stone3" && stoneImages["stone3"]) {
    push();
    imageMode(CENTER);
    image(stoneImages["stone3"], 0, -th * 0.5, tw, th * 2);
    pop();
  }

  // Click interaction
  let n = clicks[[i, j]] | 0;
  if (n % 4 == 1 && !deco) {
    let img = houseImages["redHouse"];
    if (img) {
      push();
      imageMode(CENTER);
      
      let imgWidth = tw;
      let imgHeight = th * 2;
      image(img, 0, -th * 0.7, imgWidth, imgHeight); // Moved up
      pop();
    }
  } else if (n % 4 == 2 && !deco) {
    let img = houseImages["greenHouse"];
    if (img) {
      push();
      imageMode(CENTER);
      
      let imgWidth = tw;
      let imgHeight = th * 2;
      image(img, 0, -th * 0.7, imgWidth, imgHeight); // Moved up
      pop();
    }
  } else if (n % 4 == 3 && !deco) {
    let img = houseImages["blueHouse"];
    if (img) {
      push();
      imageMode(CENTER);
      
      let imgWidth = tw;
      let imgHeight = th * 2;
      image(img, 0, -th * 0.7, imgWidth, imgHeight); // Moved up
      pop();
    }
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
