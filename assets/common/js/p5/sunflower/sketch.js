/// <reference path="../../../../lib/p5.js/TSDef/p5.global-mode.d.ts" />

"use strict";

var goldenRatio = (Math.sqrt(5)+1)/2;

var rotateIncrement = 2*Math.PI/(goldenRatio);
var rotateAmount = 0;
var radius = 0;
var radiusIncrement = 0.6;
var dotSizeCoeff = 3;

function setup() {
  var c = createCanvas(windowWidth, windowHeight)
  c.parent('sketch')
  noStroke();
}

function draw() {
  translate(windowWidth/2, windowHeight/2);
  rotate(rotateAmount);

  fill(255, 255*(1-radius/windowHeight*1.2), 255*(radius/windowHeight*1.3));
  ellipse(0, 0-radius, pow(radius, 0.4)*dotSizeCoeff, pow(radius, 0.4)*dotSizeCoeff);
  
  radius += radiusIncrement;
  rotateAmount += rotateIncrement;
}