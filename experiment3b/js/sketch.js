// Author: Joshua Acosta
// Date: 4/23/25

/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;
let lightRadius = 100;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(16*20, 16*20);
  canvas.parent("canvas-container");
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  $("#reseed").click(reseed);

  reseed();
  select("#asciiBox").input(reparseGrid);
}

function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

function resizeScreen() {
  let w = canvasContainer.width();
  let h = canvasContainer.height();
  if (h === 0) h = 400;
  resizeCanvas(w, h);
}

function generateGrid(numCols, numRows) {
  // Generate the grid
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  
  let maxRooms = 5;
  generateRooms(grid, maxRooms);
  
  return grid;
}

function drawGrid(grid) {
  background(128);

  // Background
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if(gridCheck(grid, i, j, '_')){
        placeTile(i, j, 10, 22);
      } else {
        placeTile(i, j, 10, 23);
        drawContext(grid, i, j, '_', 6, 22);
      }
    }
  }
  
  // Objects & Interactibles
  let maxObjects = 15;
  for(let i = 0; i < maxObjects; i++){
    let row = floor(random(grid.length));
    let col = floor(random(grid[0].length));
    if(gridCheck(grid, row-1, col, '_') && gridCheck(grid, row, col, '.')){
      placeTile(row,col,5,27);  // Doorway
    } else if (gridCheck(grid, row, col, '.')){
      placeTile(row,col,3,28);  // Chest
    }
  }
  
  drawDarknessOverlay();
}

function generateRooms(grid, maxRooms){
  for(let i = 0; i < maxRooms; i++){
    // Get the corners of the room
    // (Also ensures that the room is 2x2 at minimum.)
    let row1 = floor(random(grid.length-1));
    let row2 = floor(random(grid.length));
    if(row1 > row2){[row1, row2] = [row2, row1];}
    if(row1 == row2){row2++;}
    let column1 = floor(random(grid[0].length-1));
    let column2 = floor(random(grid[0].length));
    if(column1 > column2){[column1, column2] = [column2, column1];}
    if(column1 == column2){column2++;}
    
    // Generate the room
    for(let i = row1; i <= row2; i++){
      for(let j = column1; j <= column2; j++){
        grid[i][j] = '.';
      }
    }
  }
}

function gridCheck(grid, i, j, target) {
  // Check if target is at grid[i][j]
  return (
    i >= 0 && i < grid.length &&
    j >= 0 && j < grid[i].length &&
    grid[i][j] === target
  );
}

function gridCode(grid, i, j, target) {
  // Form a 4-digit code from neighbors of grid[i][j]
  let northBit, southBit, eastBit, westBit;
  northBit = southBit = eastBit = westBit = false;
  if(gridCheck(grid, i-1, j, target)){northBit = true;}
  if(gridCheck(grid, i, j+1, target)){eastBit = true;}
  if(gridCheck(grid, i+1, j, target)){southBit = true;}
  if(gridCheck(grid, i, j-1, target)){westBit = true;}
  
  let code = (westBit << 0) + (southBit << 1) + (eastBit << 2) + (northBit << 3);
  return code;
}

function drawContext(grid, i, j, target, ti, tj) {
  let code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code];
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
}

const lookup = [  // [right/left,down/up]
  [0,0],   //  0, code:0000
  [-1,0],  //  1, code:0001
  [0,1],   //  2, code:0010
  [-1,1],  //  3, code:0011
  [1,0],   //  4, code:0100
  [0,0],   //  5, code:0101
  [1,1],   //  6, code:0110
  [0,0],   //  7, code:0111, NO TILE
  [-5,-1],  //  8, code:1000
  [-5,-1], //  9, code:1001
  [0,0],    // 10, code:1010
  [0,0],    // 11, code:1011, NO TILE
  [-5,-1],  // 12, code:1100
  [0,0],   // 13, code:1101, NO TILE
  [0,0],   // 14, code:1110, NO TILE
  [0,0]    // 15, code:1111
];

function drawDarknessOverlay() {
  let darkness = createGraphics(width, height);
  darkness.background(0);
  darkness.noStroke();
  darkness.erase();
  darkness.ellipse(mouseX, mouseY, lightRadius * 2);
  darkness.noErase();
  image(darkness, 0, 0);
}