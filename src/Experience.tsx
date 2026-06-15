import { OrbitControls } from "@react-three/drei";
import Scene from "./scene/Scene";

export default function Experience() {

    return (
        <>
            <color
                args={["#030202"]}
                attach="background"
            />
            <OrbitControls makeDefault />

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
