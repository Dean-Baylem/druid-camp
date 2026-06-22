import { OrbitControls, Stars } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Scene from "./scene/Scene";
import { useControls } from "leva";
import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";

function CameraControls() {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const { camera } = useThree();

    const { camX, camY, camZ, targetX, targetY, targetZ } = useControls("Camera", {
        camX: 5,
        camY: 3,
        camZ: 5,
        targetX: 7.0,
        targetY: -1.00,
        targetZ: -11.00,
    });

    useEffect(() => {
        camera.position.set(camX, camY, camZ);

        if (controlsRef.current) {
            controlsRef.current.target.set(targetX, targetY, targetZ);
            controlsRef.current.update();
        }
    }, [camX, camY, camZ, targetX, targetY, targetZ, camera]);

    return (
        <OrbitControls
            ref={controlsRef}
            minDistance={8}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2.2}
            makeDefault
        />
    );
}

export default function Experience() {

    return (
        <>
            <fog
                attach="fog"
                args={["#08111d", 4, 20]}
            />
            <color
                args={["#08111d"]}
                attach="background"
            />
            <CameraControls />
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
            />

            <ambientLight intensity={0.2} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={0.7}
                castShadow
            />
            <Scene />
        </>
    );
}
