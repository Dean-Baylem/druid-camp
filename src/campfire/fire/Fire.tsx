import * as THREE from 'three'

export default function Fire() {
    return (
        <mesh position={[0.15, 0.75, -0.1]}>
            <planeGeometry args={[0.75, 1.5, 10, 20]} />
            <shaderMaterial transparent depthWrite={false} side={THREE.DoubleSide}/>
        </mesh>
    )
}