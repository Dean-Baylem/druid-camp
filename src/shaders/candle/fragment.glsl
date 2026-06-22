uniform sampler2D uNoise;
uniform float uTime;

varying vec2 vUv;

void main()
{
    // Fade the edges
    float horizontalMask = 1.0 - abs(vUv.x - 0.5) * 2.0;
    horizontalMask = smoothstep(0.0, 0.5, horizontalMask);

    // Fade towards top
    float verticalMask = 1.0 - pow(vUv.y, 1.5);
    
    float mask = horizontalMask * verticalMask;

    // Warping
    vec2 warpUv = vUv * 3.0 + vec2(uTime * 0.1, -uTime * 0.3);
    float warpX = texture2D(uNoise, warpUv).r;
    float warpY = texture2D(uNoise, warpUv + 0.5).r;
    vec2 warp = vec2(warpX, warpY) - 0.5;
    warp *= 0.3;

    vec2 distortedUv = vUv + warp;

    // Noise Layers
    vec2 timeUv1 = distortedUv + vec2(0.0, -uTime * 0.4);
    float noise1 = texture2D(uNoise, timeUv1).r;

    vec2 timeUv2 = distortedUv * 4.0 + vec2(uTime * 0.3, -uTime * 0.5);
    float noise2 = texture2D(uNoise, timeUv2).r;

    float strength = clamp(noise1 * 0.6 + noise2 * 0.4, 0.0, 1.0);

    // Color Mixing
    vec3 darkColor = vec3(0.05, 0.0, 0.0);
    vec3 deepRed = vec3(0.5, 0.0, 0.0);
    vec3 orange = vec3(1.0, 0.4, 0.0);
    vec3 yellow = vec3(1.0, 0.9, 0.3);

    vec3 color = mix(darkColor, deepRed, smoothstep(0.0, 0.35, strength));
    color = mix(color, orange, smoothstep(0.35, 0.5, strength));
    color = mix(color, yellow, smoothstep(0.5, 1.0, strength));

    // Alpha mask
    float alpha = mask * strength;

    gl_FragColor = vec4(color, alpha);
}