/// <reference path="../../../../lib/p5.js/TSDef/p5.global-mode.d.ts" />

"use strict";

var canvasScale = 5;
var dx, dy;
var pmouseX, pmouseY;
var drawing = false;

var vines = [];
var noiseGen = [];

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth-80, windowHeight-80);
  fill(0, 138, 46);
  stroke(0, 138, 46);
  strokeWeight(0.3);
  frameRate(60);

  for(var i = 0; i < 3; i++) {
      noiseGen.push(new NoiseGen(2, 0.5, 0.065, 3.8));
  }

  pmouseX=mouseX, pmouseY=mouseY;
}

function draw() {
  scale(canvasScale);
    background(255);
    
    dx = mouseX-pmouseX;
    dy = mouseY-pmouseY;
    if((dx||dy) && mouseIsPressed) {
        if(!drawing) {
            drawing = true;
            vines.push(new Vine(createVector(
                mouseX/canvasScale, mouseY/canvasScale)));
        } else {
            vines[vines.length-1].grow(createVector(
                dx/canvasScale, dy/canvasScale));
        }
    }
    if(!mouseIsPressed) {drawing=false;}
    
    pmouseX = mouseX;
    pmouseY = mouseY;
    if(vines.length) {vines[vines.length-1].draw();}
    
    scale(1/canvasScale);
}

class Vine {
  constructor(origin) {
    this.origin = origin;
    this.segs = []; // segments
    this.len = 0;
    this.minBranchDist = 15;
  }
  grow(direction) {
    this.segs.push(direction.copy());
    this.len++;
    // branch randomly
    if (random(1) > 0.95 && this.len > this.minBranchDist) {
      this.len %= this.minBranchDist;
      var currBranch = this.segs.pop();
      var fork = this.segs.pop();
      var a = currBranch.heading() - fork.heading();
      var rot = -a / abs(a);
      this.segs.push(fork);
      this.segs.push(this.growNewBranch(fork, rot));
      this.segs.push(currBranch);
    }
  }
  growNewBranch(direction, rot) {
    var newBranch = new Vine(null);
    direction.normalize();
    direction.mult(5);
    var mult = 3;
    var inc = random(0.8);
    var start = random(0.5);
    var n = random(20, 30);
    for (var i = 0; i < n; i++) {
      newBranch.grow(direction);
      direction.rotate(mult * rot);
      mult += map(inc, 0, inc, start, 1);
    }
    return newBranch;
  }
  draw(pos=0) {
    var origin = this.origin.copy();
    var segment = createVector();
    for (var i = 0; i < this.segs.length; i++) {
      if (this.segs[i] instanceof Vine) {
        this.segs[i].origin = origin;
        this.segs[i].draw(pos + 0);
      }
      else {
        var dir = this.segs[i].copy();
        var mag = dir.mag();
        push();
        translate(origin.x, origin.y);
        rotate(dir.heading());
        for (var x = 0; x < mag; x += 0.5) {
          for (var j in noiseGen) {
            rect(x, noiseGen[j].get(x + pos), 1, 1);
          }
        }
        pop();
        origin.add(dir);
        pos += mag;
      }
    }
  }
}
