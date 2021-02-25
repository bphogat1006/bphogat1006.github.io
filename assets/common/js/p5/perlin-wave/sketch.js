/// <reference path="../../../../lib/p5.js/TSDef/p5.global-mode.d.ts" />

"use strict";

var wvlength = 0.0035
var warp = 0

var amp
var bounds=-1
var xOffset = 0
var noiseGen

function setup() {
  createCanvas(1920, 600)
  frameRate(60)
  noiseDetail(4, 0.5)
  
  strokeWeight(4)
  fill(0, 0, 0, 5)
  background(0)

  amp = height/2
  noiseGen = new NoiseGen(5, 0.6, wvlength, amp)
}

function draw() {
  noStroke()
  rect(0, 0, width, height)
  stroke(255)

  for(var x = 0; x < width; x++) {
      line(x, height/2+noiseGen.get(x+xOffset, warp), x+1, height/2+noiseGen.get(x+1+xOffset, warp))
  }
  if(xOffset===0) {background(0)}
  warp += 0.2;
  xOffset += 3;
}