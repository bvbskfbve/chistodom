
'use client';

import { Canvas } from '@react-three/fiber';
import {
  ContactShadows,
  OrbitControls,
  RoundedBox,
  useProgress,
  Html,
  useGLTF
} from '@react-three/drei';
import {
  Suspense,
  useRef,
  useState,
  useEffect,
  Component,
  type ReactNode
} from 'react';

const navy = '#172D50';
const beige = '#B9A18A';

function Loading() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="sceneLoading">
        Подготавливаем 3D · {Math.round(progress)}%
      </div>
    </Html>
  );
}


function Sofa() {
  return (
    <group position={[0, -0.28, 0]}>
      {/* Корпус дивана */}
      <RoundedBox args={[2.65, 0.43, 1.08]} radius={0.13} smoothness={12} position={[0, 0.43, 0]}>
        <meshStandardMaterial color={navy} roughness={0.96} />
      </RoundedBox>

      {/* Сиденье */}
      <RoundedBox args={[2.13, 0.23, 0.88]} radius={0.09} smoothness={12} position={[0, 0.68, 0.07]}>
        <meshStandardMaterial color={navy} roughness={0.98} />
      </RoundedBox>

      {/* Спинка */}
      <RoundedBox args={[2.57, 0.96, 0.24]} radius={0.12} smoothness={14} position={[0, 0.91, -0.42]}>
        <meshStandardMaterial color={navy} roughness={0.96} />
      </RoundedBox>

      {/* Три подушки */}
      {[-0.78, 0, 0.78].map((x, i) => (
        <RoundedBox key={i} args={[0.82, 0.70, 0.13]} radius={0.085} smoothness={12} position={[x, 0.98, -0.275]}>
          <meshStandardMaterial color={navy} roughness={0.98} />
        </RoundedBox>
      ))}

      {/* Подлокотники */}
      {[-1, 1].map(side => (
        <RoundedBox key={side} args={[0.29, 0.68, 0.98]} radius={0.12} smoothness={14} position={[side * 1.18, 0.63, 0.02]}>
          <meshStandardMaterial color={navy} roughness={0.95} />
        </RoundedBox>
      ))}

      {/* Бежевое основание */}
      <RoundedBox args={[2.53, 0.10, 0.91]} radius={0.035} smoothness={8} position={[0, 0.17, 0]}>
        <meshStandardMaterial color={beige} roughness={0.8} />
      </RoundedBox>

      {/* Ножки */}
      {[-1, 1].map(x =>
        [-1, 1].map(z => (
          <mesh key={`${x}-${z}`} position={[x * 1.1, -0.04, z * 0.36]}>
            <cylinderGeometry args={[0.045, 0.06, 0.42, 20]} />
            <meshStandardMaterial color={beige} roughness={0.78} />
          </mesh>
        ))
      )}
    </group>
  );
}


function Armchair() {
  return (
    <group position={[0, -0.28, 0]}>
      {/* Нижнее основание */}
      <RoundedBox
        args={[1.38, 0.30, 1.12]}
        radius={0.13}
        smoothness={14}
        position={[0, 0.43, 0]}
      >
        <meshStandardMaterial color={navy} roughness={0.95} />
      </RoundedBox>

      {/* Мягкое сиденье */}
      <RoundedBox
        args={[1.30, 0.25, 0.96]}
        radius={0.13}
        smoothness={16}
        position={[0, 0.65, 0.06]}
      >
        <meshStandardMaterial color={navy} roughness={0.98} />
      </RoundedBox>

      {/* Высокая спинка */}
      <RoundedBox
        args={[1.30, 1.05, 0.25]}
        radius={0.16}
        smoothness={16}
        position={[0, 0.91, -0.39]}
      >
        <meshStandardMaterial color={navy} roughness={0.96} />
      </RoundedBox>

      {/* Центральная подушка спинки */}
      <RoundedBox
        args={[1.12, 0.78, 0.12]}
        radius={0.12}
        smoothness={14}
        position={[0, 0.98, -0.245]}
      >
        <meshStandardMaterial color={navy} roughness={0.98} />
      </RoundedBox>

      {/* Объёмные подлокотники */}
      {[-1, 1].map(side => (
        <RoundedBox
          key={side}
          args={[0.27, 0.68, 0.98]}
          radius={0.13}
          smoothness={16}
          position={[side * 0.69, 0.65, 0.02]}
        >
          <meshStandardMaterial color={navy} roughness={0.95} />
        </RoundedBox>
      ))}

      {/* Бежевое основание */}
      <RoundedBox
        args={[1.20, 0.10, 0.88]}
        radius={0.04}
        smoothness={10}
        position={[0, 0.20, 0]}
      >
        <meshStandardMaterial color={beige} roughness={0.8} />
      </RoundedBox>

      {/* Ножки */}
      {[-1, 1].map(x =>
        [-1, 1].map(z => (
          <mesh
            key={`${x}-${z}`}
            position={[x * 0.52, -0.04, z * 0.34]}
          >
            <cylinderGeometry args={[0.045, 0.06, 0.42, 20]} />
            <meshStandardMaterial color={beige} roughness={0.78} />
          </mesh>
        ))
      )}
    </group>
  );
}


function Chair() {
  return (
    <group position={[0, -0.28, 0]}>
      {/* Мягкое сиденье */}
      <RoundedBox
        args={[0.92, 0.20, 0.82]}
        radius={0.09}
        smoothness={14}
        position={[0, 0.56, 0.02]}
      >
        <meshStandardMaterial color={navy} roughness={0.96} />
      </RoundedBox>

      {/* Спинка */}
      <RoundedBox
        args={[0.92, 0.82, 0.17]}
        radius={0.09}
        smoothness={14}
        position={[0, 1.02, -0.32]}
      >
        <meshStandardMaterial color={navy} roughness={0.96} />
      </RoundedBox>

      {/* Ножки */}
      {[-1, 1].map(x =>
        [-1, 1].map(z => (
          <mesh
            key={`${x}-${z}`}
            position={[x * 0.34, 0.20, z * 0.29]}
          >
            <cylinderGeometry args={[0.035, 0.05, 0.62, 16]} />
            <meshStandardMaterial color={beige} roughness={0.76} />
          </mesh>
        ))
      )}

      {/* Перекладины */}
      {[-1, 1].map(x => (
        <mesh key={x} position={[x * 0.34, 0.40, -0.12]}>
          <boxGeometry args={[0.055, 0.065, 0.4]} />
          <meshStandardMaterial color={beige} roughness={0.78} />
        </mesh>
      ))}
    </group>
  );
}




function Mattress() {
  const { scene } = useGLTF('/models/mattress.glb');

  return (
    <group position={[0, -0.25, 0]}>
      <primitive
        object={scene}
        scale={1}
      />
    </group>
  );
}



class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="sceneFallback">
          <div className="fallbackObject">▰</div>
          <span>3D временно недоступно</span>
          <button onClick={() => this.setState({ failed: false })}>
            Повторить
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}


function Model({ kind }: { kind: string }) {
  if (kind === 'mattress') return <Mattress />;
  if (kind === 'chair') return <Chair />;
  if (kind === 'armchair') return <Armchair />;
  return <Sofa />;
}


export default function FurnitureScene({
  kind = 'sofa'
}: {
  kind?: string;
}) {
  const controls = useRef<any>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    setSupported(
      !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  }, [retry]);

  if (supported === false) {
    return (
      <div className="sceneFallback">
        <span>3D недоступно в этом браузере</span>
        <button onClick={() => {
          setSupported(null);
          setRetry(x => x + 1);
        }}>
          Повторить
        </button>
      </div>
    );
  }

  if (supported === null) {
    return <div className="sceneFallback">Подготавливаем 3D…</div>;
  }

  return (
    <div className="sceneWrap">
      <SceneBoundary>
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [4.3, 3.1, 5.6], fov: 40 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'low-power'
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#000000', 0);
          }}
        >
          <ambientLight intensity={1.15} />
          <hemisphereLight args={['#f5f1e8', '#77716a', 0.55]} />
          <directionalLight position={[3, 6, 4]} intensity={2} />
          <directionalLight position={[-4, 2, -3]} intensity={0.65} />

          <Suspense fallback={<Loading />}>
            <Model kind={kind} />
            <ContactShadows
              position={[0, -0.62, 0]}
              opacity={0.28}
              scale={5}
              blur={2.5}
              far={3}
            />
          </Suspense>

          <OrbitControls
            ref={controls}
            makeDefault
            target={[0, 0.48, 0]}
            enablePan={false}
            minDistance={4.2}
            maxDistance={9}
            minPolarAngle={0.55}
            maxPolarAngle={1.48}
            rotateSpeed={0.72}
            zoomSpeed={0.7}
          />
        </Canvas>
      </SceneBoundary>

      <button
        className="sceneReset"
        onClick={() => controls.current?.reset()}
        aria-label="Сбросить ракурс"
        title="Сбросить ракурс"
      >
        ↺
      </button>

      <div className="sceneHint">
        Поверните предмет пальцем или мышью
      </div>
    </div>
  );
}
