attribute float aSize;
attribute float aLifetime;
attribute float aMaxLifetime;

varying float vLifetimeProgress;

void main() {
    vLifetimeProgress = 1.0 - (aLifetime / aMaxLifetime);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Ember shrinking as it ages
    float sizeFade = 1.0 - vLifetimeProgress;
    gl_PointSize = aSize * sizeFade * (1.0 / -mvPosition.z * 10.0);
    gl_PointSize = clamp(gl_PointSize, 2.0, 10.0);
    gl_Position = projectionMatrix * mvPosition;
}