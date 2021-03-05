/// <reference path="../../../lib/p5.js/TSDef/p5.global-mode.d.ts" />

"use strict";

var projects = document.getElementsByClassName("project-list-item")
for(let i=0; i < projects.length; i++) {
  projects[i].addEventListener("mouseenter", function() {
    newTheme = projectInfo[i].colorTheme
  })
}
document.getElementById("project-list").addEventListener("mouseleave", () => newTheme = originalTheme)


// colors
var originalTheme = 0
var colorTheme = originalTheme
var newTheme = originalTheme

// bubble vars
var bubbles = []
var bubbleDensity = 35000
var bubbleSize = 0.00035
var bubbleRadius

// forces
var drag = 8
var wind = 8
var mouseRepel = 40
var mouseAttract = 40
var mouseInteractionType = 1

class Bubble {
  constructor() {
    this.radius = getRadius()
    this.pos = createVector(random(windowWidth), random(windowHeight+this.radius, windowHeight*2))
    this.vel = createVector()
    this.mass = pow(this.radius, 1.5)
    this.xOff = random(10)
    this.attractive = true
  }
  draw() {
    ellipse(this.pos.x, this.pos.y, this.radius, this.radius)
  }
  update() {
    this.draw()
    if(this.pos.y < -this.radius) {
      this.pos = createVector(random(windowWidth), windowHeight+this.radius)
      this.radius = getRadius()
      this.attractive = true
    }
    this.applyForce(wind)
    var dragForce = createVector(drag/100000 * sq(this.vel.mag())/2 * sq(this.radius))
    dragForce.rotate(this.vel.heading())
    dragForce.mult(-1)
    this.applyForce(dragForce)
    this.pos.add(this.vel)
    this.mouseInteraction()
  }
  applyForce(force) {
    var f = force.copy()
    f.mult(1/this.radius)
    this.vel.add(f)
  }
  mouseInteraction() {
    var d = dist(mouseX, mouseY, this.pos.x, this.pos.y)
    var range = (mouseInteractionType == 1) ? this.radius*0.75 : windowWidth/3
    
    if(d < range) {
      var force
      if(mouseInteractionType == 1) {
        force = mouseRepel.copy()
      }
      else {
        if(d < this.radius/5) {
          this.attractive = false
          return
        }
        if(this.attractive) {
          force = mouseAttract.copy()
        }
        else return
      }
      var angle = atan2(this.pos.y-mouseY, this.pos.x-mouseX)
      force.rotate(angle)
      this.applyForce(force)
    }
  }
}

function changeInteractionType() {
  mouseInteractionType *= -1
  document.getElementById("interactiontype-button").style.background = 
      (mouseInteractionType == 1) ? "hsla("+colorTheme+", 0%, 0%, 0)" : "hsla("+colorTheme+", 100%, 50%, 0.25)"
                                  // repel                attract
}

function getRadius() {
  var r
  do {
    r = pow(random(), 1/2) * bubbleRadius
  } while(r < bubbleRadius/4)
  return r
}

function setup() {
  var c = createCanvas(windowWidth, windowHeight)
  c.parent('background-animation')

  document.getElementById("interactiontype-button")
      .addEventListener("click", changeInteractionType)

  colorMode('hsb')
  noStroke()
  noiseDetail(2, 0.75)

  wind = createVector(0, -wind)
  mouseRepel = createVector(mouseRepel, 0)
  mouseAttract = createVector(-mouseAttract, 0)
  
  var screenArea = windowWidth*windowHeight
  var numBubbles = screenArea/bubbleDensity
  bubbleRadius = screenArea*bubbleSize
  
  while(bubbles.length < numBubbles) {bubbles.push(new Bubble())}
}

function draw() {
  background(colorTheme, 15, 100) // background color
  fill(colorTheme, 100, 100, 0.07) // bubble color
  bubbles.forEach(bubble => bubble.update())

  colorTheme += (newTheme - colorTheme)/20
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup()
}