/// <reference path="../../../../lib/p5.js/TSDef/p5.global-mode.d.ts" />


// finds the shortest path btwn 2 selected nodes

var defaultColor;



function setup() {
  var c = createCanvas(windowWidth, windowHeight)
  c.parent('sketch')
  noStroke();
  fill(0);
  background(220, 240, 254);
  
  defaultColor = color(0), selectedColor = color(110, 207, 255);
  NS = new NodeSystem(80, 2, 27, 45);
  NS.draw();
  
}

function mouseClicked() {
  if(mouseX > windowWidth-70) return
  background(220, 240, 254);
  NS.selectNearest(mouseX, mouseY);
  NS.draw();
};

class Node {
  constructor(pos) {
    this.pos = createVector(pos.x, pos.y);
    this.color = defaultColor;
    this.selected = false;
  }
  select() {
    this.selected = !this.selected;
    this.color = (this.selected) ? selectedColor : defaultColor;
  }
  draw() {
    stroke(this.color);
    strokeWeight(10);
    point(this.pos.x, this.pos.y);
  }
}

class NodeSystem {
  constructor(n, e, space, edgeLength) {
    this.nodes = [];
    this.edges = [];
    this.numSelected = 0;
    this.path = null;
    // create nodes
    for (var i = 0; i < n; i++) {
      var pos = createVector(random(50, 375), random(50, 375));
      while (true) {
        var valid = true;
        for (var j in this.nodes) {
          if (this.nodes[j].pos.dist(pos) < space) {
            valid = false;
            break;
          }
        }
        if (valid) {
          break;
        }
        pos = createVector(random(50, 350), random(50, 350));
      }
      this.nodes.push(new Node(pos));
    }
    // create edges
    for (var i = 0; i < n; i++) {
      this.edges[i] = [];
    }
    for (var i in this.nodes) {
      for (var j in this.nodes) {
        var dist = this.nodes[i].pos.dist(this.nodes[j].pos);
        if (i !== j && dist < edgeLength && this.edges[i].length < e) {
          var exists = false;
          for (var k in this.edges[i]) {
            if (this.edges[i][k].ind === j) {
              exists = true;
            }
          }
          if (!exists) {
            this.edges[i].push({ ind: j, dist: dist });
            this.edges[j].push({ ind: i, dist: dist });
          }
        }
      }
    }
  }

  draw() {
    // draw edges
    stroke(0);
    strokeWeight(2);
    for (var i in this.edges) {
      for (var j in this.edges[i]) {
        var i2 = this.edges[i][j].ind;
        var p1 = createVector(this.nodes[i].pos.x, this.nodes[i].pos.y);
        var p2 = createVector(this.nodes[i2].pos.x, this.nodes[i2].pos.y);
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }
    // draw path
    if (this.path !== null) {
      stroke(4, 0, 255);
      strokeWeight(4);
      var prev = this.path.prev;
      var ptr1 = prev[this.path.end];
      var ptr2 = this.path.end;
      // println('PATH FOUND');
      while (ptr1 !== null) {
        // println(ptr2 + " " + ptr1);
        var p1 = createVector(this.nodes[ptr1].pos.x, this.nodes[ptr1].pos.y);
        var p2 = createVector(this.nodes[ptr2].pos.x, this.nodes[ptr2].pos.y);
        line(p1.x, p1.y, p2.x, p2.y);
        ptr2 = ptr1;
        ptr1 = prev[ptr1];
      }
    }
    // draw nodes
    this.nodes.forEach(function (node) { node.draw(); });
  }

  selectNearest(x, y) {
    if (this.numSelected === 2) {
      this.nodes.forEach(function (node) {
        if (node.selected) {
          node.select();
        }
      });
      this.numSelected = 0;
      this.path = null;
    }
    var nearest = { dist: 999, index: -1 };
    for (var i = 0; i < this.nodes.length; i++) {
      var dist = createVector(x, y).dist(this.nodes[i].pos);
      if (dist < nearest.dist) {
        nearest.dist = dist;
        nearest.index = i;
      }
    }
    if (nearest.index === -1) {
      println("error");
    }
    if (this.nodes[nearest.index].selected) {
      this.numSelected--;
    }
    else {
      this.numSelected++;
    }
    this.nodes[nearest.index].select();
    // find path if 2 selected nodes
    if (this.numSelected === 2) {
      for (var i in this.nodes) {
        i = parseInt(i, 10);
        if (this.nodes[i].selected && i !== nearest.index) {
          this.path = this.findPath(i, nearest.index);
        }
      }
    }
  }

  findPath(n1, n2) {
    var n = this.nodes.length;
    var done = new Array(n);
    var dist = new Array(n);
    var prev = new Array(n);
    done.fill(false);
    dist.fill(999);
    prev.fill(null);
    dist[n1] = 0;
    var fringe = [n1];
    // println(n1 + " " + n2);
    while (true) {
      // picking the min dist value in the fringe as the new src node
      var src = { ind: null, val: 999 };
      for (var i in fringe) {
        if (dist[fringe[i]] < src.val) {
          src.ind = fringe[i];
          src.val = dist[fringe[i]];
        }
      }
      // println(src.ind);
      // going through neighbors of src
      for (var i in this.edges[src.ind]) {
        var neighbor = this.edges[src.ind][i];
        if (done[neighbor.ind]) {
          continue;
        }
        // println("-"+neighbor.ind);
        // update dist and prev if necessary
        if (neighbor.dist + dist[src.ind] < dist[neighbor.ind]) {
          dist[neighbor.ind] = neighbor.dist + dist[src.ind];
          prev[neighbor.ind] = src.ind;
        }
        // update fringe
        if (-1 === fringe.indexOf(neighbor.ind)) {
          fringe.push(neighbor.ind);
        }
      }
      // remove src from the fringe & mark it done
      done[src.ind] = true;
      fringe.splice(fringe.indexOf(src.ind), 1);
      // println("fringe: " + fringe);
      if (parseInt(src.ind, 10) === n2) {
        return { prev: prev, start: n1, end: n2 };
      }
      if (fringe.length === 0) {
        console.log("FAILURE");
        return null;
      }
    }
  }
}

