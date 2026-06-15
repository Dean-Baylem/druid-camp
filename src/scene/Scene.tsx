import { Center, useGLTF } from "@react-three/drei";
import Campfire from "./Campfire";
import DruidGrove from "./DruidGrove";

export default function Scene() {
    const { nodes, scene } = useGLTF("/models/scene/scene.glb");
    
    return (
        <>
            <Center>
                <primitive object={nodes.mergedGroup} />
                <primitive object={nodes.ground} />
            </Center>

            <Campfire />
            <DruidGrove />
        </>
    );
}
