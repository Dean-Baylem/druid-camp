import { Center, useGLTF } from "@react-three/drei";

export default function Campfire() {
    const { scene } = useGLTF("/models/campfire/campfire.glb");

    return (
        <Center top>
            <primitive object={scene} />
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[2.5, 32]} />
                <shaderMaterial />
            </mesh>
            {/* <Fire /> */}
        </Center>
    );
}
