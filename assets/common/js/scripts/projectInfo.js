var projectInfo = [
  {
    name: "fractal-explorer",
    title: "Fractal Explorer",
    description: "Utilizes a mathematical method of creating fractals, called the \"<a href='https://en.wikipedia.org/wiki/Chaos_game' target='_blank'>chaos game</a>,\" to create fractals with different polygon frames.",
    extraInfo: "",
    colorTheme: "rgb(255,0,160)",
    tags: [
      "natural",
      "math",
      "interactive"
    ]
  },
  {
    name: "branching-vine",
    title: "Branching Vine",
    description: "Uses the Perlin Noise technique to generate a natural looking vine pattern.",
    extraInfo: "",
    colorTheme: "rgb(0,240,0)",
    tags: [
      "interactive",
      "natural"
    ]
  },
  {
    name: "perlin-wave",
    title: "Perlin Wave",
    description: "An animation that demonstrates the Perlin Noise function.",
    extraInfo: "",
    colorTheme: "rgb(0,190,170)",
    tags: [
      "natural",
      "math",
      "animation"
    ]
  },
  {
    name: "dijkstra",
    title: "Dijkstra Path Finder",
    description: "A web of dots is generated. The program uses Dijkstra's pathfinding algorithm to find the shortest path between any two nodes.",
    extraInfo: "",
    colorTheme: "rgb(66,66,255)",
    tags: [
      "algorithm",
      "interactive"
    ]
  },
  {
    name: "sunflower",
    title: "Sunflower Disk",
    description: "The <a href='https://en.wikipedia.org/wiki/Golden_ratio' target='_blank'>Golden Ratio</a> is used to create a pattern such as those seen in the disk florets of flowers in the Asteraceae family, like <a href='https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Helianthus_whorl.jpg/440px-Helianthus_whorl.jpg' target='_blank'>sunflowers</a>.",
    extraInfo: "",
    colorTheme: "rgb(237, 235, 0)",
    tags: [
      "natural",
      "math",
      "animation"
    ]
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