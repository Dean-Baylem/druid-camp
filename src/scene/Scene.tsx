import { Center, useGLTF } from "@react-three/drei";
import Campfire from "./Campfire";
import DruidGrove from "./DruidGrove";
import ShrineCandles from "./ShrineCandles";
import { Suspense } from "react";

export default function Scene() {
    const { nodes } = useGLTF("/models/scene/scene.glb");

    console.log(`Scene nodes:`, nodes);
    
    return (
        <>
            <Suspense fallback={null}>
                <Center>
                    <primitive object={nodes.merged} />
                    <primitive object={nodes.ground} />
                </Center>

                <Campfire />
                <DruidGrove />
                <ShrineCandles />
            </Suspense>
        </>
    );
}
