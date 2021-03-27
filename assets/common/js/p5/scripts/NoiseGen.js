class NoiseGen {
  constructor(octaves, falloff, wvlength, amp) {
    this.octaves = octaves
    this.falloff = falloff
    this.wvlength = wvlength
    this.amp = amp
    this.start = createVector(random(10), random(10), random(10))
    noiseDetail(octaves, falloff)
    var n = noise(0)
    this.min = n
    this.max = n
    for (var i = 1; i < 10000; i+=0.1) {
      n = noise(i * 0.003)
      if (n < this.min) {
        this.min = n
      }
      if (n > this.max) {
        this.max = n
      }
    }
  }

  get(x=0, y=0, z=0) {
    noiseDetail(this.octaves, this.falloff)
    var n = noise(this.start.x + x * this.wvlength, this.start.y + y * this.wvlength, this.start.z + z * this.wvlength)
    if (n < this.min) {
      this.min = n
    }
    if (n > this.max) {
      this.max = n
    }
    return this.amp * map(n, this.min, this.max, -1, 1)
  }
}