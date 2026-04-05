import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { shaderMaterial, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// ── Plasma shader — AI brain core ────────────────────────────────────────
const PlasmaMaterial = shaderMaterial(
  {
    time: 0,
    colorA: new THREE.Color('#00ffff'),
    colorB: new THREE.Color('#ff00ff'),
    opacity: 0.85,
  },
  /* vertex */ `
    uniform float time;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal   = normalize(normalMatrix * normal);
      vPosition = position;
      float wave = sin(position.x * 4.0 + time * 2.2) * 0.045
                 + cos(position.y * 3.5 + time * 1.7) * 0.045
                 + sin(position.z * 3.0 + time * 1.4) * 0.03;
      vec3 pos = position + normal * wave;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  /* fragment */ `
    uniform float time;
    uniform vec3  colorA;
    uniform vec3  colorB;
    uniform float opacity;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      float t = time * 0.45;
      float p = sin(vPosition.x * 5.5 + t)
              + sin(vPosition.y * 4.2 + t * 1.35)
              + sin(vPosition.z * 3.8 + t * 0.9)
              + sin(length(vPosition) * 7.0 - t * 2.1);
      p = (p + 4.0) / 8.0;
      vec3 col    = mix(colorA, colorB, p);
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.8);
      col  *= (1.4 + fresnel * 2.2);
      float pulse = 0.85 + sin(time * 3.0) * 0.15;
      gl_FragColor = vec4(col * pulse, opacity);
    }
  `
)
extend({ PlasmaMaterial })

// TypeScript — register JSX element
declare module '@react-three/fiber' {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plasmaMaterial: any
  }
}

const NODE_COUNT = 120

// ── Neural network cloud ──────────────────────────────────────────────────
function NeuralNet() {
  const groupRef   = useRef<THREE.Group>(null)
  const pointsRef  = useRef<THREE.Points>(null)
  const linesRef   = useRef<THREE.LineSegments>(null)
  const mouseSmooth = useRef({ x: 0, y: 0 })
  const { pointer } = useThree()

  const { nodeGeo, lineGeo } = useMemo(() => {
    const positions = new Float32Array(NODE_COUNT * 3)
    const colors    = new Float32Array(NODE_COUNT * 3)
    const vecs: THREE.Vector3[] = []

    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 2.2 + Math.random() * 2.8
      const x = r * Math.sin(phi) * Math.cos(theta) * 1.45
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.88
      const z = r * Math.cos(phi)
      positions[i*3]=x; positions[i*3+1]=y; positions[i*3+2]=z
      vecs.push(new THREE.Vector3(x, y, z))

      const c = Math.random()
      if      (c < 0.55) { colors[i*3]=0;   colors[i*3+1]=1;   colors[i*3+2]=1   } // cyan
      else if (c < 0.80) { colors[i*3]=1;   colors[i*3+1]=0;   colors[i*3+2]=1   } // magenta
      else               { colors[i*3]=0.3; colors[i*3+1]=0.5; colors[i*3+2]=1   } // blue
    }

    const nodeGeo = new THREE.BufferGeometry()
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    nodeGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))

    const lineArr: number[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      let count = 0
      for (let j = i+1; j < NODE_COUNT; j++) {
        if (count >= 3) break
        if (vecs[i].distanceTo(vecs[j]) < 2.0) {
          lineArr.push(vecs[i].x,vecs[i].y,vecs[i].z, vecs[j].x,vecs[j].y,vecs[j].z)
          count++
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineArr), 3))
    return { nodeGeo, lineGeo }
  }, [])

  useEffect(() => {
    return () => {
      nodeGeo.dispose()
      lineGeo.dispose()
    }
  }, [nodeGeo, lineGeo])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Smooth mouse tracking
    mouseSmooth.current.x += (pointer.x * 0.55 - mouseSmooth.current.x) * 0.04
    mouseSmooth.current.y += (-pointer.y * 0.35 - mouseSmooth.current.y) * 0.04

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04 + mouseSmooth.current.x
      groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.12 + mouseSmooth.current.y
    }
    if (pointsRef.current) {
      const m = pointsRef.current.material as THREE.PointsMaterial
      m.size    = 0.048 + Math.sin(t * 1.8) * 0.016
      m.opacity = 0.68 + Math.sin(t * 2.1) * 0.22
    }
    if (linesRef.current) {
      const m = linesRef.current.material as THREE.LineBasicMaterial
      m.opacity = 0.14 + Math.sin(t * 0.7 + 1.0) * 0.07
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={nodeGeo}>
        <pointsMaterial size={0.052} vertexColors transparent opacity={0.82}
          sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color="#00eeff" transparent opacity={0.14} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

// ── Plasma brain core ─────────────────────────────────────────────────────
function Core() {
  const plasmaRef  = useRef<any>(null)
  const icoOutRef  = useRef<THREE.Mesh>(null)
  const ring1Ref   = useRef<THREE.Mesh>(null)
  const ring2Ref   = useRef<THREE.Mesh>(null)
  const ring3Ref   = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (plasmaRef.current) plasmaRef.current.time = t

    if (icoOutRef.current) {
      icoOutRef.current.rotation.x = -t * 0.17
      icoOutRef.current.rotation.z =  t * 0.21
      const m = icoOutRef.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 0.4 + Math.sin(t * 1.4) * 0.25
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.55
      ring1Ref.current.rotation.z  = Math.sin(t * 0.28) * 0.9
      const m = ring1Ref.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 5 + Math.sin(t * 2.5) * 2
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.42
      ring2Ref.current.rotation.x  = Math.PI/2 + Math.sin(t * 0.33) * 0.5
      const m = ring2Ref.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 4 + Math.cos(t * 2.1) * 2
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.3
      ring3Ref.current.rotation.y  = Math.sin(t * 0.2) * 0.6
      const m = ring3Ref.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 3 + Math.sin(t * 1.8 + 1.5) * 1.5
    }
  })

  return (
    <group>
      {/* Plasma-animated core */}
      <mesh>
        <icosahedronGeometry args={[0.55, 2]} />
        <plasmaMaterial ref={plasmaRef} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Outer wireframe shell */}
      <mesh ref={icoOutRef}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.4}
          wireframe transparent opacity={0.18} toneMapped={false}
        />
      </mesh>

      {/* Ring 1 — cyan equatorial */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.3, 0.009, 4, 120]} />
        <meshStandardMaterial
          color="#00ffff" emissive="#00ffff" emissiveIntensity={5}
          toneMapped={false} transparent opacity={0.95}
        />
      </mesh>

      {/* Ring 2 — magenta polar */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.98, 0.008, 4, 90]} />
        <meshStandardMaterial
          color="#ff00ff" emissive="#ff00ff" emissiveIntensity={4}
          toneMapped={false} transparent opacity={0.9}
        />
      </mesh>

      {/* Ring 3 — blue diagonal */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.1, 0.006, 4, 80]} />
        <meshStandardMaterial
          color="#4488ff" emissive="#4488ff" emissiveIntensity={3}
          toneMapped={false} transparent opacity={0.7}
        />
      </mesh>
    </group>
  )
}

// ── Orbiting energy orbs ──────────────────────────────────────────────────
function EnergyOrbs() {
  const orbCount = 12
  const meshRefs = useRef<(THREE.Mesh | null)[]>(Array(orbCount).fill(null))

  const orbConfig = useMemo(() => Array.from({ length: orbCount }, (_, i) => ({
    speed:  0.22 + i * 0.035,
    radius: 1.6 + (i * 0.3) % 1.2,
    phase:  (i / orbCount) * Math.PI * 2,
    yAmp:   0.6 + (i * 0.2) % 0.8,
    yFreq:  0.5 + (i * 0.1) % 0.5,
    size:   0.04 + (i * 0.01) % 0.04,
    color:  i % 3 === 0 ? '#ff00ff' : i % 3 === 1 ? '#00ffff' : '#4466ff',
    emissive: i % 3 === 0 ? '#ff00ff' : i % 3 === 1 ? '#00ffff' : '#4466ff',
  })), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const cfg   = orbConfig[i]
      const angle = cfg.phase + t * cfg.speed
      const yOff  = Math.sin(t * cfg.yFreq + i * 0.7) * cfg.yAmp
      mesh.position.set(Math.cos(angle) * cfg.radius, yOff, Math.sin(angle) * cfg.radius)
      const s = 0.55 + Math.sin(t * 2.5 + i) * 0.38
      mesh.scale.setScalar(s)
      const m = mesh.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 3 + Math.sin(t * 3.2 + i * 0.8) * 2
    })
  })

  return (
    <>
      {orbConfig.map((cfg, i) => (
        <mesh key={i} ref={el => { meshRefs.current[i] = el }}>
          <sphereGeometry args={[cfg.size, 6, 6]} />
          <meshStandardMaterial
            color={cfg.color} emissive={cfg.emissive}
            emissiveIntensity={3} toneMapped={false}
            transparent opacity={0.9}
          />
        </mesh>
      ))}
    </>
  )
}

// ── Volumetric-style point lights ─────────────────────────────────────────
function SceneLights() {
  const cyanRef    = useRef<THREE.PointLight>(null)
  const magentaRef = useRef<THREE.PointLight>(null)
  const blueRef    = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (cyanRef.current) {
      cyanRef.current.intensity = 1.8 + Math.sin(t * 1.5) * 0.8
      cyanRef.current.position.x = Math.sin(t * 0.4) * 3
      cyanRef.current.position.y = Math.cos(t * 0.3) * 2
    }
    if (magentaRef.current) {
      magentaRef.current.intensity = 1.5 + Math.sin(t * 1.8 + 2) * 0.7
      magentaRef.current.position.x = -Math.sin(t * 0.35) * 3
      magentaRef.current.position.y = -Math.cos(t * 0.25) * 2
    }
    if (blueRef.current) {
      blueRef.current.intensity = 1.0 + Math.sin(t * 1.2 + 4) * 0.4
    }
  })

  return (
    <>
      <ambientLight intensity={0.04} color="#000820" />
      <pointLight ref={cyanRef}    color="#00ffff" intensity={1.8} distance={12} position={[3, 2, 3]} />
      <pointLight ref={magentaRef} color="#ff00ff" intensity={1.5} distance={12} position={[-3, -2, -3]} />
      <pointLight ref={blueRef}    color="#4466ff" intensity={1.0} distance={10} position={[0, 4, -4]} />
    </>
  )
}

// ── Scene (inside Canvas) ─────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <SceneLights />
      <Core />
      <NeuralNet />
      <EnergyOrbs />

      {/* Slow cinematic camera orbit */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.7}
      />

      {/* Post-processing — bloom + vignette + film grain */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={2.8}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.6}
          mipmapBlur
          radius={0.85}
        />
        <Vignette offset={0.35} darkness={0.75} />
        <Noise
          blendFunction={BlendFunction.ADD}
          opacity={0.04}
        />
      </EffectComposer>
    </>
  )
}

// ── Export ────────────────────────────────────────────────────────────────
export default function NeuralNetwork3D() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(id)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 3.0, ease: 'easeInOut' }}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 9.5], fov: 48 }}
        style={{ background: 'transparent' }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
      >
        <Scene />
      </Canvas>
    </motion.div>
  )
}
