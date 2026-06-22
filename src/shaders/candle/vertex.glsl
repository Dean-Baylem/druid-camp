uniform float uTime;
uniform float uTimeOffset;

varying vec2 vUv;

void main()
{
    vUv = uv;

    vec3 pos = position;
    
    // Tighter at top of flame
    float taper = abs(uv.x - 0.5) * 2.0;
    pos.x *= mix(1.0, 0.0, pow(uv.y, 2.0) * taper);

    // // More sway towards the top of flame
    // float sway = sin(uTime + uTimeOffset * 3.0 + pos.y * 8.0) * 0.015;
    // pos.x += sway * uv.y;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}