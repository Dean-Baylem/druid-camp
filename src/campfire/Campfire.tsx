import { Center, useGLTF } from "@react-three/drei";
import Fire from "./fire/Fire";
import floorVertexShader from "./shaders/floor/vertex.glsl";
import floorFragmentShader from "./shaders/floor/fragment.glsl";

export default function Campfire() {
    const { scene } = useGLTF("/models/campfire/campfire.glb");

    return (
        <Center top>
            <primitive object={scene} />
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[2.5, 32]} />
                <shaderMaterial
                    vertexShader={floorVertexShader}
                    fragmentShader={floorFragmentShader}
                />
            </mesh>
            {/* <Fire /> */}
        </Center>
    );
}
