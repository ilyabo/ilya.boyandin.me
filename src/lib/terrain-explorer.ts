const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const terrainSpan = 2;
const terrainMargin = (terrainSpan - 1) / 2;

function unpackMapCoordinate(pixels: Uint8Array, offset: number) {
  const encoded = pixels[offset] * 256 + pixels[offset + 1];
  return encoded ? 0.5 + ((encoded - 1) / 65534 - 0.5) * terrainSpan : null;
}

export class TerrainExplorer {
  active = false;
  drawing = false;
  private spaceNavigating = false;
  private progress = 0;
  get showingTerrain() {
    return this.progress > 0;
  }
  get readyToDraw() {
    return this.active && this.drawing && this.progress === 1;
  }
  private yaw = 0.12;
  private pitch = 0.55;
  private distance = 0.65;
  private centerX = 0.5;
  private centerY = 0.5;
  private touches = new Map<number, { event: PointerEvent; orbit: boolean }>();
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
  private pickingUniform: WebGLUniformLocation;
  private zoomUniform: WebGLUniformLocation;
  private wheelZoom: { distance: number; x: number; y: number } | null = null;
  private modeInputs: NodeListOf<HTMLInputElement>;
  private edgeStatus: HTMLElement | null;

  constructor(
    private gl: WebGL2RenderingContext,
    program: WebGLProgram,
    private surface: HTMLElement,
    private button: HTMLButtonElement,
    private redraw: () => void,
    private endStroke: (commit?: boolean) => void,
    signal: AbortSignal
  ) {
    this.gridUniform = gl.getUniformLocation(program, 'grid');
    this.orbitUniform = gl.getUniformLocation(program, 'orbit');
    this.centerUniform = gl.getUniformLocation(program, 'center');
    this.blendUniform = gl.getUniformLocation(program, 'viewBlend');
    this.pickingUniform = gl.getUniformLocation(program, 'picking');
    this.zoomUniform = gl.getUniformLocation(program, 'zoomRequest');
    const options = { signal };
    this.modeInputs = surface.querySelectorAll('input[name="terrain-mode"]');
    this.edgeStatus = surface.querySelector('[data-terrain-edge]');
    for (const input of this.modeInputs) {
      input.addEventListener('change', () => this.setDrawing(input.value === 'draw'), options);
    }
    const selectBrush = (event: Event) => {
      if (
        this.active &&
        event.target instanceof HTMLInputElement &&
        event.target.name === 'brush-color'
      )
        this.setDrawing(true);
    };
    surface.addEventListener('click', selectBrush, options);
    surface.addEventListener('change', selectBrush, options);
    const shadingButton = surface.querySelector<HTMLButtonElement>('[data-hill-shading]');
    const shadingUniform = gl.getUniformLocation(program, 'hillShading');
    if (shadingButton) {
      const setShading = (enabled: boolean) => {
        gl.uniform1i(shadingUniform, Number(enabled));
        shadingButton.setAttribute('aria-pressed', String(enabled));
        shadingButton.dataset.tooltip = enabled ? 'Show contour lines only' : 'Show hill shading';
        this.redraw();
      };
      setShading(shadingButton.getAttribute('aria-pressed') === 'true');
      shadingButton.addEventListener(
        'click',
        () => setShading(shadingButton.getAttribute('aria-pressed') !== 'true'),
        options
      );
      shadingButton.disabled = false;
    }
    button.disabled = false;
    button.addEventListener('click', () => this.setActive(!this.active), options);
    surface.addEventListener(
      'contextmenu',
      (event) => {
        // On macOS, the Ctrl-click that starts an orbit also opens the context menu.
        if (this.active && event.target === surface && event.ctrlKey) {
          event.preventDefault();
        }
      },
      options
    );
    surface.addEventListener(
      'pointerdown',
      (event) => {
        if (!this.active || event.target !== surface || event.button !== 0) return;
        const orbit = event.pointerType === 'mouse' && event.ctrlKey;
        surface.focus({ preventScroll: true });
        if (this.drawing) {
          this.stopFlight();
          // Claim Ctrl-drag before the background handler can start a brush stroke.
          if (orbit) event.preventDefault();
        }
        surface.setPointerCapture(event.pointerId);
        this.touches.set(event.pointerId, { event, orbit });
      },
      options
    );
    surface.addEventListener('pointermove', (event) => this.drag(event), options);
    const forgetPointer = (event: PointerEvent) => this.touches.delete(event.pointerId);
    surface.addEventListener('pointerup', forgetPointer, options);
    surface.addEventListener('pointercancel', forgetPointer, options);
    surface.addEventListener('lostpointercapture', forgetPointer, options);
    surface.addEventListener(
      'wheel',
      (event) => {
        if (!this.active || event.target !== surface) return;
        event.preventDefault();
        this.endStroke();
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? surface.clientHeight : 1;
        const factor = Math.exp(clamp(event.deltaY * unit * 0.0015, -1, 1));
        const distance = clamp((this.wheelZoom?.distance ?? this.distance) * factor, 0.09, 1.8);
        this.wheelZoom = { distance, x: event.clientX, y: event.clientY };
        this.redraw();
      },
      { signal, passive: false }
    );
    window.addEventListener(
      'keydown',
      (event) => {
        if (!this.active || event.metaKey || event.ctrlKey || event.altKey) return;
        if (event.key === 'Escape') {
          this.setActive(false);
          button.focus();
          return;
        }
        if (event.code === 'Space') {
          // A checked palette radio is already selected. Other controls keep native Space activation.
          const selectedBrushOrMode =
            event.target instanceof HTMLInputElement &&
            event.target.checked &&
            ['terrain-mode', 'brush-color'].includes(event.target.name);
          if (
            (event.target === surface || selectedBrushOrMode) &&
            (this.drawing || this.spaceNavigating)
          ) {
            event.preventDefault();
            if (!event.repeat && this.drawing) {
              this.setDrawing(false, true);
              surface.focus({ preventScroll: true });
            }
          }
          return;
        }
        if (event.target !== surface) return;
        const key = event.key.toLowerCase();
        if (
          ![
            'w',
            'a',
            's',
            'd',
            'arrowup',
            'arrowdown',
            'arrowleft',
            'arrowright',
            '+',
            '=',
            '-',
          ].includes(key)
        )
          return;
        event.preventDefault();
        this.endStroke();
        if (key === '+' || key === '=' || key === '-') this.zoom(key === '-' ? 1.12 : 1 / 1.12);
        else if (!this.keys.has(key)) {
          const now = performance.now();
          if (this.keys.size) this.advanceFlight(now);
          else this.flightTime = now;
          this.keys.add(key);
          this.redraw();
        }
      },
      options
    );
    window.addEventListener(
      'keyup',
      (event) => {
        if (event.code === 'Space' && this.spaceNavigating) this.setDrawing(true);
        const key = event.key.toLowerCase();
        if (!this.keys.has(key)) return;
        // Include the last partial frame, even for a tap shorter than one render interval.
        this.advanceFlight(performance.now());
        this.keys.delete(key);
        if (!this.keys.size) this.stopFlight();
        this.redraw();
      },
      options
    );
    surface.addEventListener('blur', () => this.stopFlight(), options);
    window.addEventListener('blur', () => this.resetInput(), options);
    signal.addEventListener(
      'abort',
      () => {
        this.setActive(false);
        gl.uniform1f(this.blendUniform, 0);
        gl.disable(gl.DEPTH_TEST);
        gl.deleteBuffer(this.indices);
        button.disabled = true;
        if (shadingButton) shadingButton.disabled = true;
      },
      { once: true }
    );
  }

  setActive(active: boolean) {
    if (this.progress === 1) this.yaw = Math.atan2(Math.sin(this.yaw), Math.cos(this.yaw));
    this.active = active;
    this.setDrawing(false);
    this.resetInput();
    this.setEdgeStatus(false);
    this.previousTime = performance.now();
    this.surface.classList.toggle('exploring-terrain', active);
    this.button.setAttribute('aria-pressed', String(active));
    this.button.dataset.tooltip = active ? 'Return to 2D' : 'Explore the terrain in 3D';
    if (active) {
      this.surface.tabIndex = -1;
      this.surface.focus({ preventScroll: true });
      this.resize();
    } else {
      this.surface.removeAttribute('tabindex');
    }
    this.redraw();
  }

  private setDrawing(enabled: boolean, whileSpaceHeld = false) {
    this.endStroke(whileSpaceHeld);
    this.spaceNavigating = whileSpaceHeld;
    this.drawing = enabled;
    this.surface.classList.toggle('drawing-terrain', enabled);
    for (const input of this.modeInputs) {
      input.checked = input.value === (enabled ? 'draw' : 'navigate');
    }
  }

  // Capture the visible mesh once per stroke. Growing relief under the brush must
  // not move its own path. The depth test selects the nearest hillside at each pixel.
  captureBrushMap(canvas: HTMLCanvasElement) {
    const gl = this.gl;
    const bounds = canvas.getBoundingClientRect();
    const scale = Math.min(1, 1024 / Math.max(canvas.width, canvas.height));
    const width = Math.max(1, Math.round(canvas.width * scale));
    const height = Math.max(1, Math.round(canvas.height * scale));
    const pixels = new Uint8Array(width * height * 4);
    gl.viewport(0, 0, width, height);
    gl.disable(gl.DITHER);
    gl.uniform1i(this.pickingUniform, 1);
    this.draw();
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    gl.uniform1i(this.pickingUniform, 0);
    gl.enable(gl.DITHER);
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.draw();

    return (clientX: number, clientY: number) => {
      const col = Math.floor(((clientX - bounds.left) * width) / bounds.width);
      const row = height - 1 - Math.floor(((clientY - bounds.top) * height) / bounds.height);
      if (col < 0 || col >= width || row < 0 || row >= height) return null;
      const i = (row * width + col) * 4;
      const u = unpackMapCoordinate(pixels, i);
      const v = unpackMapCoordinate(pixels, i + 2);
      if (u === null || v === null) return null;
      return { x: u * bounds.width, y: (1 - v) * bounds.height };
    };
  }

  private resetInput() {
    if (this.spaceNavigating) this.setDrawing(true);
    this.wheelZoom = null;
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
    const right =
      Number(this.keys.has('d') || this.keys.has('arrowright')) -
      Number(this.keys.has('a') || this.keys.has('arrowleft'));
    const forward =
      Number(this.keys.has('w') || this.keys.has('arrowup')) -
      Number(this.keys.has('s') || this.keys.has('arrowdown'));
    const cruiseSpeed = (0.28 * this.distance) / (1 + this.distance);
    const speed = cruiseSpeed / Math.max(1, Math.hypot(right, forward));
    const targetRight = right * speed;
    const targetForward = forward * speed;
    // Integrate the easing curve so a short tap travels the same distance between frames.
    const responseSeconds = 0.12;
    const response = -Math.expm1(-dt / responseSeconds);
    this.pan(
      targetRight * dt + (this.rightVelocity - targetRight) * responseSeconds * response,
      targetForward * dt + (this.forwardVelocity - targetForward) * responseSeconds * response
    );
    this.rightVelocity += (targetRight - this.rightVelocity) * response;
    this.forwardVelocity += (targetForward - this.forwardVelocity) * response;
  }

  private zoom(factor: number) {
    this.distance = clamp(this.distance * factor, 0.09, 1.8);
    this.redraw();
  }

  private applyWheelZoom() {
    const { distance, x, y } = this.wheelZoom;
    this.wheelZoom = null;
    if (distance === this.distance) return;
    if (this.progress === 1) {
      const gl = this.gl;
      const canvas = gl.canvas as HTMLCanvasElement;
      const bounds = canvas.getBoundingClientRect();
      const col = Math.floor(((x - bounds.left) * canvas.width) / bounds.width);
      const row =
        canvas.height - 1 - Math.floor(((y - bounds.top) * canvas.height) / bounds.height);
      const pixel = new Uint8Array(4);
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(col, row, 1, 1);
      gl.disable(gl.DITHER);
      gl.uniform1i(this.pickingUniform, 1);
      gl.uniform3f(
        this.zoomUniform,
        ((col + 0.5) * 2) / canvas.width - 1,
        ((row + 0.5) * 2) / canvas.height - 1,
        distance
      );
      this.draw();
      gl.readPixels(col, row, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      gl.uniform3f(this.zoomUniform, 0, 0, 0);
      gl.uniform1i(this.pickingUniform, 0);
      gl.enable(gl.DITHER);
      gl.disable(gl.SCISSOR_TEST);
      // Sky leaves the pick pixel clear, so zoom about the existing center.
      this.centerX = unpackMapCoordinate(pixel, 0) ?? this.centerX;
      this.centerY = unpackMapCoordinate(pixel, 2) ?? this.centerY;
      this.setEdgeStatus(false);
    }
    this.distance = distance;
  }

  private pan(right: number, forward: number) {
    const { width, height } = this.gl.canvas;
    const scale = Math.max(width, height * 0.86);
    const sin = Math.sin(this.yaw),
      cos = Math.cos(this.yaw);
    const x = this.centerX + ((right * cos - forward * sin) * scale) / width;
    const y = this.centerY + ((right * sin + forward * cos) * scale) / height;
    this.centerX = clamp(x, -terrainMargin, 1 + terrainMargin);
    this.centerY = clamp(y, -terrainMargin, 1 + terrainMargin);
    this.setEdgeStatus(this.centerX !== x || this.centerY !== y);
  }

  private setEdgeStatus(reached: boolean) {
    if (!this.edgeStatus || reached === Boolean(this.edgeStatus.textContent)) return;
    this.edgeStatus.textContent = reached ? 'Edge of terrain' : '';
  }

  private drag(event: PointerEvent) {
    const pointer = this.touches.get(event.pointerId);
    if (!pointer) return;
    const previous = pointer.event;
    pointer.event = event;
    let dx = event.clientX - previous.clientX;
    let dy = event.clientY - previous.clientY;
    const mouseOrbit = event.pointerType === 'mouse' && (this.drawing ? pointer.orbit : event.ctrlKey);
    if (this.drawing && this.touches.size === 1 && !mouseOrbit) return;
    const mousePan = event.pointerType === 'mouse' && !mouseOrbit;
    if (this.touches.size === 2 || mousePan) {
      if (this.touches.size === 2) {
        const other = [...this.touches.values()].find(
          (point) => point.event.pointerId !== event.pointerId
        ).event;
        const before = Math.hypot(
          previous.clientX - other.clientX,
          previous.clientY - other.clientY
        );
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
        const a = y * (columns + 1) + x,
          b = a + columns + 1;
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
    if (this.wheelZoom) this.applyWheelZoom();
    const deltaMs = Math.max(0, now - this.previousTime);
    const target = this.active ? 1 : 0;
    if (this.progress !== target) {
      // Reverse from the last rendered frame when the toggle changes mid-flight.
      this.progress = reducedMotion
        ? target
        : clamp(this.progress + ((this.active ? 1 : -1) * deltaMs) / 850, 0, 1);
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
    const flatDistance = (0.9 * height) / Math.max(width, height * 0.86);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(this.blendUniform, t);
    gl.uniform2f(
      this.centerUniform,
      0.5 + (this.centerX - 0.5) * t,
      0.5 + (this.centerY - 0.5) * t
    );
    gl.uniform3f(
      this.orbitUniform,
      this.yaw * t,
      Math.PI / 2 + (this.pitch - Math.PI / 2) * t,
      flatDistance + (this.distance - flatDistance) * t
    );
    gl.drawElements(gl.TRIANGLES, this.columns * this.rows * 6, gl.UNSIGNED_SHORT, 0);
  }
}
