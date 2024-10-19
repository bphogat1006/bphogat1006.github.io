/// <reference path="../../../../lib/p5.js/TSDef/p5.global-mode.d.ts" />

"use strict";

var x=0, y=0
var total = 0
var maxPoints = 2000000
var interval = 1500

// Affine transformations & probabilities
var p = [0.01, 0.86, 0.93]
// Stem
var f1 = [0,      0,      0,
          0,      0.16,   0]
// Successively smaller leaflets
var f2 = [0.85,   0.04,   0,
          -0.04,  0.85,   1.6]
// Largest left-hand leaflet
var f3 = [0.2,    -0.26,  0,
          0.23,   0.22,   1.6]
// Largest right-hand leaflet
var f4 = [-0.15,  0.28,   0,
          0.26,   0.24,   0.44]

function setup() {
  var c = createCanvas(windowWidth, windowHeight)
  c.parent('sketch')
  background(50)
}

function drawPoint() {
  stroke(0, 255, 0, 10)
  strokeWeight(1)
  var paddingX = 30
  var paddingY = 5
  let px = map(x, -2.182, 2.6558, width*paddingX/100, width*(1-paddingX/100));
  let py = map(y, 0, 9.9983, height*(1-paddingY/100), height*paddingY/100);
  point(px, py)
}

function nextPoint() {
  var r = random(), x2, y2
  if(r < p[0]) {
    x2 = f1[0]*x + f1[1]*y + f1[2]
    y2 = f1[3]*x + f1[4]*y + f1[5]
  }
  else if(r < p[1]) {
    x2 = f2[0]*x + f2[1]*y + f2[2]
    y2 = f2[3]*x + f2[4]*y + f2[5]
  }
  else if(r < p[2]) {
    x2 = f3[0]*x + f3[1]*y + f3[2]
    y2 = f3[3]*x + f3[4]*y + f3[5]
  }
  else {
    x2 = f4[0]*x + f4[1]*y + f4[2]
    y2 = f4[3]*x + f4[4]*y + f4[5]
  }
  x = x2
  y = y2
}

function draw() {
  for(var i=0; i < interval; i++) {
    drawPoint()
    nextPoint()
  }
  total += interval
  if(total > maxPoints) {
    noLoop()
    console.log(millis())
    // saveCanvas()
    rect(0, 0, 1, 1)
  }
}