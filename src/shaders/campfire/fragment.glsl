uniform float uTime;
uniform sampler2D uNoise;
uniform float uSpeed;
uniform float uIntensity;

varying vec2 vUv;

void main() {
  // Scroll UVs upward over time
  float scrollSpeed = uSpeed * (1.0 - vUv.y * 0.4);
  vec2 scrolledUv = vUv + vec2(0.0, -uTime * uSpeed * 0.4);

  // Sample noise twice at different scales for turbulence
  float noise1 = texture2D(uNoise, scrolledUv).r;
  float noise2 = texture2D(uNoise, scrolledUv * 2.0 + 0.3).r;
  float noise = (noise1 + noise2) * 0.5;

  // Flame shape
  float distFromCenter = abs(vUv.x - 0.5) * 2.0;
  float heightFactor = vUv.y;
  float flameMask = 1.0 - (distFromCenter + heightFactor * 0.8);
  flameMask = clamp(flameMask * uIntensity + noise - 0.3, 0.0, 1.0);

  // Feather edges
  float edgeX = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
  float edgeY = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
  flameMask *= edgeX * edgeY;

  // Create the color gradient
  vec3 colorBottom = vec3(1.0, 0.6, 0.3);
  vec3 colorMid    = vec3(1.0, 0.4, 0.05);
  vec3 colorTop    = vec3(0.6, 0.05, 0.0);

  float t = vUv.y;
  vec3 color = mix(colorBottom, colorMid, t);
  color = mix(color, colorTop, t * t);

  // Alpha fades out at top and edges
  float alpha = flameMask * (1.0 - vUv.y * 0.8);

  gl_FragColor = vec4(color, alpha);
}