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

/**
 * Handle Camera Rotation Sliders
 */
const xSlider = document.getElementById("x-slider");
const ySlider = document.getElementById("y-slider");
const zSlider = document.getElementById("z-slider");

xSlider.onchange = function () {
  camera[0] = xSlider.value;
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
let vertexTable = [
  [100, 100, 0],
  [200, 100, 0],
  [100, 200, 0],
  [200, 200, 0],
  [100, 100, -10],
  [200, 100, -10],
  [100, 200, -10],
  [200, 200, -10],
];

// Edge table uses indexs from vertex table
let edgeTable = [
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
];

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

updateCanvas();
