import * as THREE from "three";
import { useGLTF, shaderMaterial, useTexture } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { extend, useFrame } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import portalVertexShader from "../shaders/druidPortal/vertex.glsl";
import portalFragmentShader from "../shaders/druidPortal/fragment.glsl";
import { useControls } from 'leva';

const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uPortalColor: new THREE.Vector3(0, 0, 0),
        uNoise: new THREE.Texture(),
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

export default function DruidPortal({portalType}: {portalType: string}) {
    const { nodes } = useGLTF("/models/scene/scene.glb");
    const portalObj = nodes["druidPortal"] as THREE.Mesh;
    const portalMaterialRef = useRef<InstanceType<typeof PortalMaterial>>(null!);

    const { xPos, yPos, zPos, color } = useControls('Portal Position', {xPos: -6.4, yPos: -1.1, zPos: -7.7, color: { r: 1, g: 1, b: 1 }});

    const noiseTexture = useTexture("/perlin/noiseTexture.png");
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;

    useFrame((_state, delta) => {
        if (portalMaterialRef.current) {
            portalMaterialRef.current.uTime += delta;
            portalMaterialRef.current.uPortalColor.set( color.r / 255, color.g / 255, color.b / 255 );
        }
    });

    console.log(color);

    return (
        <>
            <mesh position={[xPos, yPos, zPos]}>
                <planeGeometry args={[1.4, 1.4, 24, 24]} />
                <portalMaterial ref={portalMaterialRef} uNoise={noiseTexture} side={THREE.DoubleSide} />
            </mesh>
        </>
    )
}
