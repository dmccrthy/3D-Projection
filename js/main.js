/**
 * All the JS for 3D projection onto HTML canvas
 * @author Dan McCarthy
 * @version 1.1
 */

/**
 * Initial Canvas/Camera Setup
 */
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

let screen = [0, 0, 0];
let focalLength = 30;

let xRotation = 0;
let yRotation = 0;
let zRotation = 0;

let rotated = [];

function rotateVertex(theta) {
  let x = 1;
  let y = 1;
  let z = 1;

  rotated = [];

  for (let i = 0; i < vertexTable.length; i++) {
    y = Math.abs(
      vertexTable[i][1] * Math.cos(theta) +
        vertexTable[i][1] * (-1 * Math.sin(theta))
    );
    z = Math.abs(
      vertexTable[i][2] * Math.sin(theta) + vertexTable[i][2] * Math.cos(theta)
    );

    rotated.push([vertexTable[i][0], y, z]);
  }

  console.log(rotated);
}

/**
 * Handle Camera Rotation Sliders
 */
const xSlider = document.getElementById("x-slider");
const ySlider = document.getElementById("y-slider");
const zSlider = document.getElementById("z-slider");

xSlider.onchange = function () {
  rotateVertex(xSlider.value);
  updateCanvas();
};

ySlider.onchange = function () {
  camera[1] = ySlider.value;
  updateCanvas();
};

zSlider.onchange = function () {
  camera[2] = zSlider.value;
  updateCanvas();
};

/**
 * Define 3D object as group of points (Vertex Table)
 * Define which points in vertex table are connected (Edge Table)
 */
let presets = [
  // Each preset is stored as [[vertex-table], [edge-table]]
  [
    // Square preset
    [
      [100, 100, 0],
      [200, 100, 0],
      [100, 200, 0],
      [200, 200, 0],
      [100, 100, -10],
      [200, 100, -10],
      [100, 200, -10],
      [200, 200, -10],
    ],
    [
      [0, 1],
      [0, 2],
      [0, 4],
      [1, 3],
      [1, 5],
      [2, 3],
      [2, 6],
      [3, 7],
      [4, 5],
      [4, 6],
      [5, 7],
      [6, 7],
    ],
  ],
  [
    // Triangle preset
    [
      [200, 300, 0],
      [300, 300, 0],
      [250, 150, -3],
      [200, 300, -6],
      [300, 300, -6],
    ],
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [2, 1],
      [2, 3],
      [4, 3],
      [4, 2],
      [4, 1],
    ],
  ],
];

// Default preset is square
let vertexTable = presets[0][0];
let edgeTable = presets[0][1];

/**
 * Change the currently used preset
 */
function updatePreset(preset) {
  let buttons = document.getElementById("presets");

  for (let i = 0; i < buttons.children.length; i++) {
    buttons.children[i].classList.remove("selected");
  }

  switch (preset) {
    case "square":
      buttons.children[0].classList.add("selected");
      vertexTable = presets[0][0];
      edgeTable = presets[0][1];
      updateCanvas();
      break;
    case "triangle":
      buttons.children[1].classList.add("selected");
      vertexTable = presets[1][0];
      edgeTable = presets[1][1];
      updateCanvas();
      break;
  }
}

/**
 * Calculates projection of 3D object using current camera setings
 * @param {Array} point A point from the vertex table
 * @returns {Array} X, and Y projection of 3D point
 */
function calculateProjection(point) {
  let x = (focalLength * point[0]) / (focalLength + point[2]);
  let y = (focalLength * point[1]) / (focalLength + point[2]);

  return [x, y];
}

/**
 * Update Canvas when settings are changed
 */
function updateCanvas() {
  // Reset canvas before rendering
  clearCanvas();

  // Get 2D projection of points
  let projection = [];
  for (let i = 0; i < vertexTable.length; i++) {
    projection.push(calculateProjection(vertexTable[i]));
  }
  console.log(projection);

  // Use edge table to draw lines on canvas
  for (let i = 0; i < edgeTable.length; i++) {
    ctx.beginPath();
    ctx.moveTo(projection[edgeTable[i][0]][0], projection[edgeTable[i][0]][1]);
    ctx.lineTo(projection[edgeTable[i][1]][0], projection[edgeTable[i][1]][1]);
    ctx.stroke();
  }
}

/**
 * Remove all content from canvas for rerendering
 */
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

rotateVertex(0);
updateCanvas();
