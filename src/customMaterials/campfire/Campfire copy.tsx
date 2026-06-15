import { useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import * as THREE from "three";

import campfireVertexShader from "./vertex.glsl";
import campfireFragmentShader from "./fragment.glsl";

const CampFireMaterial = shaderMaterial(
    {
        uTime: 0,
    },
    campfireVertexShader,
    campfireFragmentShader,
);

extend({ CampFireMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        campFireMaterial: ThreeElement<typeof CampFireMaterial>;
    }
}

export default function Campfire_({ geometry, position, rotation }: { geometry: THREE.BufferGeometry; position: THREE.Vector3; rotation: THREE.Euler }) {
    const materialRef = useRef<InstanceType<typeof CampFireMaterial>>(null!);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uTime = clock.elapsedTime;
        }
    });

    return (
        <mesh
            geometry={geometry}
            position={position}
            rotation={rotation}
        >
            {/* <campFireMaterial ref={materialRef} /> */}
            <shaderMaterial />
        </mesh>
    );
}
