import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Canvas
      camera={{
        position: [-1, -10, 6],
        fov: 45,
      }}
    >
      <Experience />
    </Canvas>
  </StrictMode>,
)
