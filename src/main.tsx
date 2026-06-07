import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Canvas>
      <Experience />
    </Canvas>
  </StrictMode>,
)
