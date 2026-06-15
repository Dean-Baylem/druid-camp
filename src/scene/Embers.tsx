import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import type { ThreeElement } from "@react-three/fiber";
import emberVertexShader from "../shaders/embers/vertex.glsl";
import emberFragmentShader from "../shaders/embers/fragment.glsl";

const PARTICLE_COUNT = 100;

interface Ember {
    lifetime: number;
    maxLifetime: number;
    vx: number;
    vy: number;
    vz: number;
}

function generateEmber(): Ember {
    return {
        lifetime: Math.random() * 1.5 + 0.5,
        maxLifetime: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 1 - Math.random(),
        vz: (Math.random() - 0.5) * 0.6,
    };
}

const EmberMaterial = shaderMaterial({uTime: 0}, emberVertexShader, emberFragmentShader);

extend({ EmberMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        emberMaterial: ThreeElement<typeof EmberMaterial>;
    }
}

export default function Embers() {
    const pointsRef = useRef<THREE.Points>(null);

    const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
    const sizes = useMemo(() => new Float32Array(PARTICLE_COUNT), []);
    const lifetimes = useMemo(() => new Float32Array(PARTICLE_COUNT), []);
    const maxLifetimes = useMemo(() => new Float32Array(PARTICLE_COUNT), []);

    // Ember state for the positions and lifetime.
    const allEmbers = useMemo<Ember[]>(() => {
        return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
            const em = generateEmber();
            em.lifetime = Math.random() * em.maxLifetime;

            // Initialise positions
            positions[i * 3] = (Math.random() - 0.5) * 0.3;
            positions[i * 3 + 1] = Math.random() * 0.5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

            // Initialise the sizes and lifetimes
            sizes[i] = Math.random() * 6 + 3;
            lifetimes[i] = em.lifetime;
            maxLifetimes[i] = em.maxLifetime;

            return em;
        });
    }, []);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;

        const geo = pointsRef.current.geometry;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const em = allEmbers[i];
            em.lifetime -= delta;

            // Recyle embers to the base
            if (em.lifetime <= 0) {
                const newEm = generateEmber();
                allEmbers[i] = newEm;

                // Set the position at base of the flame
                positions[i * 3] = (Math.random() - 0.5) * 0.3;
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

                sizes[i] = Math.random() * 6 + 3;
                lifetimes[i] = newEm.lifetime;
                maxLifetimes[i] = newEm.maxLifetime;
                continue;
            }

            // Update ember position
            positions[i * 3] += em.vx * delta;
            positions[i * 3 + 1] += em.vy * delta;
            positions[i * 3 + 2] += em.vz * delta;

            // Drag on the embers movement
            em.vy *= 1 - delta * 0.4;
            em.vx *= 1 - delta * 0.3;
            em.vz *= 1 - delta * 0.3;

            lifetimes[i] = em.lifetime;
        }

        // Update the positions
        geo.attributes.position.needsUpdate = true;
        geo.attributes.aSize.needsUpdate = true;
        geo.attributes.aLifetime.needsUpdate = true;
        geo.attributes.aMaxLifetime.needsUpdate = true;
    });

    return (
        <points
            ref={pointsRef}
            position={[-0.05, -2.8, 0.4]}
            renderOrder={2}
        >
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-aSize"
                    args={[sizes, 1]}
                />
                <bufferAttribute
                    attach="attributes-aLifetime"
                    args={[lifetimes, 1]}
                />
                <bufferAttribute
                    attach="attributes-aMaxLifetime"
                    args={[maxLifetimes, 1]}
                />
            </bufferGeometry>
            <emberMaterial transparent depthWrite={false} />
        </points>
    );
}
