import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Loader } from '@react-three/drei'
import './index.css'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience';

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Canvas
            camera={{
                position: [-1, -10, 6],
                fov: 45,
            }}
        >
            <Suspense fallback={null}>
                <Experience />
            </Suspense>
        </Canvas>
        <Loader />
    </StrictMode>,
);
