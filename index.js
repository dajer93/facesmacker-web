// this variable will hold our shader object
let theShader;
// this variable will hold our webcam video
let videoInput;

let canvas;

let hits = [];

let colorFactor = 0;

/*
 * **p5.js** library automatically executes the `preload()` function. Basically, it is used to load external files. In our case, we'll use it to load the images for our filters and assign them to separate variables for later use.
 */
function preload() {
  // load the shader
  theShader = loadShader("assets/webcam.vert", "assets/webcam.frag");

  videoInput = createCapture(VIDEO);
  videoInput.size(800, 600);
  videoInput.position(0, 0);
  videoInput.hide();
}

/**
 * In p5.js, `setup()` function is executed at the beginning of our program, but after the `preload()` function.
 */
function setup() {
  pixelDensity(1);
  canvas = createCanvas(800, 600, WEBGL);
  canvas.position(0, 0);

  faceTracker = new clm.tracker();
  faceTracker.init();
  faceTracker.start(videoInput.elt);

  frameRate(30);
}

/*
 * In p5.js, draw() function is executed after setup(). This function runs inside a loop until the program is stopped.
 */
function draw() {
  clear();

  if (!canvas || !videoInput) return;

  shader(theShader);
  theShader.setUniform("tex0", videoInput);
  theShader.setUniform("mixRadius", 28);

  const { minx, miny, maxx, maxy } = getFaceLimits() || {};

  const absoluteHits = [];
  for (let i = 0; i <= hits.length; i = i + 2) {
    if (hits[i] == 0 && hits[i + 1] == 0) return;

    let xValue = round(800 - (minx + hits[i] * (maxx - minx)));
    let yValue = round(600 - (miny + hits[i + 1] * (maxy - miny)));

    if (xValue && yValue) {
      absoluteHits.push(xValue, yValue);
    }

    if (!absoluteHits.length) absoluteHits.push(0, 0);
  }
  // provide the array of hits to the shader as a buffer
  theShader.setUniform("hits", absoluteHits);

  rect(0, 0, width, (width * videoInput.height) / videoInput.width);
}

function mousePressed() {
  const x = 800 - mouseX;
  const y = mouseY;
  const { minx, miny, maxx, maxy } = getFaceLimits() || {};

  // check if click was inside the area of the human face
  if (x > minx && x < maxx && y > miny && y < maxy) {
    let relativeX = (x - minx) / (maxx - minx);
    let relativeY = (y - miny) / (maxy - miny);
    if (hits.length >= 200) {
      hits.shift();
      hits.shift();
    }

    hits.push(relativeX, relativeY);
  }
}

/**
 * getFaceLimits: returns the topmost, bottommost, & widest points of the face shape
 * 
 * @returns Object { minx, maxx, miny, maxy }
 */
function getFaceLimits() {
  const points = faceTracker.getCurrentPosition() || [];

  maxx = 0;
  minx = width;
  maxy = 0;
  miny = height;
  for (var i = 0; i < points.length; i++) {
    if (points[i][0] > maxx) maxx = points[i][0];
    if (points[i][0] < minx) minx = points[i][0];
    if (points[i][1] > maxy) maxy = points[i][1];
    if (points[i][1] < miny) miny = points[i][1];
  }
  minx = Math.floor(minx);
  maxx = Math.ceil(maxx);
  miny = Math.floor(miny);
  maxy = Math.ceil(maxy);

  return {
    minx,
    maxx,
    miny,
    maxy,
  };
}

function windowResized() {
  pixelDensity(1);
  resizeCanvas(width, height);
}
