/// <reference path="../../../../lib/p5.js/TSDef/p5.global-mode.d.ts" />

"use strict";

var wvlength = 0.0035
var warp = 0

var amp
var bounds=-1
var xOffset = 0
var noiseGen

class NoiseGen {
  constructor(octaves, falloff, wvlength, amp) {
    this.octaves = octaves
    this.falloff = falloff
    this.wvlength = wvlength
    this.amp = amp
    this.start = createVector(random(10), random(10), random(10))
    noiseDetail(octaves, falloff)
    var n = noise(0)
    this.min = n
    this.max = n
    for (var i = 1; i < 10000; i+=0.1) {
      n = noise(i * 0.003)
      if (n < this.min) {
        this.min = n
      }
      if (n > this.max) {
        this.max = n
      }
    }
  }

  get(x=0, y=0, z=0) {
    noiseDetail(this.octaves, this.falloff)
    var n = noise(this.start.x + x * this.wvlength, this.start.y + y * this.wvlength, this.start.z + z * this.wvlength)
    if (n < this.min) {
      this.min = n
    }
    if (n > this.max) {
      this.max = n
    }
    return this.amp * map(n, this.min, this.max, -1, 1)
  }
}

function setup() {
  var c = createCanvas(windowWidth, windowHeight)
  c.parent('sketch')
  noiseDetail(4, 0.5)
  
  strokeWeight(4)
  fill(0, 0, 0, 5)
  background(0)

  amp = height/2
  noiseGen = new NoiseGen(5, 0.6, wvlength, amp)
}

function draw() {
  noStroke()
  rect(0, 0, windowWidth, windowHeight)
  stroke(255)

  for(var x = 0; x < width; x++) {
      line(x, height/2+noiseGen.get(x+xOffset, warp), x+1, height/2+noiseGen.get(x+1+xOffset, warp))
  }
  if(xOffset===0) {background(0)}
  warp += 0.2;
  xOffset += 3;
}