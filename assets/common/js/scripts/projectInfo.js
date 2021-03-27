var projectInfo = [
  {
    name: "fractal-explorer",
    title: "Fractal Explorer",
    colorTheme: "rgb(255,0,160)",
    tags: [
      "natural",
      "math",
      "interactive"
    ],
    
    description:
    "Utilizes a mathematical method of creating fractals, called the \"<a href='https://en.wikipedia.org/wiki/Chaos_game' target='_blank'>chaos game</a>,\" to create fractals with different polygon frames.",
    
    extraInfo:
    "BACKGROUND\nThe 'Chaos Game' is a simple method of creating fractals of infinite complexity. First, a starting point is placed inside a polygon. Then a random vertex is selected and another point is placed halfway between the previous one and this vertex. Just by repeating this step over and over, a pattern starts developing. After about a million repetitions, a very well defined fractal is visible. By using certain rules, like never choosing the same vertex twice in a row, a whole new fractal can be created. Different polygon frames also yield different fractals. See 'https://en.wikipedia.org/wiki/Chaos_game' for more info.\n\nINSTRUCTIONS\nYou may begin by picking a preset polygon. If you want to make a custom shape, click to place vertices on the canvas and click 'Custom' when you've finished.\nOnce the loading bar is complete, you may click anywhere to zoom in multiple levels.\n\nEXTRA\nFor the triangle preset, there are no rules in place. The fractal created is called 'Serpinski's Triangle.' For polygons with > 3 vertices, a rule is set that no vertex can be picked twice in a row while creating the dots. This rule generally yields more interesting patterns."
  },
  {
    name: "branching-vine",
    title: "Branching Vine",
    colorTheme: "rgb(0,240,0)",
    tags: [
      "interactive",
      "natural"
    ],

    description:
    "Uses the Perlin Noise technique to generate a natural looking vine pattern.",

    extraInfo:
    "BAKCGROUND\nThe Perlin Noise function is often used when simulating the natural world to create natural-looking patterns and formations, from rolling hills, to ocean waves, to procedurally generated textures like clouds. This program takes advantage of this by overlaying three noise functions on top of each other to simulate a natural tangled vine appearance.\n\nINSTRUCTIONS\nBegin by dragging your mouse across the canvas. Along the path you draw, three Perlin noise functions are overlayed to give the appearance of a tangled vine. Randomly, curled branches will grow from the path you draw. Sometimes the branches will spawn new branches. Due to optimization issues, longer vines will start create lag, so just release the mouse and click and drag to create a new vine."
  },
  {
    name: "perlin-wave",
    title: "Perlin Wave",
    colorTheme: "rgb(0,190,170)",
    tags: [
      "natural",
      "math",
      "animation"
    ],
    
    description:
    "An animation that demonstrates the Perlin Noise function.",
    
    extraInfo:
    "This is a simple, satisfying animation created using the Perlin Noise function. The function takes a 3D vector as an input, and so while the wave is moving along in two dimensions, the third is used to 'warp' the existing wave as it moves along."
  },
  {
    name: "dijkstra",
    title: "Dijkstra Path Finder",
    colorTheme: "rgb(66,66,255)",
    tags: [
      "algorithm",
      "interactive"
    ],
    
    description:
    "A web of dots is generated. The program uses Dijkstra's pathfinding algorithm to find the shortest path between any two nodes.",
    
    extraInfo:
    "Dijkstra's algorithm is used to find the shortest path between two nodes in a bidirectional graph. In this program, a large graph of nodes and edges is created. Click any two nodes, and the shortest possible path between them will be highlighted in blue. If there is no path available an alert will pop up. This happens if one or both of your points is on an 'island' that is isolated from the other node."
  },
  {
    name: "sunflower",
    title: "Sunflower Disk",
    colorTheme: "rgb(237, 235, 0)",
    tags: [
      "natural",
      "math",
      "animation"
    ],
    
    description:
    "The <a href='https://en.wikipedia.org/wiki/Golden_ratio' target='_blank'>Golden Ratio</a> is used to create a pattern such as those seen in the disk florets of certain flowers in the Asteraceae family, like <a href='https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Helianthus_whorl.jpg/440px-Helianthus_whorl.jpg' target='_blank'>the sunflower</a>.",
    
    extraInfo:
    "BACKGROUND\nThe 'Golden Ratio' is found in many places in nature, from nautilus shells to petals on a rose. It is also a very important tool for designers who want to make logos and designs that are pleasing to the eye.\nIt is defined as ( 1 + sqrt(5) ) / 2\n\nTHIS PROJECT\nThe Golden Ratio is very clear in the disk florets of flowers in the Asteraceae family, such as sunflowers. The florets are arranged using the ratio because it is a very efficient and compact way of packing them around the center. This program simulates this packing with an animation. Starting from the center, dots are placed in a circular fashion, rotating by the angle of 2PI/goldenRatio each time a dot is placed. The radius is also slightly increased with each dot that is placed. Soon, the pattern appears of the center of a sunflower. See below for a comparison.\nhttps://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Helianthus_whorl.jpg/440px-Helianthus_whorl.jpg"
  },
]

// <a href='LINK_HERE' target='_blank'>TEXT_HERE</a>

function getProject(query) {
  var project = projectInfo[0]
  projectInfo.forEach(function(proj) {
    if(proj.name === query || proj.title === query) {
      project = proj
    }
  })
  return project
}