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
let fxImages = {};

function p3_preload() {
  terrainImages["grass"] = loadImage("https://cdn.glitch.global/c5f1910d-1aff-4d76-84d7-10fce56f3cd2/grass.png?v=1745739720365");
  terrainImages["ground"] = loadImage("https://cdn.glitch.global/c5f1910d-1aff-4d76-84d7-10fce56f3cd2/ground(1).png?v=1745739686473");
  terrainImages["water"] = loadImage("https://cdn.glitch.global/97608490-4d28-492f-872c-0c89922a8a3d/water.png?v=1745987657554");
  
  treeImages["tree3"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/tree(3).png?v=1745817909496");
  
  stoneImages["stone3"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/stone(3).png?v=1745897940516");
  
  houseImages["redHouse"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/white_red_house(1).png?v=1745898050308");
  houseImages["greenHouse"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/white_green_house(1).png?v=1745898043073");
  houseImages["blueHouse"] = loadImage("https://cdn.glitch.global/900767f7-2bf7-4824-897c-0abfa47d586e/white_blue_house(1).png?v=1745898039500");
  houseImages["smithy"] = loadImage("https://cdn.glitch.global/97608490-4d28-492f-872c-0c89922a8a3d/blacksmith_red(1).png?v=1745987745154");
  houseImages["mill"] = loadImage("https://cdn.glitch.global/97608490-4d28-492f-872c-0c89922a8a3d/mill_green.png?v=1745987769807");
  houseImages["tower"] = loadImage("https://cdn.glitch.global/97608490-4d28-492f-872c-0c89922a8a3d/castle_tower_blue(9).png?v=1745987823577");
  fxImages["smokePuff"] = loadImage("https://cdn.glitch.global/97608490-4d28-492f-872c-0c89922a8a3d/smoke.png?v=1745987749586");
  fxImages["millBlades1"] = loadImage("https://cdn.glitch.global/97608490-4d28-492f-872c-0c89922a8a3d/mill(1).png?v=1745987773372");
  fxImages["millBlades2"] = loadImage("https://cdn.glitch.global/97608490-4d28-492f-872c-0c89922a8a3d/mill(3).png?v=1745987775763");
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

function getElevation(i, j) {
  let hash = XXH.h32("elevation:" + [i, j], worldSeed);
  return (hash % 5) - 2; 
}

function isWaterTile(i, j) {
  // If the tile itself is marked as lake origin
  if (isLakeTile(i, j)) return true;

  // Check nearby tiles to see if they're lake origins
  for (let di = -2; di <= 2; di++) {
    for (let dj = -2; dj <= 2; dj++) {
      if (isLakeTile(i + di, j + dj)) return true;
    }
  }

  return false;
}

function isLakeTile(i, j) {
  let elevation = getElevation(i, j);
  if (elevation > -1) return false;

  // Only generate lakes occasionally
  let hash = XXH.h32("lakeOrigin:" + [i, j], worldSeed);
  if (hash % 100 > 5) return false; // ~0.5% chance

  return true;
}

function getTerrainType(i, j) {
  let hash = XXH.h32("terrain:" + [i, j], worldSeed);
  randomSeed(hash);
  let r = random();
  if (r < 0.7) return "grass";
  // else if (r < 0.7) return "water";
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
  let elevation = getElevation(i, j);
  let heightStep = 4;
  let terrainType = isLakeTile(i, j) ? "water" : getTerrainType(i, j);
  let img = terrainImages[terrainType];
  if (img) {
    push();
    imageMode(CENTER);
    translate(0, -elevation * heightStep);
    
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
  
  let deco;
  if(terrainType != "water"){
    // Tile decorations
    deco = getDecoration(i, j);
    if (deco === "tree3" && treeImages["tree3"]) {
      push();
      imageMode(CENTER);
      translate(0, -elevation * heightStep);
      image(treeImages["tree3"], 0, -th * 1.2, tw, th * 3);
      pop();
    } else if (deco === "stone3" && stoneImages["stone3"]) {
      push();
      imageMode(CENTER);
      image(stoneImages["stone3"], 0, -th * 0.5, tw, th * 2);
      pop();
    }
  }

  // Click interaction
  let n = clicks[[i, j]] | 0;
  if (!deco && terrainType != "water") {
    if (n % 7 == 1) {
      let img = houseImages["redHouse"];
      if (img) {
        push();
        imageMode(CENTER);
        translate(0, -elevation * heightStep);

        let imgWidth = tw;
        let imgHeight = th * 2;
        image(img, 0, -th * 0.7, imgWidth, imgHeight); // Moved up
        pop();
      }
    } else if (n % 7 == 2) {
      let img = houseImages["greenHouse"];
      if (img) {
        push();
        imageMode(CENTER);
        translate(0, -elevation * heightStep);

        let imgWidth = tw;
        let imgHeight = th * 2;
        image(img, 0, -th * 0.7, imgWidth, imgHeight); // Moved up
        pop();
      }
    } else if (n % 7 == 3) {
      let img = houseImages["blueHouse"];
      if (img) {
        push();
        imageMode(CENTER);
        translate(0, -elevation * heightStep);

        let imgWidth = tw;
        let imgHeight = th * 2;
        image(img, 0, -th * 0.7, imgWidth, imgHeight); // Moved up
        pop();
      }
    } else if (n % 7 == 4) {
      let img = houseImages["smithy"];
      if (img) {
        push();
        imageMode(CENTER);
        translate(0, -elevation * heightStep);

        let imgWidth = tw;
        let imgHeight = th * 2;
        image(img, 0, -th * 0.7, imgWidth, imgHeight); // Moved up
        pop();
        
        let yOffset = -th * 2.3;
        let puffHeight = Math.sin(frameCount / 10 + i + j) * 4;
        translate(0, -elevation * heightStep);
        image(fxImages["smokePuff"], 0, yOffset + puffHeight, tw, th);
      }      
    } else if (n % 7 == 5) {
      let img = houseImages["mill"];
      if (img) {
        push();
        imageMode(CENTER);
        translate(0, -elevation * heightStep);

        let imgWidth = tw;
        let imgHeight = th * 4;
        image(img, 0, -th * 1.5, imgWidth, imgHeight); // Moved up
        pop();
        
        let bladeFrame = (Math.floor(frameCount / 30) % 2 === 0) ? "millBlades1" : "millBlades2";
        let blades = fxImages[bladeFrame];
        if (blades) {
          translate(0, -elevation * heightStep);
          image(blades, -tw, -th * 2.1, tw * 1.5, th * 2);
        }
      }      
    } else if (n % 7 == 6) {
      let img = houseImages["tower"];
      if (img) {
        push();
        imageMode(CENTER);
        translate(0, -elevation * heightStep);

        let imgWidth = tw;
        let imgHeight = th * 3;
        image(img, 0, -th * 1.1, imgWidth, imgHeight); // Moved up
        pop();
      }
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
