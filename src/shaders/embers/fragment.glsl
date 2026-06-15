varying float vLifetimeProgress;

void main() {
    float dist = length(gl_PointCoord - 0.5);
    if (dist > 0.5) discard;

    // Shape and Fade ember
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= 1.0 - vLifetimeProgress;

    // Color shift with age
    vec3 colorYoung = vec3(1.0, 0.8, 0.3);
    vec3 colorMid = vec3(1.0, 0.4, 0.05);
    vec3 colorOld = vec3(0.4, 0.02, 0.0);

    vec3 color = mix(colorYoung, colorMid, min(vLifetimeProgress * 2.0, 1.0));
    color = mix(color, colorOld, max(0.0, vLifetimeProgress * 2.0 - 1.0));
    color = min(color, colorYoung);

    gl_FragColor = vec4(color, alpha);
}