import * as THREE from "three";
import { shaderMaterial, useGLTF, useTexture, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import type { ThreeElement, ThreeEvent } from "@react-three/fiber";
import runeVertexShader from "../shaders/rune/vertex.glsl";
import runeFragmentShader from "../shaders/rune/fragment.glsl";

const RuneMaterial = shaderMaterial(
    {
        uTime: 0,
        uRuneColor: new THREE.Vector3(0, 0, 0),
        uNoise: new THREE.Texture(),
    },
    runeVertexShader,
    runeFragmentShader,
);

extend({ RuneMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        runeMaterial: ThreeElement<typeof RuneMaterial>;
    }
}

type PortalType = "fireRune" | "waterRune" | "earthRune" | "windRune";

export default function DruidRune({
    color,
    runeName,
    position,
    activeSwitch,
}: {
    color: [number, number, number];
    runeName: string;
    position: [number, number, number];
    activeSwitch: (runeName: PortalType) => void;
}) {
    const { nodes } = useGLTF("/models/scene/scene.glb");
    console.log(nodes);
    const runeObj = nodes[runeName] as THREE.Mesh;
    const runeMaterialRef = useRef<InstanceType<typeof RuneMaterial>>(null!);

    const noiseTexture = useTexture("/perlin/noiseTexture.png");
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;

    useFrame((_state, delta) => {
        if (runeMaterialRef.current) {
            runeMaterialRef.current.uTime += delta;
        }
    });

    return (
        <>
            <Sparkles
                size={12}
                scale={[0.5, 0.5, 0.5]}
                color={new THREE.Color(...color)}
                speed={0.5}
                count={40}
                position={new THREE.Vector3(...position)}
            />
            <group
                position={new THREE.Vector3(...position)}
                onClick={(e: ThreeEvent<MouseEvent>) => {
                    e.stopPropagation();
                    activeSwitch(runeName as PortalType);
                }}
            >
                {/* Clickable Area */}
                <mesh visible={false}>
                    <sphereGeometry args={[0.25]} />
                </mesh>
                <mesh
                    geometry={runeObj.geometry}
                    rotation={runeObj.rotation}
                    scale={runeObj.scale}
                >
                    <runeMaterial
                        ref={runeMaterialRef}
                        uNoise={noiseTexture}
                        uRuneColor={new THREE.Vector3(...color)}
                    />
                </mesh>
            </group>
        </>
    );
}
