uniform float uTime;
uniform sampler2D uNoise;
uniform vec4 uWeights;

varying vec2 vUv;

float earthStrength() {
    vec2 warpUv = vUv * 2.0 + vec2(uTime * 0.01, -uTime * 0.015);

    float warpX = texture2D(uNoise, warpUv).r;
    float warpY = texture2D(uNoise, warpUv + 0.5).r;

    vec2 warp = vec2(warpX, warpY) - 0.5;
    warp *= 0.15;

    vec2 crackedUv = vUv + warp;

    float largeNoise = texture2D(uNoise, crackedUv * 2.0).r;
    float detailNoise = texture2D(uNoise, crackedUv * 8.0).r;

    float plates = floor(largeNoise * 5.0) / 5.0;

    float cracks = abs(largeNoise - 0.5);
    cracks = 1.0 - smoothstep(0.0, 0.05, cracks);

    float strength = plates * 0.7 + cracks * 0.3;
    strength += detailNoise * 0.1;

    return clamp(strength, 0.0, 1.0);
}

vec4 earthColor(float strength) {
    vec3 darkStone = vec3(0.15, 0.12, 0.08);
    vec3 stone     = vec3(0.25, 0.20, 0.12);
    vec3 sand      = vec3(0.65, 0.55, 0.35);
    vec3 gold      = vec3(1.0, 0.85, 0.35);

    vec3 color = mix(darkStone, stone, smoothstep(0.0, 0.35, strength));
    color = mix(color, sand, smoothstep(0.35, 0.7, strength));
    color = mix(color, gold, smoothstep(0.85, 1.0, strength));

    return vec4(color, 1.0);
}

float windStrength() {
    // Create Pass for the swirl
    vec2 center = vec2(0.5, 0.5);
    vec2 toCenter = vUv - center;
    float radius = length(toCenter);
    float angle = atan(toCenter.y, toCenter.x);
    float twist = 3.0;
    float rotation = uTime * 0.5;
    angle += rotation + (1.0 - radius) * twist;
    vec2 swirledUv = center + radius * vec2(cos(angle), sin(angle));

    // Create warp pass
    vec2 warpUv = swirledUv * 4.0 + vec2(uTime * 0.05 - uTime * 0.2);
    float warpX = texture2D(uNoise, warpUv).r;
    float warpY = texture2D(uNoise, warpUv + 0.5).r;
    vec2 warp = vec2(warpX, warpY) - 0.5;
    warp *= 0.8;

    vec2 distortedUv = swirledUv + warp;

    // First Layer - large scale, slow drift
    vec2 timeUv1 = distortedUv + vec2(0.0, -uTime * 0.15);
    float noise1 = texture2D(uNoise, timeUv1).r;

    // Second Layer - Small scale, for extra details
    vec2 timeUv2 = distortedUv * 5.0 + vec2(uTime * 0.2, uTime * 0.1);
    float noise2 = texture2D(uNoise, timeUv2).r;

    float strength = noise1 * 0.6 + noise2 * 0.4;
    return clamp(strength, 0.0, 1.0);
}


vec4 windColor(float strength) {
    vec3 darkColor = vec3(0.5, 0.5, 0.5);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);

    vec3 color = mix(darkColor, lightColor, smoothstep(0.2, 0.8, strength));
    float alpha = strength;
    return vec4(color, alpha);
}

float fireStrength() {
    // Domain Warp Pass
    vec2 warpUv = vUv * 1.5 + vec2(uTime * 0.05, -uTime * 0.07);
    float warpX = texture2D(uNoise, warpUv).r;
    float warpY = texture2D(uNoise, warpUv + 0.5).r;
    vec2 warp = vec2(warpX, warpY) - 0.5;
    warp *= 0.3;

    vec2 distortedUv = vUv + warp;

    // First Layer - large scale, slow drift
    vec2 timeUv1 = distortedUv + vec2(0.0, -uTime * 0.15);
    float noise1 = texture2D(uNoise, timeUv1).r;

    // Second Layer - Small scale, for extra details
    vec2 timeUv2 = distortedUv * 5.0 + vec2(uTime * 0.2, uTime * 0.1);
    float noise2 = texture2D(uNoise, timeUv2).r;

    float strength = noise1 * 0.6 + noise2 * 0.4;
    return clamp(strength, 0.0, 1.0);
}

vec4 fireColor(float strength) {
    vec3 darkColor = vec3(0.05, 0.0, 0.0);
    vec3 deepRed = vec3(0.5, 0.0, 0.0);
    vec3 orange = vec3(1.0, 0.4, 0.0);
    vec3 yellow = vec3(1.0, 0.9, 0.3);

    vec3 color = mix(darkColor, deepRed, smoothstep(0.0, 0.35, strength));
    color = mix(color, orange, smoothstep(0.35, 0.7, strength));
    color = mix(color, yellow, smoothstep(0.85, 1.0, strength));

    return vec4(color, 1.0);
}

float waterStrength() {
    // Two ripple sources
    vec2 origin1 = vec2(0.5, 0.5);
    vec2 origin2 = vec2(0.35, 0.6);

    float dist1 = length(vUv - origin1);
    float dist2 = length(vUv - origin2);

    // Rings expanding over time
    float ripple1 = sin(dist1 * 40.0 - uTime * 2.0);
    float ripple2 = sin(dist2 * 30.0 - uTime * 1.3);

    // Combine and normalize
    float strength = (ripple1 + ripple2) * 0.25 + 0.5;

    // Noise overlay to distory perfect circles
    vec2 noiseUv = vUv * 3.0 + vec2(uTime * 0.05, uTime * 0.03);
    float noise = texture2D(uNoise, noiseUv).r;
    strength += (noise - 0.5) * 0.15;

    return strength;
}

vec4 waterColor(float strength) {
    vec3 darkColor = vec3(0.0, 0.1, 0.3);
    vec3 deepBlue = vec3(0.0, 0.15, 0.45);
    vec3 cyan = vec3(0.1, 0.6, 0.7);
    vec3 white = vec3(1.0);

    vec3 color = mix(darkColor, deepBlue, smoothstep(0.0, 0.4, strength));
    color = mix(color, cyan, smoothstep(0.4, 0.75, strength));
    color = mix(color, white, smoothstep(0.85, 1.0, strength));

    return vec4(color, 1.0);
}


void main()
{
    // Get the strength
    float fireStrength = fireStrength();
    float waterStrength = clamp(waterStrength(), 0.0, 1.0);
    float windStrength = windStrength();
    float earthStrength = earthStrength();

    // Calculate the colors
    vec4 fColor = fireColor(fireStrength);
    vec4 wColor = waterColor(waterStrength);
    vec4 wiColor = windColor(windStrength);
    vec4 eColor = earthColor(earthStrength);

    vec4 finalColor = fColor * uWeights.x + wColor * uWeights.y + wiColor * uWeights.z + eColor * uWeights.w;

    gl_FragColor = vec4(finalColor);
}