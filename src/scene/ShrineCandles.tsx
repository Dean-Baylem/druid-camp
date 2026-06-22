import * as THREE from "three";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import candleVertexShader from "../shaders/candle/vertex.glsl";
import candleFragmentShader from "../shaders/candle/fragment.glsl";

const FlameMaterial = shaderMaterial(
    {
        uTime: 0,
        uNoise: new THREE.Texture(),
        uTimeOffset: 0,
    },
    candleVertexShader,
    candleFragmentShader,
);

extend({ FlameMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        flameMaterial: ThreeElement<typeof FlameMaterial>;
    }
}

export default function ShrineCandles() {
    const noiseTexture = useTexture("/perlin/noiseTexture.png");
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;

    const candleFlames = [
        {
            position: { x: 6.897, y: -1.554, z: -4.5951 },
            rotation: { x: 0, y: -0.29, z: 0 },
        },
        {
            position: { x: 5.195, y: -1.54, z: -5.319 },
            rotation: { x: 0, y: -0.29, z: 0 },
        },
        {
            position: { x: 5.4371, y: -1.344, z: -5.95 },
            rotation: { x: 0, y: -0.29, z: 0 },
        },
        {
            position: { x: 7.164, y: -1.327, z: -5.2227 },
            rotation: { x: 0, y: -0.29, z: 0 },
        },
    ];

    const flameMaterialRefs = useRef<InstanceType<typeof FlameMaterial>[]>([]);

    useFrame((_state, delta) => {
        flameMaterialRefs.current.forEach((material, _) => {
            material.uTime += delta;
        });
    });

    return (
        <>
        {candleFlames.map((flame, i) => (
            <pointLight 
                key={`candleLight${i}`}
                position={[flame.position.x, flame.position.y + 0.05, flame.position.z]}
                color="#ff9a3c"
                intensity={0.1}
                distance={0.5}
                decay={4}
            />
        ))}
            {candleFlames.map((flame, i) => {
                return Array.from({ length: 4 }).map((_, j) => (
                    <mesh
                        key={`candleFlame${i}-${j}`}
                        position={[flame.position.x, flame.position.y, flame.position.z]}
                        scale={[1, 1, 1]}
                        rotation={[0, (Math.PI / 4) * j, 0]}
                    >
                        <planeGeometry
                            args={[0.03, 0.06, 16, 24]}
                            attach="geometry"
                        />
                        <flameMaterial
                            ref={(material) => {
                                if (material) flameMaterialRefs.current[i * 4 + j] = material;
                            }}
                            uTimeOffset={i * 0.1 * j * 0.25}
                            uNoise={noiseTexture}
                            attach="material"
                            side={THREE.DoubleSide}
                            transparent
                        />
                    </mesh>
                ));
            })}
        </>
    );
}
