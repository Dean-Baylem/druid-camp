import { Center, useGLTF } from "@react-three/drei";
import Campfire from "./Campfire";
import DruidGrove from "./DruidGrove";
import ShrineCandles from "./ShrineCandles";

export default function Scene() {
    const { nodes } = useGLTF("/models/scene/scene.glb");
    
    return (
        <>
            <Center>
                <primitive object={nodes.mergedGroup} />
                <primitive object={nodes.ground} />
            </Center>

            <Campfire />
            <DruidGrove />
            <ShrineCandles />
        </>
    );
}
