import { OrbitControls, Stars } from "@react-three/drei";
import Scene from "./scene/Scene";

export default function Experience() {

    return (
        <>
            <fog
                attach="fog"
                args={["#08111d", 10, 20]}
            />
            <color
                args={["#08111d"]}
                attach="background"
            />
            <OrbitControls
                minDistance={2}
                maxDistance={30}
                maxPolarAngle={Math.PI / 2.2}
                enableDamping
                makeDefault
            />

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
