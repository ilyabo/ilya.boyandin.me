const maxHoldMs = 7000;
const maxCoastMs = 2800;
const coastInitialSlope = 5.5;
const minRadius = 6;
const minSettledRadius = 60;

interface Hill {
  x: number;
  y: number;
  path: { x: number; y: number }[];
  radius: number;
  height: number;
  cos: number;
  sin: number;
  width: number;
  bend: number;
}

export class ContourHills {
  private hills: Hill[] = [];
  private preview: Hill | null = null;
  private pressedAt = 0;
  private pathCache = new WeakMap<Hill, { distances: Float32Array; segments: number; length: number }>();
  private coasting = new Set<{
    hill: Hill; started: number; duration: number; startRadius: number; drift: number; extraGrowth: number;
  }>();
  private dirty = false;
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
    this.pathCache = new WeakMap();
    for (const hill of this.hills) {
      this.drawHill(this.settled, hill);
      this.pathCache.delete(hill);
    }
    this.dirty = true;
  }

  begin(x: number, y: number, now: number) {
    this.pressedAt = now;
    const bearing = Math.random() * 2 * Math.PI;
    const direction = Math.random() < 0.4 ? -1 : 1;
    this.preview = {
      x: x / this.width, y: y / this.height, path: [], radius: minRadius,
      height: direction * (0.26 + Math.random() * 0.10),
      cos: Math.cos(bearing), sin: Math.sin(bearing),
      width: 0.58 + Math.random() * 0.16, bend: (Math.random() - 0.5) * 0.55,
    };
    this.dirty = true;
  }

  drag(dx: number, dy: number, final = false) {
    if (!this.preview) return;
    const points = this.preview.path;
    const last = points[points.length - 1];
    const gap = Math.hypot(dx - (last?.x ?? 0) * this.width, dy - (last?.y ?? 0) * this.height);
    if (gap < (final ? 0.01 : 4)) return;
    points.push({ x: dx / this.width, y: dy / this.height });
    this.dirty = true;
  }

  cancel() {
    if (!this.preview) return;
    this.preview = null;
    this.dirty = true;
  }

  private maxRadius(hill: Hill) {
    const farX = Math.max(hill.x, 1 - hill.x) * this.width;
    const farY = Math.max(hill.y, 1 - hill.y) * this.height;
    // Leave enough reach along the narrow side of a rotated, tapered hill.
    return Math.max(minRadius, 2 * Math.hypot(farX, farY));
  }

  private growPreview(hill: Hill, now: number) {
    const t = Math.max(0, Math.min(1, (now - this.pressedAt) / maxHoldMs));
    const range = this.maxRadius(hill) - minRadius;
    const tSquared = t * t;
    const radius = minRadius + range * tSquared * (2 - tSquared);
    if (hill.radius !== radius) this.dirty = true;
    hill.radius = radius;
    // Derivative of the hold curve, in pixels per millisecond.
    return range * 4 * t * (1 - tSquared) / maxHoldMs;
  }

  private settle(hill: Hill) {
    this.hills.push(hill);
    this.drawHill(this.settled, hill);
    this.pathCache.delete(hill);
  }

  release(now: number, reducedMotion: boolean) {
    const hill = this.preview;
    if (!hill) return;
    const speed = this.growPreview(hill, now);
    const maxRadius = this.maxRadius(hill);
    const minimum = Math.min(minSettledRadius, maxRadius);
    const drift = Math.min(maxRadius - hill.radius, speed * maxCoastMs / coastInitialSlope);
    const extraGrowth = Math.max(0, minimum - hill.radius - drift);
    if (!reducedMotion && (drift > 0 || extraGrowth > 0)) {
      const duration = speed > 0 ? coastInitialSlope * drift / speed : maxCoastMs;
      this.coasting.add({ hill, started: now, duration, startRadius: hill.radius, drift, extraGrowth });
    } else {
      hill.radius = Math.max(hill.radius, minimum);
      this.settle(hill);
    }
    this.preview = null;
    this.dirty = true;
  }

  update(now: number, reducedMotion: boolean) {
    if (this.preview) this.growPreview(this.preview, now);
    for (const coast of this.coasting) {
      const t = reducedMotion ? 1 : Math.max(0, Math.min(1, (now - coast.started) / coast.duration));
      // Keep the release velocity. For short taps, ease in the extra growth from rest.
      const remaining = (1 - t) ** 2 / (1 + (coastInitialSlope - 2) * t);
      coast.hill.radius = coast.startRadius + coast.drift * (1 - remaining) +
        coast.extraGrowth * t * t * (3 - 2 * t);
      this.dirty = true;
      if (t === 1) {
        this.settle(coast.hill);
        this.coasting.delete(coast);
      }
    }
    if (!this.dirty) return null;
    this.dirty = false;
    if (!this.preview && !this.coasting.size) return this.settled;
    this.pixels.set(this.settled);
    for (const { hill } of this.coasting) this.drawHill(this.pixels, hill);
    if (this.preview) this.drawHill(this.pixels, this.preview);
    return this.pixels;
  }

  private drawHill(field: Float32Array, hill: Hill) {
    const cx = hill.x * this.columns;
    const cy = hill.y * this.rows;
    const rx = hill.radius * this.columns / this.width;
    const ry = hill.radius * this.rows / this.height;
    if (hill.path.length) {
      this.drawPath(field, hill);
      return;
    }
    const left = Math.max(0, Math.floor(cx - rx));
    const top = Math.max(0, Math.floor(cy - ry));
    const right = Math.min(this.columns, Math.ceil(cx + rx));
    const bottom = Math.min(this.rows, Math.ceil(cy + ry));
    for (let row = top; row < bottom; row++) {
      const dy = (row + 0.5 - cy) / ry;
      for (let col = left; col < right; col++) {
        const dx = (col + 0.5 - cx) / rx;
        // Bend and taper one dome so every contour wraps the same summit or basin.
        const u = (dx * hill.cos + dy * hill.sin) / 0.9;
        const across = dy * hill.cos - dx * hill.sin;
        const v = (across - hill.bend * u * u) / (hill.width * (1 + 0.18 * u));
        const falloff = Math.max(0, 1 - u * u - v * v);
        field[row * this.columns + col] += hill.height * falloff * falloff;
      }
    }
  }

  private drawPath(field: Float32Array, hill: Hill) {
    // A path can keep widening for seconds. Cache its centerline distances independently
    // of radius, updating them only where a newly sampled segment is closer.
    let cache = this.pathCache.get(hill);
    if (!cache) {
      cache = { distances: new Float32Array(field.length).fill(Infinity), segments: 0, length: 0 };
      this.pathCache.set(hill, cache);
    }
    const cellWidth = this.width / this.columns;
    const cellHeight = this.height / this.rows;
    for (; cache.segments < hill.path.length; cache.segments++) {
      const last = hill.path[cache.segments - 1];
      const next = hill.path[cache.segments];
      const x = last?.x ?? 0;
      const y = last?.y ?? 0;
      const sx = (next.x - x) * this.width;
      const sy = (next.y - y) * this.height;
      cache.length += Math.hypot(sx, sy);
      const inverseLengthSquared = 1 / (sx * sx + sy * sy);
      const startX = (hill.x + x) * this.width;
      const startY = (hill.y + y) * this.height;
      for (let row = 0; row < this.rows; row++) {
        const py = (row + 0.5) * cellHeight - startY;
        for (let col = 0; col < this.columns; col++) {
          const px = (col + 0.5) * cellWidth - startX;
          const along = Math.max(0, Math.min(1, (px * sx + py * sy) * inverseLengthSquared));
          const dx = px - along * sx;
          const dy = py - along * sy;
          const i = row * this.columns + col;
          cache.distances[i] = Math.min(cache.distances[i], dx * dx + dy * dy);
        }
      }
    }

    const width = hill.radius * hill.width;
    const invWidthSquared = 1 / (width * width);
    const taperLength = Math.max(hill.radius, cache.length);
    for (let row = 0; row < this.rows; row++) {
      const dy = (row + 0.5) * cellHeight - hill.y * this.height;
      for (let col = 0; col < this.columns; col++) {
        const i = row * this.columns + col;
        const falloff = 1 - cache.distances[i] * invWidthSquared;
        if (falloff <= 0) continue;
        const dx = (col + 0.5) * cellWidth - hill.x * this.width;
        const taper = 1 - 0.25 * Math.min(1, Math.sqrt(dx * dx + dy * dy) / taperLength);
        field[i] += hill.height * taper * falloff * falloff;
      }
    }
  }
}
