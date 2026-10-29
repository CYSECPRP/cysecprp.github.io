export const VERTEX_SHADER = /* glsl */ `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// Raymarched SDF (padlock or server stack) shaded into an ordered 8x8 Bayer dither.
export const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uShape;
uniform float uOpen;
uniform float uRoll;
uniform float uEngage;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uAccent;

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float sdShackle(vec3 p) {
  float R = 0.42;
  float r = 0.1;
  if (p.y > 0.0) {
    return length(vec2(length(p.xy) - R, p.z)) - r;
  }
  // The left leg is shorter so it can clear the body when the lock opens.
  float leg = p.x < 0.0 ? 0.34 : 0.62;
  vec2 w = vec2(length(vec2(abs(p.x) - R, p.z)) - r, -p.y - leg);
  return min(max(w.x, w.y), 0.0) + length(max(w, 0.0));
}

float sdKeyhole(vec3 p) {
  float circle = length(p.xy - vec2(0.0, 0.07)) - 0.09;
  vec2 q = abs(p.xy - vec2(0.0, -0.1)) - vec2(0.035, 0.15);
  float slot = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  return max(min(circle, slot), abs(p.z - 0.3) - 0.14);
}

float sdBodyBox(vec3 b) {
  return sdRoundBox(b, vec3(0.74, 0.58, 0.27), 0.11);
}

// 0 → 1 while the shackle rises during the first part of opening.
float openLift() {
  return clamp(uOpen / 0.45, 0.0, 1.0);
}

// Lock body space; the opened lock drops a little so the raised shackle stays in frame.
vec3 bodySpace(vec3 p) {
  return p + vec3(0.0, 0.34 + 0.12 * openLift(), 0.0);
}

float padlock(vec3 p) {
  vec3 b = bodySpace(p);
  float body = max(sdBodyBox(b), -sdKeyhole(b));
  // Lift the shackle clear of the body, then swing it half a turn about the long right leg.
  float swing = 3.14159 * clamp((uOpen - 0.45) / 0.55, 0.0, 1.1);
  vec3 s = b - vec3(0.42, 0.64 + 0.3 * openLift(), 0.0);
  s.xz = rot(-swing) * s.xz;
  s.x += 0.42;
  return min(body, sdShackle(s));
}

float serverId(vec3 p) {
  return clamp(floor(p.y / 0.46 + 0.5), -1.0, 1.0);
}

float servers(vec3 p) {
  vec3 q = p - vec3(0.0, serverId(p) * 0.46, 0.0);
  return sdRoundBox(q, vec3(0.86, 0.17, 0.6), 0.05);
}

float map(vec3 p) {
  return uShape < 0.5 ? padlock(p) : servers(p);
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0015, -0.0015);
  return normalize(
    e.xyy * map(p + e.xyy) +
    e.yyx * map(p + e.yyx) +
    e.yxy * map(p + e.yxy) +
    e.xxx * map(p + e.xxx)
  );
}

float bayer2(vec2 a) {
  a = floor(a);
  return fract(dot(a, vec2(0.5, a.y * 0.75)));
}

float bayer4(vec2 a) {
  return bayer2(0.5 * a) * 0.25 + bayer2(a);
}

float bayer8(vec2 a) {
  return bayer4(0.5 * a) * 0.25 + bayer2(a);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = rot(uRoll) * ((frag - 0.5 * uRes) / uRes.y);

  // The idle sway fades out while the cursor is steering the lock.
  float sway = 1.0 - 0.75 * uEngage;
  float yaw = sin(uTime * 0.35) * 0.7 * sway + uMouse.x * 0.75;
  float pitch = -0.16 + uMouse.y * 0.3 + sin(uTime * 0.45) * 0.05 * sway;
  mat2 rp = rot(pitch);
  mat2 ry = rot(yaw);

  vec3 ro = vec3(0.0, 0.0, 3.3 + uShape * 0.8 + openLift() * 0.55);
  vec3 rd = normalize(vec3(uv, -1.7));
  vec3 light = normalize(vec3(-0.55, 0.7, 0.75));
  ro.yz = rp * ro.yz;
  rd.yz = rp * rd.yz;
  light.yz = rp * light.yz;
  ro.xz = ry * ro.xz;
  rd.xz = ry * rd.xz;
  light.xz = ry * light.xz;

  float t = 0.0;
  bool hit = false;
  for (int i = 0; i < 90; i++) {
    float d = map(ro + rd * t);
    if (d < 0.0015) {
      hit = true;
      break;
    }
    t += d * 0.9;
    if (t > 7.0) break;
  }

  if (!hit) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec3 p = ro + rd * t;
  vec3 n = calcNormal(p);
  float diffuse = max(dot(n, light), 0.0);
  float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  float lum = 0.06 + diffuse * 0.86 + fresnel * 0.25;
  float glow = 0.0;

  if (uShape < 0.5) {
    vec3 b = bodySpace(p);
    if (abs(sdKeyhole(b)) < 0.012 && sdBodyBox(b) < -0.004) glow = 1.0;
  } else {
    float id = serverId(p);
    vec3 q = p - vec3(0.0, id * 0.46, 0.0);
    if (q.z > 0.585) {
      if (q.x < 0.42) lum *= 0.55 + 0.45 * step(0.5, fract(q.y * 16.0 + 0.25));
      vec2 led = vec2(fract(q.x * 9.0) - 0.5, q.y * 5.5);
      if (q.x > 0.5 && q.x < 0.8 && length(led) < 0.28) {
        glow = step(0.45, fract(uTime * 0.8 + id * 0.37 + floor(q.x * 9.0) * 0.21));
      }
    }
  }

  float threshold = bayer8(frag);
  bool lit = lum > threshold;
  vec3 color = lit ? uPaper : uInk;
  if (lit && fresnel > 0.62 - uOpen * 0.2) color = uAccent;

  float scan = 1.0 - fract(uTime / 6.5);
  if (abs(frag.y / uRes.y - scan) < 0.012 && lum > threshold * 0.6) color = uAccent;
  if (glow > 0.5) color = threshold > 0.92 ? uPaper : uAccent;

  gl_FragColor = vec4(color, 1.0);
}
`;
