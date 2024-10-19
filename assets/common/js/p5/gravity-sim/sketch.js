/// <reference path="../../../../lib/p5.js/TSDef/p5.global-mode.d.ts" />

"use strict";


/** Settings */

// constants
var G = 0.005; // Gravitational constant
var Density = 0.0050; // planet density constant

// rules
var gravBetweenPlanets = true; // enable/disable gravity between the planets
  


/**
 * Functions to make different calculations for the program
 */
// the flashing animation for the selected planet
function flash(rate) {
  var i = floor(millis()/1000*rate%2);
  
  switch(i) {
      
      case 0:
          return true;
      
      case 1:
          return false;
  }
};
// find the radius of the planet in pixels, given its mass and density
function findRadius(mass, density) {
  var r = pow((3*mass)/(4*3.14*density), 1/3);
  return r;
};
// find the angle between two planets
function findAngle(planet1, planet2) {
  var a = atan((planet2.y-planet1.y)/(planet2.x-planet1.x));
  if(planet1.x>planet2.x) {a+=180;}
  
  return a;
};
// find acceleration of planet 1 due to gravity of planet 2
function findGravField(planet1, planet2) {
  var r = dist(planet1.x, planet1.y, planet2.x, planet2.y);
  var a = findAngle(planet1, planet2);
  var grav = G * (planet2.mass / sq(r));
  var g = [grav*cos(a), grav*sin(a)];
  
  return g;
};
// find the velocity needed to stay in a circular orbit
function findCircleVelocity(planet1, planet2) {
  var r = dist(planet1.x, planet1.y, planet2.x, planet2.y);
  var a = findAngle(planet1, planet2);
  var vel = sqrt(G * planet2.mass / r);
  var v = [vel*cos(a+90), vel*sin(a+90)];
  
  return v;
};
// fix the planets' orbits around the sun if they get out of orbit
function resetOrbits(planets) {
  for(var i in planets) {
      for(var j in planets) {
          if(planets[i].immovable===false && planets[j].immovable) {
              var g = findCircleVelocity(planets[i], planets[j]);
              planets[i].vx = g[0];
              planets[i].vy = g[1];
          }
      }
  }
};

/**
 * System to show messages to the user in the top-left corner
 */
class Toast {
  constructor(string, length) {
    this.string = string;
    if(length) {
        this.length = length;
    }else{
        this.length = 150;
    }
  }
  show() {
    fill(0, 207, 173, this.length*10);
    textSize(20);
    text(this.string, 20, 34);
    this.length -= 1;
  };
};

/**
 * The Planet class
 */
class Planet {
  constructor(x, y, vx, vy, mass, Color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;
    this.immovable = false;
    this.Color = Color;
  };
  // draw the planet on the canvas
  draw(thisPlanet, selectedPlanet) {
    
    if(thisPlanet === selectedPlanet) {
        if(flash(3)) {
            fill(this.Color);
        } else {
            fill(255);
        }
    } else {fill(this.Color);}
    
    noStroke();
    
    var radius = findRadius(this.mass, Density);
    ellipse(this.x, this.y, radius, radius);
  };
  // change a planet's velocity given its acceleration
  changeVelocity(planet, gravBetweenPlanets) {
    if(gravBetweenPlanets===false && planet.immovable===false) {}
    else if(this.immovable===false) {
        var g = findGravField(this, planet);
        this.vx += g[0];
        this.vy += g[1];
    }
  };
  // change a planet's position given its velocity
  move() {
    this.x += this.vx;
    this.y += this.vy;
  };
}



// variables
var numSettings = 1;
var settingsNames = ["mass", ];
var currentSetting = 0;
var increment = [20, ]; // [mass, ]

// settings
var zoom = false;
var paused = false;
var selectedPlanet = 0;
var frameByFrame = false;
var changingVelocity = false;
var coords = {init: null, final: null};

// objects
var scene = "sun"; // "sun", "planets", "animate"
var toasts = [];
var planets = [];



function setup() {
  var c = createCanvas(windowWidth, windowHeight)
  c.parent('sketch')
  angleMode(DEGREES)
  toasts.push(new Toast("Click to create a Sun", 300))
  planets.push(new Planet(100000, 100000, 0, 0, color(0)))
}

function draw() {
    
  background(255);
  
  // zoom in/out
  resetMatrix();
  if(zoom) {
      scale(0.25);
      translate(600, 600);
  }
  
  // draw planets & change their velocity
  for(var i in planets) {
      
      for(var j in planets) {
          
          if(i===j){continue;}
          
          if(scene === "animate" && paused === false) {
              planets[i].changeVelocity(planets[j], gravBetweenPlanets);
          }
          
          planets[i].draw(i, selectedPlanet);
          
      }
      
      if(paused === false) {
          planets[i].move();
      }
      
  }
  
  // frame by frame option
  if(frameByFrame) {
      frameByFrame = false;
      paused = true;
  }
  
  // change velocity of a planet
  if(changingVelocity && selectedPlanet) {
      if(coords.init) {
          stroke(0);
          line(coords.init[0], coords.init[1], mouseX, mouseY);
      }
  } else if(coords.final) {
      var vScale = 0.02;
      planets[selectedPlanet].vx = vScale * (coords.final[0] - coords.init[0]);
      planets[selectedPlanet].vy = vScale * (coords.final[1] - coords.init[1]);
      
      coords.init = null;
      coords.final = null;
  }
  
  // show latest toast
  toasts[toasts.length-1].show();
  
  // println(mouseX + " " + mouseY);
};


// mouse interaction
function mouseClicked() {
  if(mouseX > windowWidth-70) return
    
  // mouse clicks do different things depending on the current scene
  switch (scene) {
      
      case "sun":
          
          // create the sun
          planets.push(new Planet(mouseX, mouseY, 0, 0, 20000, color(230, 230, 0)));
          planets[planets.length-1].immovable = true;
          
          toasts.push(new Toast("Click to add Planets"));
          
          scene = "planets";
          
          break;
      
      
      case "planets":
          
          // create a new planet
          planets.push(new Planet(mouseX, mouseY, 0, 0, 21, color(
              random(50, 200), random(50, 200), random(50, 200))));
          
          toasts.push(new Toast("Press Space to continue"));
          
          break;
      
      
      case "animate":
          
          // select a planet
          if(changingVelocity === false) {
              var currentPlanet = selectedPlanet;
              var minDistance = 100000;
              
              for(var i in planets) {
                  
                  var d = dist(planets[i].x, planets[i].y, mouseX, mouseY);
                  
                  if(d < minDistance) {
                      minDistance = d;
                      selectedPlanet = i;
                  }
              }
              
              if(currentPlanet===selectedPlanet) {
                  selectedPlanet = 0;
                  // toasts.push(new Toast(""));
              }
          }
          
          break;
      
  }
  
};

function keyPressed() {
    
  // options
  switch (keyCode) {
      
      case 72: // 'h'
          
          var t = "Pause 'p'\n"+
                  "Zoom in/out 'z'\n"+
                  "Reset orbits 'r'\n"+
                  "Frame by frame '.'\n"+
                  "\nOR\n\n" +
                  "Click to select a planet.\n" +
                  "Use the arrow keys to\nchange its properties.\n" +
                  "Change its speed with 'v'";
          
          toasts.push(new Toast(t, 700));
          
          break;
      
      case 32: // space
          
          if(scene==="planets" && planets.length > 2) {
              resetOrbits(planets);
              scene="animate";
              toasts.push(new Toast("Press 'h' for help"));
          }
          
          if(scene==="sun") {
              scene="planets";
          }
          
          break;
      
      case 90: // 'z'
          
          zoom = (zoom) ? false: true;
          
          break;
      
      case 80: // 'p'
          
          if(paused) {paused = false;}
          else {paused = true;}
          
          break;
      
      case 82: // 'r'
          
          resetOrbits(planets);
          
          break;
      
      case 190: // '.'
          
          frameByFrame = true;
          paused = false;
          
          break;
      
      case 86: // 'v'
          
          changingVelocity = (changingVelocity) ? false : true;
          
          if(changingVelocity) {
              toasts.push(new Toast("Draw a line"));
              paused = true;
          } else {
              toasts.push(new Toast("Cancelled.", 100));
              paused = false;
          }
          
          break;
      
  }
  
  // settings for arrow keys
  if(selectedPlanet) {
      
      switch (keyCode) {
          
          case 37: // left
              
              currentSetting = (currentSetting) ? currentSetting-1 : numSettings-1;
              
              break;
          
          case 39: // right
              
              currentSetting = (currentSetting===numSettings-1) ? 0 : currentSetting+1;
              
              break;
          
          case 38: // up
              
              switch (currentSetting) {
                  
                  case 0: // change mass
                      
                      planets[selectedPlanet].mass += increment[currentSetting];
                      toasts.push(new Toast(planets[selectedPlanet].mass));
                      
                      break;
                  
              }
              
              break;
          
          case 40: // down
              
              switch (currentSetting) {
                  
                  case 0: // change mass
                      
                      planets[selectedPlanet].mass -= increment[currentSetting];
                      toasts.push(new Toast(planets[selectedPlanet].mass));
                      
                      break;
                  
              }
              
              break;
          
          
          
      }
      
  }
  
  // toast for which setting is currently being adjusted
  if(keyCode === 37 || keyCode === 39) { // 'up' or 'down'
      switch(currentSetting) {
          case 0:
              toasts.push(new Toast("Mass"));
              break;
      }
  }
  
  // println(keyCode);
  
};