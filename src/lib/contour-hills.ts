const radiusPixelsPerSecond = 70;

interface Hill {
  x: number;
  y: number;
  radius: number;
  durationMs: number;
  height: number;
  started: number;
  cos: number;
  sin: number;
  width: number;
  bend: number;
}

export class ContourHills {
  private hills: Hill[] = [];
  private growing = new Set<Hill>();
  private settled = new Float32Array(0);
  private pixels = new Float32Array(0);
  private width = 0;
  private height = 0;
  columns = 0;
  rows = 0;

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.columns = Math.max(1, Math.ceil(width / 3));
    this.rows = Math.max(1, Math.ceil(height / 3));
    this.settled = new Float32Array(this.columns * this.rows);
    this.pixels = new Float32Array(this.settled.length);
    this.growing = new Set(this.hills);
  }

  add(x: number, y: number, now: number) {
    const bearing = Math.random() * 2 * Math.PI;
    const direction = Math.random() < 0.4 ? -1 : 1;
    const radius = 36 + Math.random() * 384;
    const hill = {
      x: x / this.width, y: y / this.height, radius,
      durationMs: 1000 * radius / radiusPixelsPerSecond,
      height: direction * (0.26 + Math.random() * 0.10), started: now,
      cos: Math.cos(bearing), sin: Math.sin(bearing),
      width: 0.58 + Math.random() * 0.16, bend: (Math.random() - 0.5) * 0.55,
    };
    this.hills.push(hill);
    this.growing.add(hill);
  }

  update(now: number, reducedMotion: boolean) {
    if (this.growing.size === 0) return null;
    for (const hill of this.growing) {
      if (!reducedMotion && now - hill.started < hill.durationMs) continue;
      this.drawHill(this.settled, hill, 1);
      hill.started = -Infinity;
      this.growing.delete(hill);
    }
    this.pixels.set(this.settled);
    for (const hill of this.growing) {
      const t = Math.max(0, (now - hill.started) / hill.durationMs);
      this.drawHill(this.pixels, hill, Math.sqrt(t * (2 - t)));
    }
    return this.pixels;
  }

  private drawHill(field: Float32Array, hill: Hill, growth: number) {
    if (growth === 0) return;
    const cx = hill.x * this.columns;
    const cy = hill.y * this.rows;
    const rx = hill.radius * growth * this.columns / this.width;
    const ry = hill.radius * growth * this.rows / this.height;
    const height = hill.height * Math.sqrt(growth);
    const right = Math.min(this.columns, Math.ceil(cx + rx));
    const bottom = Math.min(this.rows, Math.ceil(cy + ry));
    for (let row = Math.max(0, Math.floor(cy - ry)); row < bottom; row++) {
      const dy = (row + 0.5 - cy) / ry;
      for (let col = Math.max(0, Math.floor(cx - rx)); col < right; col++) {
        const dx = (col + 0.5 - cx) / rx;
        // Bend and taper one dome so every contour wraps the same summit or basin.
        const u = (dx * hill.cos + dy * hill.sin) / 0.9;
        const across = dy * hill.cos - dx * hill.sin;
        const v = (across - hill.bend * u * u) / (hill.width * (1 + 0.18 * u));
        const falloff = Math.max(0, 1 - u * u - v * v);
        field[row * this.columns + col] += height * falloff * falloff;
      }
    }
  }
}
