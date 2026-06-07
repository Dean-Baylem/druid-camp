import { OrbitControls } from "@react-three/drei";
import Campfire from "./campfire/Campfire";

export default function Experience() {

    return (
        <>
            <color
                args={["#030202"]}
                attach="background"
            />
            <OrbitControls makeDefault />

            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />

            <Campfire />
        </>
    );
}
