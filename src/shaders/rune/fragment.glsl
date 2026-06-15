uniform vec3 uRuneColor;
uniform float uTime;
uniform sampler2D uNoise;

varying vec2 vUv;


void main()
{
    float strength = texture2D(uNoise, vUv).r;
    strength = strength * 2.5 + 0.5;

    // Final Color
    vec3 blackColor = vec3(0.0);
    vec3 mixedColor = mix(blackColor, uRuneColor, strength);

    gl_FragColor = vec4(mixedColor, 1.0);
}
