/**
 * All JS for 3D projection onto HTML canvas
 * @author Dan McCarthy
 * @version 1.0
 */

/**
 * Initial Canvas/Camera Setup
 */
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
let camera = [0, 20, 3];

/**
 * Handle Camera Sliders
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

// Define 3D object as group of side lengths
let object = [
  [
    [10, 10, 10],
    [20, 10, 10],
  ],
  [
    [10, 10, 10],
    [10, 20, 10],
  ],
  [
    [10, 10, 10],
    [10, 10, -10],
  ],
  [
    [10, 10, -10],
    [20, 10, -10],
  ],
  [
    [10, 10, -10],
    [10, 20, -10],
  ],
  [
    [20, 20, 10],
    [10, 20, 10],
  ],
  [
    [20, 20, 10],
    [20, 10, 10],
  ],
  [
    [20, 20, 10],
    [20, 20, -10],
  ],
  [
    [20, 10, 10],
    [20, 10, -10],
  ],
  [
    [20, 10, -10],
    [20, 20, -10],
  ],
  [
    [20, 20, -10],
    [10, 20, -10],
  ],
  [
    [10, 20, -10],
    [10, 20, 10],
  ],
];

/**
 * Calculates projection of 3D object using current camera setings
 * @param {Array} object 3D object to be converted to 2D
 */
function calculateProjection(object) {
  let projection = [];

  for (let i = 0; i < object.length; i++) {
    let x1 =
      (object[i][0][0] - camera[0]) *
      ((object[i][0][2] - camera[2]) / object[i][0][2] + camera[0]);
    let y1 =
      (object[i][0][1] - camera[1]) *
        ((object[i][0][2] - camera[2]) / object[i][0][2]) +
      camera[1];

    let x2 =
      (object[i][1][0] - camera[0]) *
        ((object[i][1][2] - camera[2]) / object[i][1][2]) +
      camera[0];
    let y2 =
      (object[i][1][1] - camera[1]) *
        ((object[i][1][2] - camera[2]) / object[i][1][2]) +
      camera[1];

    projection.push([
      [x1, y1],
      [x2, y2],
    ]);
  }

  return projection;
}

/**
 * Update Canvas when settings are changed
 */
function updateCanvas() {
  // Reset canvas before rendering
  clearCanvas();
  let projection = calculateProjection(object);
  console.log(projection);

  for (let i = 0; i < object.length; i++) {
    ctx.beginPath();
    ctx.moveTo(projection[i][0][0], projection[i][0][1]);
    ctx.lineTo(projection[i][1][0], projection[i][1][1]);
    ctx.stroke();
  }
}

/**
 * Remove all content from canvas for rerendering
 */
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
