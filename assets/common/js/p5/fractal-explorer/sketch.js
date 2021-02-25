/// <reference path="../../../../lib/p5.js/TSDef/p5.global-mode.d.ts" />

"use strict";

var DETAIL_LEVEL = 2000; // number of dots drawn (times 1000)
var DRAW_SPEED = 10000; // 10000 recommended
var DOT_SIZE = 1; // use higher values for low detail level
var MAX_ZOOM_LEVEL = 6;













var vertices = [];
var dots = [];
var maxDots = DETAIL_LEVEL*1000;
var newDotsPerFrame = DRAW_SPEED; //dots created per frame initially
var tracer;
var curr=0, prev=0, prev2=0;
var animate = false;


var bufferStart = 0;
var bufferSize = 5000; //dots drawn per frame (while zooming in)

var zoomLevel = 0;
var maxZoomLevel = MAX_ZOOM_LEVEL;
var zoomPoint;
var zoomChanged = false;

var shapePresets = [];
var windowDiagonal;


class Button {
  constructor(msg, x, y, w) {
    this.msg = msg;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 36;
  }
  draw() {
    noStroke();
    fill(194, 252, 255);
    rect(this.x, this.y, this.w, this.h);
    fill(0);
    textSize(22);
    text(this.msg, this.x+10, this.y+26);
  }
  pressed() {
    if(mouseIsPressed && mouseX>this.x && mouseX<this.x+this.w && mouseY>this.y && mouseY<this.y+this.h)
      return true;
    else return false;
  }
}


function setup() {
  createCanvas(windowWidth-10, windowHeight-10);
  angleMode(DEGREES);
  frameRate(999)

  windowDiagonal = sqrt(pow(windowWidth, 2) + pow(windowHeight, 2));
  shapePresets = [
    new Button("Triangle", 23, 20, 97),
    new Button("Square", 170, 20, 91),
    new Button("Pentagon", 312, 20, 114),
    new Button("Custom", 477, 20, 100)
  ];
  tracer = createVector(300, 300);
  zoomPoint = createVector()
}

function drawPoint(vector) {
  point(vector.x, vector.y);
}


function draw() {
  // pick vertices
  if(!animate) {
    shapePresets.forEach(button => button.draw());
    // triangle
    if(shapePresets[0].pressed()) {
      vertices = [createVector(width/2, 100),
        createVector(width/2-(height-200)/sqrt(3), height-100),
        createVector(width/2+(height-200)/sqrt(3), height-100)];
      animate = true;
      background(255);
    }
    // square
    if(shapePresets[1].pressed()) {
      var size = (width < height) ? (width-200)/2 : (height-200)/2;
      vertices = [createVector(width/2-size, height/2-size),
        createVector(width/2+size, height/2-size),
        createVector(width/2+size, height/2+size),
        createVector(width/2-size, height/2+size)];
      animate = true;
      background(255);
    }
    // pentagon
    if(shapePresets[2].pressed()) {
      var apothem = height/2-50;
      vertices = [
        createVector(width/2, height/2-apothem),
        createVector(width/2+2*apothem*cos(54)*sin(54), height/2-(apothem-2*apothem*cos(54)*cos(54))),
        createVector(width/2+apothem*cos(54),  height/2+apothem*sin(54)),
        createVector(width/2-apothem*cos(54), height/2+apothem*sin(54)),
        createVector(width/2-2*apothem*cos(54)*sin(54), height/2-(apothem-2*apothem*cos(54)*cos(54)))];
      animate = true;
      background(255);
    }
    // custom shape
    if(shapePresets[3].pressed()) {
      animate = true;
      vertices.pop();
      background(255);
    }
  }

  // draw points
  else {
    stroke(0);
    strokeWeight(DOT_SIZE);
    
    // create new dots
    for(var i = 0; i < newDotsPerFrame && dots.length < maxDots; i++) {
      
      // pick new vertex
      prev2 = prev;
      prev = curr;
      curr = floor(random()*vertices.length);
      
      // RULES

      // don't pick the same vertex as the previous one
      while(curr === prev) {
        curr = floor(random()*vertices.length);
      }
      
      // don't pick either of the previous 2 vertices
      // while(curr === prev || curr === prev2) {
      //   curr = floor(random()*vertices.length);
      // }
      
      // next vertex cannot be one place away (anti-clockwise) from the previous
      // while(curr === (prev-1+vertices.length)%vertices.length) {
      //   curr = floor(random()*vertices.length);
      // }
      

      // move tracer and create new dot
      tracer.x = (tracer.x + vertices[curr].x)/2;
      tracer.y = (tracer.y + vertices[curr].y)/2;
      dots.push(tracer.copy());
    }
    
    
    // draw dots
    if(dots.length < maxDots || zoomChanged || bufferStart<maxDots) {
      if(zoomChanged) {
        background(255);
        bufferStart = 0;
      }
      if(!zoomLevel) {
        // draw most recently created batch of dots
        if(dots.length < maxDots) {
          for(var i=dots.length-newDotsPerFrame; i<dots.length; i++) {
            drawPoint(dots[i]);
          }
        }
        // redraw all dots
        else {
          // draw 1000 points every frame until done
          for(var i=bufferStart; i<bufferStart+bufferSize && i<dots.length; i++) {
            drawPoint(dots[i]);
          }
        }
      } else {
        // draw 1000 dots (scaled) every frame until done
        var dotScaled;
        for(var i=bufferStart; i<bufferStart+bufferSize && i<dots.length; i++) {
          // skip dots outside of view to save cpu
          if(p5.Vector.dist(dots[i], zoomPoint)>windowDiagonal/(zoomLevel+1)) {continue;}
          // calculate dots pos while zoomed in
          dotScaled = dots[i].copy();
          dotScaled.sub(zoomPoint);
          dotScaled.mult(0.7*pow(2, zoomLevel+1));
          dotScaled.add(zoomPoint);
          drawPoint(dotScaled);
        }
      }
      zoomChanged = false;
    }
    // println(dots.length);
  }

  fill(255, 0, 0);
  noStroke();
  for(var i=0; i < vertices.length && !zoomLevel; i++) {
    ellipse(vertices[i].x, vertices[i].y, 10, 10);
  }

  if(bufferStart < maxDots) {
    bufferStart += bufferSize;
  }

  fill(0, 255, 0);
  noStroke();
  var progress = (dots.length < maxDots) ? dots.length/maxDots : bufferStart/maxDots;
  rect(0, 0, progress*width, 15);
};


function mousePressed() {
  if(!animate) {
    vertices.push(createVector(mouseX, mouseY));
  }
  // do not allow zooming until all dots are created
  else if(dots.length >= maxDots) {
    if(!zoomLevel) {
      zoomPoint = createVector(mouseX, mouseY);
    }
    zoomLevel = (zoomLevel+1)%maxZoomLevel;
    zoomChanged = true;
  }
}
