const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export class TerrainExplorer {
  active = false;
  private progress = 0;
  get showingTerrain() {
    return this.progress > 0;
  }
  private yaw = 0.12;
  private pitch = 0.55;
  private distance = 0.65;
  private centerX = 0.5;
  private centerY = 0.5;
  private touches = new Map<number, PointerEvent>();
  private keys = new Set<string>();
  private flightTime = 0;
  private rightVelocity = 0;
  private forwardVelocity = 0;
  private previousTime = 0;
  private columns = 0;
  private rows = 0;
  private indices: WebGLBuffer | null = null;
  private gridUniform: WebGLUniformLocation;
  private orbitUniform: WebGLUniformLocation;
  private centerUniform: WebGLUniformLocation;
  private blendUniform: WebGLUniformLocation;

  constructor(
    private gl: WebGL2RenderingContext, program: WebGLProgram,
    private surface: HTMLElement, private button: HTMLButtonElement,
    private redraw: () => void, signal: AbortSignal,
  ) {
    this.gridUniform = gl.getUniformLocation(program, 'grid');
    this.orbitUniform = gl.getUniformLocation(program, 'orbit');
    this.centerUniform = gl.getUniformLocation(program, 'center');
    this.blendUniform = gl.getUniformLocation(program, 'viewBlend');
    const options = { signal };
    button.disabled = false;
    button.addEventListener('click', () => this.setActive(!this.active), options);
    surface.addEventListener('pointerdown', event => {
      if (!this.active || event.target !== surface || event.button !== 0) return;
      surface.focus({ preventScroll: true });
      surface.setPointerCapture(event.pointerId);
      this.touches.set(event.pointerId, event);
    }, options);
    surface.addEventListener('pointermove', event => this.drag(event), options);
    surface.addEventListener('lostpointercapture', event => this.touches.delete(event.pointerId), options);
    surface.addEventListener('wheel', event => {
      if (!this.active || event.target !== surface) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? surface.clientHeight : 1;
      this.zoom(Math.exp(clamp(event.deltaY * unit * 0.0015, -1, 1)));
    }, { signal, passive: false });
    window.addEventListener('keydown', event => {
      if (!this.active || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'Escape') {
        this.setActive(false);
        button.focus();
        return;
      }
      if (event.target !== surface) return;
      const key = event.key.toLowerCase();
      if (!['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', '+', '=', '-'].includes(key)) return;
      event.preventDefault();
      if (key === '+' || key === '=' || key === '-') this.zoom(key === '-' ? 1.12 : 1 / 1.12);
      else if (!this.keys.has(key)) {
        const now = performance.now();
        if (this.keys.size) this.advanceFlight(now);
        else this.flightTime = now;
        this.keys.add(key);
        this.redraw();
      }
    }, options);
    window.addEventListener('keyup', event => {
      const key = event.key.toLowerCase();
      if (!this.keys.has(key)) return;
      // Include the last partial frame, even for a tap shorter than one render interval.
      this.advanceFlight(performance.now());
      this.keys.delete(key);
      if (!this.keys.size) this.stopFlight();
      this.redraw();
    }, options);
    surface.addEventListener('blur', () => this.stopFlight(), options);
    window.addEventListener('blur', () => this.resetInput(), options);
    signal.addEventListener('abort', () => {
      this.setActive(false);
      button.disabled = true;
    }, { once: true });
  }

  private setActive(active: boolean) {
    if (this.progress === 1) this.yaw = Math.atan2(Math.sin(this.yaw), Math.cos(this.yaw));
    this.active = active;
    this.resetInput();
    this.previousTime = performance.now();
    this.surface.classList.toggle('exploring-terrain', active);
    this.button.setAttribute('aria-pressed', String(active));
    this.button.title = active ? 'Return to painting' : 'Explore the terrain in 3D';
    if (active) {
      this.surface.tabIndex = -1;
      this.surface.focus({ preventScroll: true });
      this.resize();
    } else {
      this.surface.removeAttribute('tabindex');
    }
    this.redraw();
  }

  private resetInput() {
    this.touches.clear();
    this.stopFlight();
    this.previousTime = 0;
  }

  private stopFlight() {
    this.keys.clear();
    this.rightVelocity = 0;
    this.forwardVelocity = 0;
  }

  private advanceFlight(now: number) {
    if (now <= this.flightTime) return;
    const dt = Math.min((now - this.flightTime) / 1000, 0.04);
    this.flightTime = now;
    const right = Number(this.keys.has('d') || this.keys.has('arrowright')) - Number(this.keys.has('a') || this.keys.has('arrowleft'));
    const forward = Number(this.keys.has('w') || this.keys.has('arrowup')) - Number(this.keys.has('s') || this.keys.has('arrowdown'));
    const cruiseSpeed = 0.28 * this.distance / (1 + this.distance);
    const speed = cruiseSpeed / Math.max(1, Math.hypot(right, forward));
    const targetRight = right * speed;
    const targetForward = forward * speed;
    // Integrate the easing curve so a short tap travels the same distance between frames.
    const responseSeconds = 0.12;
    const response = -Math.expm1(-dt / responseSeconds);
    this.pan(
      targetRight * dt + (this.rightVelocity - targetRight) * responseSeconds * response,
      targetForward * dt + (this.forwardVelocity - targetForward) * responseSeconds * response,
    );
    this.rightVelocity += (targetRight - this.rightVelocity) * response;
    this.forwardVelocity += (targetForward - this.forwardVelocity) * response;
  }

  private zoom(factor: number) {
    this.distance = clamp(this.distance * factor, 0.09, 1.8);
    this.redraw();
  }

  private pan(right: number, forward: number) {
    const { width, height } = this.gl.canvas;
    const scale = Math.max(width, height * 0.86);
    const sin = Math.sin(this.yaw), cos = Math.cos(this.yaw);
    this.centerX = clamp(this.centerX + (right * cos - forward * sin) * scale / width, 0, 1);
    this.centerY = clamp(this.centerY + (right * sin + forward * cos) * scale / height, 0, 1);
  }

  private drag(event: PointerEvent) {
    const previous = this.touches.get(event.pointerId);
    if (!previous) return;
    this.touches.set(event.pointerId, event);
    let dx = event.clientX - previous.clientX;
    let dy = event.clientY - previous.clientY;
    if (this.touches.size === 2 || event.shiftKey) {
      if (this.touches.size === 2) {
        const other = [...this.touches.values()].find(point => point.pointerId !== event.pointerId);
        const before = Math.hypot(previous.clientX - other.clientX, previous.clientY - other.clientY);
        const after = Math.hypot(event.clientX - other.clientX, event.clientY - other.clientY);
        if (before > 2 && after > 2) this.zoom(before / after);
        dx *= 0.5;
        dy *= 0.5;
      }
      const speed = this.distance / this.surface.clientHeight;
      this.pan(-dx * speed, dy * speed);
    } else if (this.touches.size === 1) {
      this.yaw -= dx * 0.007;
      this.pitch = clamp(this.pitch + dy * 0.006, 0.14, 1.45);
    }
    this.redraw();
  }

  resize() {
    if (!this.active && !this.showingTerrain) return;
    const gl = this.gl;
    const columns = clamp(Math.ceil(gl.canvas.width / 5), 64, 240);
    const rows = clamp(Math.ceil(gl.canvas.height / 5), 64, 240);
    if (columns === this.columns && rows === this.rows) return;
    this.columns = columns;
    this.rows = rows;
    const indices = new Uint16Array(columns * rows * 6);
    let index = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const a = y * (columns + 1) + x, b = a + columns + 1;
        indices[index++] = a;
        indices[index++] = a + 1;
        indices[index++] = b;
        indices[index++] = b;
        indices[index++] = a + 1;
        indices[index++] = b + 1;
      }
    }
    this.indices ??= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.uniform2i(this.gridUniform, columns, rows);
  }

  step(now: number, reducedMotion: boolean) {
    const deltaMs = Math.max(0, now - this.previousTime);
    const target = this.active ? 1 : 0;
    if (this.progress !== target) {
      // Reverse from the last rendered frame when the toggle changes mid-flight.
      this.progress = reducedMotion ? target : clamp(this.progress + (this.active ? 1 : -1) * deltaMs / 850, 0, 1);
      if (!this.showingTerrain) {
        this.gl.uniform1f(this.blendUniform, 0);
        this.gl.disable(this.gl.DEPTH_TEST);
      }
      if (this.progress !== target) this.redraw();
    }
    if (this.keys.size) {
      this.advanceFlight(now);
      this.redraw();
    }
    this.previousTime = now;
  }

  draw() {
    const gl = this.gl;
    const t = this.progress * this.progress * (3 - 2 * this.progress);
    const { width, height } = gl.canvas;
    // At this distance the top-down camera's plane fills exactly the flat map viewport.
    const flatDistance = 0.9 * height / Math.max(width, height * 0.86);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(this.blendUniform, t);
    gl.uniform2f(this.centerUniform, 0.5 + (this.centerX - 0.5) * t, 0.5 + (this.centerY - 0.5) * t);
    gl.uniform3f(this.orbitUniform, this.yaw * t, Math.PI / 2 + (this.pitch - Math.PI / 2) * t,
      flatDistance + (this.distance - flatDistance) * t);
    gl.drawElements(gl.TRIANGLES, this.columns * this.rows * 6, gl.UNSIGNED_SHORT, 0);
  }
}
