import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import campfireVertexShader from "../shaders/campfire/vertex.glsl";
import campfireFragmentShader from "../shaders/campfire/fragment.glsl";
import Embers from "./Embers";

const textureLoader = new THREE.TextureLoader();
const perlinTexture = textureLoader.load("./perlin/noiseTexture.png");
perlinTexture.wrapS = THREE.RepeatWrapping;
perlinTexture.wrapT = THREE.RepeatWrapping;

const CampfireMaterial = shaderMaterial(
    {
        uTime: 0,
        uNoise: perlinTexture,
        uSpeed: 0.7,
        uIntensity: 2.0,
    },
    campfireVertexShader,
    campfireFragmentShader,
);

extend({ CampfireMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        campfireMaterial: ThreeElement<typeof CampfireMaterial>;
    }
}

export default function Campfire() {
    const materialsRef = useRef<InstanceType<typeof CampfireMaterial>[]>([]);
    const pointLightRef = useRef<THREE.PointLight>(null!);
    const targetIntensity = useRef(6);

    useFrame((state, delta) => {
        materialsRef.current.forEach((mat) => {
            if (mat) mat.uTime += delta;
        });

        if (Math.random() < 0.03) {
            const changeDirection = Math.random() < 0.5 ? -1 : 1;
            const change = changeDirection * Math.random();
            targetIntensity.current = THREE.MathUtils.clamp(targetIntensity.current + change * 1.5, 4, 8);
        }

        const distance = Math.abs(targetIntensity.current - pointLightRef.current.intensity);
        const easedSpeed = THREE.MathUtils.lerp(2, 8, Math.min(distance / 4, 1));
        pointLightRef.current.intensity = THREE.MathUtils.lerp(pointLightRef.current.intensity, targetIntensity.current, delta * easedSpeed);
    });

    return (
        <>
            <pointLight
                color="#ff9a3c"
                intensity={6}
                distance={8}
                decay={1.5}
                position={[-0.05, -2.1, 0.45]}
                ref={pointLightRef}
            />
            {Array.from({ length: 4 }).map((_, i) => (
                <mesh
                    position={[-0.05, -2.4, 0.45]}
                    key={`campfire-plane-${i}`}
                    rotation={[0, (Math.PI / 4) * i, 0]}
                    renderOrder={1}
                >
                    <planeGeometry
                        args={[1, 1, 16, 64]}
                        attach="geometry"
                    />
                    <campfireMaterial
                        ref={(el) => (materialsRef.current[i] = el!)}
                        side={THREE.DoubleSide}
                        transparent
                        depthWrite={false}
                    />
                </mesh>
            ))}
            <Embers />
        </>
    );
}
