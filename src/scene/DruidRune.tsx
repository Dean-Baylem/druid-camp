import * as THREE from "three";
import { shaderMaterial, useGLTF, useTexture } from "@react-three/drei";
import { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
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

export default function DruidRune({
    color,
    runeName,
    position,
    activeSwitch,
}: {
    color: [number, number, number];
    runeName: string;
    position: [number, number, number];
    activeSwitch: (runeName: string) => void;
}) {
    const { nodes } = useGLTF("/models/scene/scene.glb");
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
        <group
            position={new THREE.Vector3(...position)}
            onClick={() => {
                activeSwitch(runeName);
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
    );
}
