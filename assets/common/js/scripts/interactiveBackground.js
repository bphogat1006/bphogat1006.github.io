/// <reference path="../../../lib/p5.js/TSDef/p5.global-mode.d.ts" />

"use strict";

var colorTheme = 0 // hue
var bubbleColor, backgroundColor
var bubbles = []
var bubbleDensity = 30000
var bubbleSizeCoeff = 0.00030
var numBubbles
var bubbleRadius
var speed = 0.018
var windSpeed = 0.13
var noiseSpeed = 0.003
var noiseAmplitude = 350
var mouseRepelStrength = 0.002
var mouseAttractStrength = 0.002
var mouseInteractionType = 1

class Bubble {
  constructor() {
    this.radius = pow(random(), 1/3) * bubbleRadius
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
      this.size = pow(random(), 1/3) * bubbleRadius
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
    var d = dist(mouseX, mouseY, this.pos.x + n, this.pos.y)
    var range = (mouseInteractionType == 1) ? this.radius*1.10 : windowWidth/3
    
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

function changeInteractionType() {
  mouseInteractionType *= -1
  document.getElementById("interactiontype-button").style.background = 
      (mouseInteractionType == 1) ? "hsla(0, 0%, 0%, 0)" : "hsla(0, 100%, 50%, 0.25)"
                                  // repel                attract
}

function setup() {
  var c = createCanvas(windowWidth, windowHeight)
  c.parent('background-animation')

  document.getElementById("interactiontype-button")
      .addEventListener("click", changeInteractionType)

  colorMode('hsb')
  backgroundColor = color(colorTheme, 20, 100)
  bubbleColor = color(colorTheme, 100, 100, 0.05)
  noiseDetail(2, 0.75)
  noStroke()
  
  var screenArea = windowWidth*windowHeight
  numBubbles = screenArea/bubbleDensity
  bubbleRadius = screenArea*bubbleSizeCoeff
  
  while(bubbles.length < numBubbles) {bubbles.push(new Bubble())}
}

function draw() {
  background(backgroundColor) // background color
  fill(colorTheme, 255, 255, 0.05) // bubble color
  bubbles.forEach(bubble => bubble.update())
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup()
}