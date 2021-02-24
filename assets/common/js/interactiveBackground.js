/// <reference path="../../lib/p5.js/TSDef/p5.global-mode.d.ts" />

"use strict";

var bubbles = [];
var bubbleDensity = 30000
var numBubbles;
var speed = 0.20
var windSpeed = 0.1
var mouseRepelStrength = 0.005
var noiseSpeed = 0.003
var noiseAmplitude = 350

class Bubble {
  constructor() {
    this.radius = random(75, 300)
    this.pos = createVector(random(windowWidth), 
        windowHeight+this.radius+random(0.03*pow(this.radius, 2)))
    this.vel = createVector()
    this.xOff = random(10)
  }
  draw() {
    var n = noise(this.xOff)*noiseAmplitude
    ellipse(this.pos.x + n, this.pos.y, this.radius, this.radius)
    this.mouseInteraction()
    this.update()
  }
  update() {
    if(this.pos.y < -this.radius) {
      this.pos = createVector(random(windowWidth), windowHeight+this.radius)
    }
    this.vel.add(createVector(0, -windSpeed))
    this.vel.limit(pow(this.radius, 0.5)*speed) // pow balances speed btwn small & big bubbles
    this.pos.add(this.vel)
    this.xOff += noiseSpeed
  }
  mouseInteraction() {
    var n = noise(this.xOff)*noiseAmplitude
    var d = dist(mouseX, mouseY, this.pos.x+n, this.pos.y)
    if(d < this.radius) {
      var r = this.radius-d
      var repelForce = createVector(r*mouseRepelStrength)
      var angle = atan2(this.pos.y-mouseY, this.pos.x+n-mouseX)
      repelForce.rotate(angle)
      this.vel.add(repelForce)
    }
  }
}

function setup() {
  var c = createCanvas(windowWidth, windowHeight)
  c.parent('background-animation')
  background(255, 240, 240);
  noiseDetail(2, 0.75)
  
  numBubbles = windowWidth*windowHeight/bubbleDensity
  print(numBubbles)
  for(var i=0; i < numBubbles; i++) {
    bubbles.push(new Bubble())
  }
  noStroke()
  fill(255, 0, 0, 20)
}

function draw() {
  background(255, 240, 240);
  bubbles.forEach(bubble => bubble.draw())
}