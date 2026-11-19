// Each grid point stores a two-axis displacement and return velocity in CSS pixels.
export class ContourSprings {
  readonly columns: number;
  readonly rows: number;
  readonly pixels: Uint8Array;
  private offsets: Float32Array;
  private velocities: Float32Array;
  private readonly width: number;
  private readonly height: number;
  active = false;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    const spacing = 14;
    this.columns = Math.max(1, Math.ceil(width / spacing));
    this.rows = Math.max(1, Math.ceil(height / spacing));
    const size = this.columns * this.rows * 2;
    this.offsets = new Float32Array(size);
    this.velocities = new Float32Array(size);
    this.pixels = new Uint8Array(size).fill(128);
  }

  stroke(x: number, y: number, endX: number, endY: number, durationMs: number) {
    const dx = endX - x;
    const dy = endY - y;
    const length = Math.hypot(dx, dy);
    if (!length) return;

    // Cover the whole segment, including fast crossings between pointer events.
    const radius = 64;
    const cellWidth = this.width / this.columns;
    const cellHeight = this.height / this.rows;
    const left = Math.max(0, Math.floor((Math.min(x, endX) - radius) / cellWidth));
    const right = Math.min(this.columns - 1, Math.ceil((Math.max(x, endX) + radius) / cellWidth));
    const top = Math.max(0, Math.floor((Math.min(y, endY) - radius) / cellHeight));
    const bottom = Math.min(this.rows - 1, Math.ceil((Math.max(y, endY) + radius) / cellHeight));
    // Spread the response across a wider speed range so ordinary passes stay gentle.
    const fullPullSpeed = 1.25; // CSS pixels per millisecond
    const speed = Math.min(1, length / (Math.max(1, durationMs) * fullPullSpeed));
    const strength = 0.2 + 0.8 * speed * speed * (3 - 2 * speed);
    const pull = strength * Math.min(0.55, 32 / length);

    for (let row = top; row <= bottom; row++) {
      for (let col = left; col <= right; col++) {
        const px = (col + 0.5) * cellWidth - x;
        const py = (row + 0.5) * cellHeight - y;
        const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (length * length)));
        const falloff = Math.max(0, 1 - ((px - t * dx) ** 2 + (py - t * dy) ** 2) / radius ** 2);
        const falloffSquared = falloff * falloff;
        // The extra pull fades faster than the stroke itself.
        const weight = pull * falloffSquared * (1 + 0.2 * falloffSquared * falloffSquared);
        const i = (row * this.columns + col) * 2;
        const offsetX = this.offsets[i] + dx * weight;
        const offsetY = this.offsets[i + 1] + dy * weight;
        const limit = Math.max(1, Math.hypot(offsetX, offsetY) / 38.4);
        this.offsets[i] = offsetX / limit;
        this.offsets[i + 1] = offsetY / limit;
      }
    }
    this.active = true;
  }

  step(dt: number) {
    // Exact damped spring response. The first overshoot is about 9% of the pull.
    const damping = 1.5;
    const frequency = 2.0;
    const stiffness = damping * damping + frequency * frequency;
    const decay = Math.exp(-damping * dt);
    const cosine = Math.cos(frequency * dt);
    const sine = Math.sin(frequency * dt) / frequency;
    this.active = false;
    for (let i = 0; i < this.offsets.length; i++) {
      const x = this.offsets[i];
      const v = this.velocities[i];
      const displacement = decay * (x * cosine + (v + damping * x) * sine);
      const velocity = decay * (v * cosine - (damping * v + stiffness * x) * sine);
      this.offsets[i] = displacement;
      this.velocities[i] = velocity;
      this.pixels[i] = Math.round(128 + displacement * 3);
      if (Math.abs(displacement) > 0.05 || Math.abs(velocity) > 0.15) this.active = true;
    }
  }
}
