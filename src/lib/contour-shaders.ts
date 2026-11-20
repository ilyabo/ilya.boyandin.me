// Both views sample the same procedural relief and painted height field.
const terrain = `
    uniform vec2 resolution;
    uniform float gutter;
    uniform highp sampler2D hillField;
    uniform float elapsed;
    uniform float touchMotion;
    uniform float viewBlend;

    vec2 mapScale() {
      return resolution / max(resolution.x, resolution.y * 0.86);
    }

    float cornerHeight(vec2 cell) {
      vec3 h = fract(cell.xyx * vec3(0.1031, 0.1030, 0.0973));
      h += dot(h, h.yzx + 33.33);
      return fract((h.x + h.y) * h.z);
    }

    float terrainNoise(vec2 p) {
      vec2 cell = floor(p);
      vec2 f = fract(p);
      vec2 blend = f*f*f * (f*(f*6.0 - 15.0) + 10.0);
      return mix(
        mix(cornerHeight(cell), cornerHeight(cell + vec2(1, 0)), blend.x),
        mix(cornerHeight(cell + vec2(0, 1)), cornerHeight(cell + vec2(1, 1)), blend.x),
        blend.y
      );
    }

    vec4 paintedTerrain(vec2 uv) {
      vec4 hill = texture(hillField, vec2(uv.x, 1.0 - uv.y));
      if (viewBlend > 0.0) {
        // Continue the procedural landscape beyond the painted map without stretching edge strokes.
        vec2 outside = max(-uv, uv - 1.0);
        hill *= 1.0 - smoothstep(0.0, 0.08, max(outside.x, outside.y));
      }
      return hill;
    }

    float terrainElevation(vec2 p, vec2 uv, float hillHeight) {
      float margin = smoothstep(0.30, 0.50, abs(uv.x - 0.5));
      float motion = mix(0.35, 1.0, margin) + 1.2 * touchMotion;
      float edgeDistance = min(uv.x, 1.0 - uv.x);
      float outerMargin = 1.0 - smoothstep(0.0, gutter, edgeDistance);

      // Rotated layers of relief produce nested summits, saddles and drainage valleys.
      mat2 turn = mat2(0.8, 0.6, -0.6, 0.8);
      vec2 terrain = turn * (p * 3.4) + vec2(6.2, 3.8);
      float hills = terrainNoise(terrain);
      float ridges = terrainNoise(turn * terrain * 2.1);
      float elevation = hills + 0.34 * ridges
                      + 0.10 * terrainNoise(terrain * 4.7 + 9.0) + hillHeight;
      // On touch screens, carry the breath into the reading area between the narrow gutters.
      float breath = sin(elapsed * mix(0.24, 0.48, touchMotion));
      float relief = 0.040 * (hills - 0.5) + 0.028 * (ridges - 0.5);
      elevation += breath * (motion + 0.45 * outerMargin) * (relief + 0.018 * touchMotion);
      return elevation;
    }
`;

const fullscreen = `
      const vec2 corners[3] = vec2[3](vec2(-1, -1), vec2(3, -1), vec2(-1, 3));
      gl_Position = vec4(corners[gl_VertexID], 0, 1);
`;

export const flatVertexSource = `#version 300 es
    void main() { ${fullscreen} }
`;

export const terrainVertexSource = `#version 300 es
    precision highp float;
    ${terrain}
    uniform ivec2 grid;
    // Center is in map UV coordinates. Orbit holds yaw, pitch and camera distance.
    uniform vec2 center;
    uniform vec3 orbit;
    out vec2 terrainUV;

    float worldHeight(vec2 uv) {
      return (terrainElevation(uv * mapScale(), uv, paintedTerrain(uv).r) - 0.68) * 0.18 * viewBlend;
    }

    void main() {
      if (viewBlend == 0.0) {
        terrainUV = vec2(0);
        ${fullscreen}
        return;
      }
      int stride = grid.x + 1;
      vec2 cell = vec2(gl_VertexID % stride, gl_VertexID / stride);
      terrainUV = cell / vec2(grid) * 2.0 - 0.5;
      vec2 scale = mapScale();
      vec2 horizontal = (terrainUV - center) * scale;
      vec3 world = vec3(horizontal.x, worldHeight(terrainUV), -horizontal.y);
      // Follow local relief close to the surface. At wide zooms, keep the horizon steady.
      float terrainFollow = 1.0 - smoothstep(0.15, 0.65, orbit.z);
      vec3 target = vec3(0, worldHeight(center) * terrainFollow, 0);
      vec2 bearing = vec2(sin(orbit.x), cos(orbit.x));
      vec2 offset = bearing * cos(orbit.y) * orbit.z;
      vec3 eye = target + vec3(offset.x, sin(orbit.y) * orbit.z, offset.y);
      vec2 eyeUV = center + vec2(offset.x, -offset.y) / scale;
      eye.y = max(eye.y, worldHeight(eyeUV) + 0.035);
      vec3 forward = normalize(target - eye);
      vec3 right = vec3(bearing.y, 0, -bearing.x);
      vec3 up = cross(right, forward);
      vec3 ray = world - eye;
      float depth = dot(ray, forward);
      // Perspective projection with a 0.01 near plane and 8.0 far plane.
      gl_Position = vec4(dot(ray, right) * 1.8 * resolution.y / resolution.x,
                         dot(ray, up) * 1.8, 1.002503 * depth - 0.020025, depth);
    }
`;

export function contourFragmentSource(paint: boolean) {
  return `#version 300 es
    precision highp float;
    ${terrain}
    ${paint ? 'in vec2 terrainUV;' : ''}
    uniform sampler2D springField;
    uniform bool springsActive;
    uniform bool paintMode;
    uniform vec2 viewport;
    out vec4 color;

    vec2 samplePull(vec2 uv) {
      // Group the 4x4 cubic B-spline kernel into four hardware-filtered reads.
      vec2 size = vec2(textureSize(springField, 0));
      vec2 cell = uv * size - 0.5;
      vec2 f = fract(cell);
      vec2 r = 1.0 - f;
      vec2 w0 = r * r * r / 6.0;
      vec2 w1 = (4.0 - 6.0 * f * f + 3.0 * f * f * f) / 6.0;
      vec2 w3 = f * f * f / 6.0;
      vec2 left = w0 + w1;
      vec2 right = 1.0 - left;
      vec2 lo = (floor(cell) - 0.5 + w1 / left) / size;
      vec2 hi = (floor(cell) + 1.5 + w3 / right) / size;
      vec2 lower = mix(texture(springField, lo).rg, texture(springField, vec2(hi.x, lo.y)).rg, right.x);
      vec2 upper = mix(texture(springField, vec2(lo.x, hi.y)).rg, texture(springField, hi).rg, right.x);
      return (mix(lower, upper, right.y) * 255.0 - 128.0) / 3.0;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      ${paint ? 'if (viewBlend > 0.0) uv = terrainUV;' : ''}
      vec2 scale = mapScale();
      vec2 p = uv * scale;
      if (viewBlend < 1.0 && springsActive) {
        vec2 pull = samplePull(vec2(uv.x, 1.0 - uv.y));
        p -= vec2(pull.x, -pull.y) * scale / viewport * (1.0 - viewBlend);
      }
      vec4 hill = paintedTerrain(p / scale);
      float elevation = terrainElevation(p, uv, hill.r);
      float level = elevation * 21.0;
      bool indexContour = mod(floor(level + 0.5), 5.0) == 0.0;
      float distanceToLine = abs(fract(level + 0.5) - 0.5);
      float pixelWidth = max(fwidth(level), 0.0001);
      float width = indexContour ? 1.25 : 0.95;
      float line = 1.0 - smoothstep(0.0, width, distanceToLine / pixelWidth);
      float edgeDistance = min(uv.x, 1.0 - uv.x);
      float readingFade = mix(1.0, mix(0.36, 0.52, touchMotion), clamp(edgeDistance / (gutter + 0.04), 0.0, 1.0));
      vec3 contourColor = vec3(0.43, 0.67, 0.70);
      float opacity = (indexContour ? 0.19 : 0.13) * readingFade;
      vec4 contour = vec4(contourColor * opacity, opacity);
      if (paintMode) {
        vec3 ink = hill.gba;
        float strength = max(ink.r, max(ink.g, ink.b));
        float baseOpacity = (indexContour ? 0.31 : 0.19) * (1.0 - strength);
        contour = vec4(ink + contourColor * baseOpacity, strength + baseOpacity);
      }
      color = contour * line;
      if (viewBlend > 0.0) {
        vec3 surface = vec3(p.x, elevation * 0.18, -p.y);
        vec3 normal = normalize(cross(dFdx(surface), dFdy(surface)));
        float sunlight = max(0.0, dot(normal, normalize(vec3(-0.55, 0.75, -0.45))));
        vec3 ground = mix(vec3(0.07, 0.14, 0.17), vec3(0.30, 0.36, 0.30),
                          smoothstep(0.25, 1.15, elevation)) * (0.55 + 0.75 * sunlight);
        color = mix(color, vec4(ground * (1.0 - color.a) + color.rgb, 1), viewBlend);
      }
    }
  `;
}
