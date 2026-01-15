// SHAPE ORCHESTRA – p5.js version (web / iPad)
// Requires: p5.js + p5.sound

let bg, imgRec;
let recX, recY, recW, recH;
let recOn = false;

let shapes = [];

function preload() {
  // Background + REC
  bg = loadImage("assets/console.png");
  imgRec = loadImage("assets/rec.png");

  // Shape images
  const imgs = {
    circle:   loadImage("assets/circle.png"),
    circle2:  loadImage("assets/circle2.png"),
    cross:    loadImage("assets/cross.png"),
    diamond:  loadImage("assets/diamond.png"),
    heart:    loadImage("assets/heart.png"),
    heart2:   loadImage("assets/heart2.png"),
    lshape:   loadImage("assets/l.png"),
    oval:     loadImage("assets/oral.png"),
    rect:     loadImage("assets/rectangle.png"),
    square:   loadImage("assets/square.png"),
    square2:  loadImage("assets/square2.png"),
    triangle: loadImage("assets/triangle.png")
  };

  // Sounds
  const snd = {
    circle:   loadSound("assets/circleSOUND.wav"),
    circle2:  loadSound("assets/circle2SOUND.wav"),
    cross:    loadSound("assets/crossSOUND.wav"),
    heart:    loadSound("assets/heartSOUND.wav"),
    heart2:   loadSound("assets/heart2SOUND.wav"),
    oval:     loadSound("assets/ovalSOUND.wav"),
    square:   loadSound("assets/squareSOUND.wav"),
    square2:  loadSound("assets/square2SOUND.wav"),
    diamond:  loadSound("assets/diamondSOUND.wav"),
    lshape:   loadSound("assets/lSOUND.wav"),
    rect:     loadSound("assets/rectangleSOUND.wav"),
    triangle: loadSound("assets/triangleSOUND.wav")
  };

  // Store globally
  window._imgs = imgs;
  window._snd = snd;
}

function setup() {
  createCanvas(960, 540);
  imageMode(CORNER);
  noStroke();

  // REC button
  recX = width * 0.91;
  recY = height * 0.35;
  recW = imgRec.width * 0.5;
  recH = imgRec.height * 0.5;

  // Grid layout
  const left   = width  * 0.19;
  const right  = width  * 0.70;
  const top    = height * 0.15;
  const bottom = height * 0.80;

  const cols = 4;
  const rows = 3;

  const cellW = (right - left) / cols;
  const cellH = (bottom - top) / rows;

  const gapX = 1.2;
  const gapY = 1.2;

  const figW = cellW * 0.8 * 1.2;
  const figH = cellH * 0.8 * 1.2;

  const imgs = window._imgs;
  const snd  = window._snd;

  // Row 1
  shapes.push(new ShapeButton("diamond", imgs.diamond,
    left + cellW * 0.5 * gapX, top + cellH * 0.5 * gapY,
    figW, figH, snd.diamond));

  shapes.push(new ShapeButton("rect", imgs.rect,
    left + cellW * 1.5 * gapX, top + cellH * 0.5 * gapY,
    figW, figH, snd.rect));

  shapes.push(new ShapeButton("lshape", imgs.lshape,
    left + cellW * 2.5 * gapX, top + cellH * 0.5 * gapY,
    figW, figH, snd.lshape));

  shapes.push(new ShapeButton("triangle", imgs.triangle,
    left + cellW * 3.5 * gapX, top + cellH * 0.5 * gapY,
    figW, figH, snd.triangle));

  // Row 2
  shapes.push(new ShapeButton("circle", imgs.circle,
    left + cellW * 0.5 * gapX, top + cellH * 1.5 * gapY,
    figW, figH, snd.circle));

  shapes.push(new ShapeButton("heart", imgs.heart,
    left + cellW * 1.5 * gapX, top + cellH * 1.5 * gapY,
    figW, figH, snd.heart));

  shapes.push(new ShapeButton("square", imgs.square,
    left + cellW * 2.5 * gapX, top + cellH * 1.5 * gapY,
    figW, figH, snd.square));

  shapes.push(new ShapeButton("cross", imgs.cross,
    left + cellW * 3.5 * gapX, top + cellH * 1.5 * gapY,
    figW, figH, snd.cross));

  // Row 3
  shapes.push(new ShapeButton("square2", imgs.square2,
    left + cellW * 0.5 * gapX, top + cellH * 2.5 * gapY,
    figW, figH, snd.square2));

  shapes.push(new ShapeButton("oval", imgs.oval,
    left + cellW * 1.5 * gapX, top + cellH * 2.5 * gapY,
    figW, figH, snd.oval));

  shapes.push(new ShapeButton("circle2", imgs.circle2,
    left + cellW * 2.5 * gapX, top + cellH * 2.5 * gapY,
    figW, figH, snd.circle2));

  shapes.push(new ShapeButton("heart2", imgs.heart2,
    left + cellW * 3.5 * gapX, top + cellH * 2.5 * gapY,
    figW, figH, snd.heart2));
}

function draw() {
  imageMode(CORNER);
  image(bg, 0, 0, width, height);

  // REC button
  imageMode(CENTER);
  image(imgRec, recX, recY, recW, recH);

  if (recOn) {
    noFill();
    stroke(255, 230, 150);
    strokeWeight(4);
    rectMode(CENTER);
    rect(recX, recY, recW * 1.15, recH * 1.15, 12);
    noStroke();
  }

  // Shapes
  for (let sb of shapes) {
    sb.display();
  }
}

function mousePressed() {
  userStartAudio();

  // REC first
  if (pointInRect(mouseX, mouseY, recX, recY, recW, recH)) {
    recOn = !recOn;
    return;
  }

  // Shapes
  for (let sb of shapes) {
    if (sb.isInside(mouseX, mouseY)) {
      sb.toggle();
      break;
    }
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

function pointInRect(mx, my, cx, cy, w, h) {
  return (
    mx > cx - w / 2 &&
    mx < cx + w / 2 &&
    my > cy - h / 2 &&
    my < cy + h / 2
  );
}

// ---------- ShapeButton ----------
class ShapeButton {
  constructor(name, img, x, y, w, h, sound) {
    this.name = name;
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.sound = sound;
    this.isOn = false;
  }

  display() {
    imageMode(CENTER);

    if (this.isOn) {
      push();
      tint(255);
      image(this.img, this.x, this.y, this.w, this.h);
      noFill();
      stroke(255, 230, 150);
      strokeWeight(4);
      rectMode(CENTER);
      rect(this.x, this.y, this.w * 1.05, this.h * 1.05, 18);
      pop();
    } else {
      push();
      tint(255, 230);
      image(this.img, this.x, this.y, this.w, this.h);
      pop();
    }
  }

  isInside(mx, my) {
    return (
      mx > this.x - this.w / 2 &&
      mx < this.x + this.w / 2 &&
      my > this.y - this.h / 2 &&
      my < this.y + this.h / 2
    );
  }

  toggle() {
    if (!this.sound) {
      this.isOn = !this.isOn;
      return;
    }

    if (!this.isOn) {
      this.sound.loop();
      this.sound.setVolume(1.0);
      this.isOn = true;
    } else {
      this.sound.stop();
      this.isOn = false;
    }
  }
}