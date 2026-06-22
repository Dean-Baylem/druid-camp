import * as THREE from "three";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { extend, useFrame } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import portalVertexShader from "../shaders/druidPortal/vertex.glsl";
import portalFragmentShader from "../shaders/druidPortal/fragment.glsl";


const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uNoise: new THREE.Texture(),
        uWeights: new THREE.Vector4(1, 0, 0, 0)
    },
    portalVertexShader,
    portalFragmentShader
);

extend({ PortalMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        portalMaterial: ThreeElement<typeof PortalMaterial>;
    }
}

type Weights = [number, number, number, number];
type PortalType = 'fireRune' | 'waterRune' | 'earthRune' | 'windRune';

const portalWeights: Record<PortalType, Weights> = {
    fireRune: [1, 0, 0, 0],
    waterRune: [0, 1, 0, 0],
    windRune: [0, 0, 1, 0],
    earthRune: [0, 0, 0, 1],
};

export default function DruidPortal({portalType}: {portalType: PortalType}) {
    const portalMaterialRef = useRef<InstanceType<typeof PortalMaterial>>(null!);
    const targetWeights = useRef(new THREE.Vector4(1, 0, 0, 0));

    const noiseTexture = useTexture("/perlin/noiseTexture.png");
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;

    useFrame((_, delta) => {
        if (portalMaterialRef.current) {
            portalMaterialRef.current.uTime += delta;
            portalMaterialRef.current.uWeights.lerp(targetWeights.current, delta * 2);
        }
    });

    useEffect(() => {
        if (portalMaterialRef.current) {
            const chosenColor = portalWeights[portalType] || portalWeights.fireRune;
            targetWeights.current.set(...chosenColor);
        }
    }, [portalType]);

    return (
        <>
            <mesh position={[-6.35, -1.1, -7.7]}>
                <planeGeometry args={[1.46, 1.65, 24, 24]} />
                <portalMaterial ref={portalMaterialRef} uNoise={noiseTexture} side={THREE.DoubleSide} transparent depthWrite={false}/>
            </mesh>
        </>
    )
}
