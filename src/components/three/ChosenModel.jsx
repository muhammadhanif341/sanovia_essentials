import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds, Center, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { RoomEnvironment } from 'three-stdlib';
import { prefersReducedMotion } from '@/animations/media';
import './chosenModel.css';

const MODEL_URL = '/models/chosen-piece.glb';

/** The real .glb, recentred on its own bounding box so it spins around itself, not the scene origin. */
function Piece({ spinning }) {
  const group = useRef(null);
  const { scene } = useGLTF(MODEL_URL);
  useFrame((_, delta) => {
    if (spinning && group.current) group.current.rotation.y += delta * 0.12; // slow, subtle idle turn
  });
  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}
useGLTF.preload(MODEL_URL);

/**
 * Lighting + camera fit + interaction. `RoomEnvironment` is a procedurally-generated scene
 * (three-stdlib, no network fetch) baked into a PMREM once on mount — gives the model's metal
 * finish believable reflections without depending on a remote HDRI.
 */
function Scene({ reduce }) {
  const [dragging, setDragging] = useState(false);
  const resumeTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(resumeTimer.current), []);
  // RoomEnvironment (three-stdlib) is a plain factory that RETURNS a THREE.Scene — not a
  // component — so it's mounted via <primitive>, not JSX, and built once per Canvas lifetime.
  const roomEnv = useMemo(() => RoomEnvironment(), []);

  return (
    <>
      <hemisphereLight args={['#f3e9dc', '#1c140e', 0.85]} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} />
      <directionalLight position={[0, -3, 4]} intensity={0.4} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.35}>
          <Piece spinning={!reduce && !dragging} />
        </Bounds>
        <Environment frames={1} resolution={64}>
          <primitive object={roomEnv} />
        </Environment>
      </Suspense>
      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.6}
        onStart={() => {
          window.clearTimeout(resumeTimer.current);
          setDragging(true);
        }}
        onEnd={() => {
          // Interaction always wins over the idle spin while it's happening; resume a beat
          // after the user lets go rather than snapping straight back into motion.
          resumeTimer.current = window.setTimeout(() => setDragging(false), 2200);
        }}
      />
    </>
  );
}

/**
 * Pauses the render loop (not just visually, the actual rAF loop) when this frame isn't the
 * one currently shown — either scrolled off-screen, or crossfaded out by the pinned
 * ScrollStory (StickyStage toggles `visibility` via GSAP's autoAlpha, which a plain
 * IntersectionObserver can't see since all 4 frames occupy the same geometry when pinned).
 */
function useFrameActive(frameEl) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!frameEl) return undefined;
    let intersecting = true;
    const evaluate = () => setActive(intersecting && getComputedStyle(frameEl).visibility !== 'hidden');
    evaluate();
    const mo = new MutationObserver(evaluate);
    mo.observe(frameEl, { attributes: true, attributeFilter: ['style'] });
    const io = new IntersectionObserver((entries) => {
      intersecting = entries[0]?.isIntersecting ?? true;
      evaluate();
    });
    io.observe(frameEl);
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [frameEl]);
  return active;
}

/**
 * The "Chosen" step's 3D centrepiece (see sections/ScrollStory/ScrollStory.jsx). A real .glb,
 * not a render or a placeholder — drag/swipe to rotate, slow idle spin otherwise. Deliberately
 * skips `useMotion`/GSAP entirely: this is its own self-contained render loop, paused by
 * `frameloop` rather than reverted like the rest of the app's motion.
 *
 * `frameEl` — the [data-story-frame] DOM node this is mounted inside, used only to know when
 * to pause (see useFrameActive above). Dispose: R3F's <Canvas> already disposes its GL context,
 * geometries and materials on unmount — nothing extra to clean up here.
 */
export default function ChosenModel({ frameEl }) {
  const active = useFrameActive(frameEl);
  return (
    <div className="story__model" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ fov: 32, position: [0, 0.2, 4.5] }}
        frameloop={active ? 'always' : 'never'}
      >
        <Scene reduce={prefersReducedMotion()} />
      </Canvas>
    </div>
  );
}
