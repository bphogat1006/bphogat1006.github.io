/// <reference path="../../../lib/p5.js/TSDef/p5.global-mode.d.ts" />

"use strict";

var bubbles = []
var bubbleDensity = 25000
var numBubbles
var bubbleRadius
var speed = 0.040
var windSpeed = 0.1
var noiseSpeed = 0.003
var noiseAmplitude = 350
var mouseRepelStrength = 0.002
var mouseAttractStrength = 0.002
var mouseInteractionType = 1

class Bubble {
  constructor() {
    this.radius = getBubbleRadius()
    this.pos = createVector(random(windowWidth), 
        windowHeight+this.radius+random(0.03*pow(this.radius, 2)))
    this.vel = createVector()
    this.xOff = random(10)
    this.attractive = true
  }
  draw() {
    var n = noise(this.xOff)*noiseAmplitude
    ellipse(this.pos.x + n, this.pos.y, this.radius, this.radius)
  }
  update() {
    this.draw()
    if(this.pos.y < -this.radius) {
      this.pos = createVector(random(windowWidth), windowHeight+this.radius)
      this.size = getBubbleRadius()
      this.attractive = true
    }
    this.vel.add(createVector(0, -windSpeed))
    this.vel.limit(pow(this.radius, 0.8)*speed) // pow balances speed btwn small & big bubbles
    this.pos.add(this.vel)
    this.xOff += noiseSpeed
    this.mouseInteraction()
  }
  mouseInteraction() {
    var n = noise(this.xOff)*noiseAmplitude
    var d = dist(mouseX, mouseY, this.pos.x+n, this.pos.y)
    var range = (mouseInteractionType == 1) ? this.radius : windowWidth/3
    
    if(d < range) {
      var r = range-d
      var force = createVector()

      if(mouseInteractionType == 1) {
        force = createVector(r * mouseRepelStrength)
      }
      else {
        if(d < this.radius/5) {this.attractive = false}
        if(this.attractive) {force = createVector(-r * mouseAttractStrength)}
      }

      var angle = atan2(this.pos.y-mouseY, this.pos.x+n-mouseX)
      force.rotate(angle)
      this.vel.add(force)
    }
  }
}

function getBubbleRadius() {
  return pow(random(), 1/3) * bubbleRadius
}

function changeInteractionType() {
  mouseInteractionType *= -1
  document.getElementById("interactiontype-button").style.background = 
      (mouseInteractionType == 1) ? "rgb(255, 240, 240)" : "rgb(255, 200, 200)"
}

function setup() {
  var c = createCanvas(windowWidth, windowHeight)
  c.parent('background-animation')
  noiseDetail(2, 0.75)
  
  var screenArea = windowWidth*windowHeight
  numBubbles = screenArea/bubbleDensity
  bubbleRadius = screenArea/4000
  // print(bubbleRadius + "\n" + numBubbles)
  while(bubbles.length < numBubbles) {
    bubbles.push(new Bubble())
  }

  noStroke()
  fill(255, 0, 0, 15)

  document.getElementById("interactiontype-button")
      .addEventListener("click", changeInteractionType)
}

function draw() {
  background(255, 240, 240);
  bubbles.forEach(bubble => bubble.update())
}