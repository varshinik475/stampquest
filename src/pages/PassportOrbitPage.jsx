import { useEffect, useRef, useState } from 'react';

const palettes = [
  { name: 'Sea glass', cover: '#167d73', accent: '#e87c55' },
  { name: 'Carmine', cover: '#a93b4c', accent: '#f2c14e' },
  { name: 'Night mail', cover: '#243b63', accent: '#72c4bd' }
];

function StaticOrbit({ palette }) {
  return (
    <div className="orbit-static" style={{ '--orbit-cover': palette.cover, '--orbit-accent': palette.accent }}>
      <div className="orbit-static__glow" />
      <div className="orbit-static__passport"><span>✦</span><strong>SQ</strong><small>STAMPQUEST</small></div>
      <div className="orbit-static__ring orbit-static__ring--one" />
      <div className="orbit-static__ring orbit-static__ring--two" />
    </div>
  );
}

function PassportScene({ palette, autoRotate }) {
  const canvasRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    setFallback(reduced || lowPower);
  }, []);

  useEffect(() => {
    if (fallback || !canvasRef.current) return undefined;

    let disposed = false;
    let animationFrame;
    let renderer;
    let resizeObserver;
    let cleanupPointer;

    import('three').then((THREE) => {
      if (disposed) return;
      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#dce9df');
      scene.fog = new THREE.Fog('#dce9df', 7, 14);

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
      camera.position.set(0, 1.05, 6.8);
      camera.lookAt(0, 0.2, 0);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const stage = new THREE.Group();
      scene.add(stage);
      const coverMaterial = new THREE.MeshStandardMaterial({ color: palette.cover, roughness: 0.55, metalness: 0.12 });
      const accentMaterial = new THREE.MeshStandardMaterial({ color: palette.accent, roughness: 0.4, metalness: 0.3 });
      const goldMaterial = new THREE.MeshStandardMaterial({ color: '#f6d37a', roughness: 0.3, metalness: 0.7 });

      const passport = new THREE.Mesh(new THREE.BoxGeometry(2.55, 3.15, 0.3, 2, 2, 1), coverMaterial);
      passport.castShadow = true;
      passport.rotation.x = -0.08;
      stage.add(passport);

      const inset = new THREE.Mesh(new THREE.BoxGeometry(2.15, 2.7, 0.025), new THREE.MeshStandardMaterial({ color: '#1d9387', roughness: 0.7 }));
      inset.position.z = 0.165;
      inset.position.y = 0.04;
      stage.add(inset);

      const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.045, 48), goldMaterial);
      seal.rotation.x = Math.PI / 2;
      seal.position.z = 0.22;
      seal.position.y = 0.36;
      stage.add(seal);
      const sealInner = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.018, 8, 48), coverMaterial);
      sealInner.position.set(0, 0.36, 0.25);
      stage.add(sealInner);

      const title = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.07, 0.04), goldMaterial);
      title.position.set(0, -0.65, 0.22);
      stage.add(title);
      const subtitle = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.035, 0.04), accentMaterial);
      subtitle.position.set(0, -0.84, 0.22);
      stage.add(subtitle);

      const orbit = new THREE.Group();
      stage.add(orbit);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.025, 8, 96), accentMaterial);
      ring.rotation.x = Math.PI / 2.3;
      ring.rotation.z = -0.28;
      orbit.add(ring);
      const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(2.72, 0.012, 8, 96), goldMaterial);
      ringTwo.rotation.x = Math.PI / 2.1;
      ringTwo.rotation.z = 0.42;
      orbit.add(ringTwo);
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), goldMaterial);
      marker.position.set(2.18, 0.12, 0.45);
      orbit.add(marker);

      const ground = new THREE.Mesh(new THREE.CircleGeometry(5, 64), new THREE.MeshStandardMaterial({ color: '#b8d0c3', roughness: 1 }));
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1.75;
      ground.receiveShadow = true;
      scene.add(ground);

      const keyLight = new THREE.DirectionalLight('#fff4d6', 3.3);
      keyLight.position.set(-4, 6, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      scene.add(keyLight);
      scene.add(new THREE.HemisphereLight('#e9ffff', '#6a8b7c', 1.5));

      const pointer = { x: 0, y: 0, down: false, lastX: 0 };
      const onPointerDown = (event) => { pointer.down = true; pointer.lastX = event.clientX; canvas.setPointerCapture(event.pointerId); };
      const onPointerMove = (event) => {
        pointer.x = (event.clientX / canvas.clientWidth) * 2 - 1;
        pointer.y = (event.clientY / canvas.clientHeight) * 2 - 1;
        if (pointer.down) { stage.rotation.y += (event.clientX - pointer.lastX) * 0.008; pointer.lastX = event.clientX; }
      };
      const onPointerUp = () => { pointer.down = false; };
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);
      cleanupPointer = () => {
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointercancel', onPointerUp);
      };

      const resize = () => {
        const { clientWidth, clientHeight } = canvas.parentElement;
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(clientWidth, clientHeight, false);
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas.parentElement);
      resize();

      const render = (time) => {
        if (disposed) return;
        const seconds = time * 0.001;
        if (autoRotate && !pointer.down) stage.rotation.y += 0.003;
        stage.rotation.x += ((pointer.y * -0.08) - stage.rotation.x) * 0.04;
        stage.position.x += ((pointer.x * 0.16) - stage.position.x) * 0.035;
        orbit.rotation.y = seconds * 0.35;
        marker.position.y = 0.12 + Math.sin(seconds * 2) * 0.08;
        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(render);
      };
      animationFrame = requestAnimationFrame(render);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      cleanupPointer?.();
      renderer?.dispose();
    };
  }, [autoRotate, fallback, palette]);

  if (fallback) return <StaticOrbit palette={palette} />;
  return <canvas ref={canvasRef} className="orbit-canvas" aria-label="Interactive 3D StampQuest passport scene" />;
}

export default function PassportOrbitPage() {
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const palette = palettes[paletteIndex];

  return (
    <section className="orbit-page" aria-labelledby="orbit-title">
      <section className="orbit-intro">
        <p className="orbit-kicker">StampQuest / Passport Orbit</p>
        <h1 id="orbit-title">Carry the places<br /><em>with you.</em></h1>
        <p className="orbit-description">A small 3D study of the digital passport: tilt it, turn it, and choose the cover it wears on its next journey.</p>
      </section>
      <section className="orbit-workbench" aria-label="Passport 3D configurator">
        <div className="orbit-stage"><PassportScene palette={palette} autoRotate={autoRotate} /></div>
        <aside className="orbit-controls">
          <div>
            <p className="orbit-overline">Configure the cover</p>
            <h2>Make it yours.</h2>
          </div>
          <fieldset>
            <legend>Cover material</legend>
            <div className="orbit-swatches">
              {palettes.map((item, index) => (
                <button key={item.name} type="button" className={`orbit-swatch ${paletteIndex === index ? 'is-selected' : ''}`} style={{ '--swatch': item.cover }} onClick={() => setPaletteIndex(index)} aria-label={`Use ${item.name} cover`} aria-pressed={paletteIndex === index}><span /></button>
              ))}
            </div>
            <p className="orbit-selection">{palette.name} / soft-touch cover</p>
          </fieldset>
          <label className="orbit-toggle"><input type="checkbox" checked={autoRotate} onChange={(event) => setAutoRotate(event.target.checked)} /><span className="orbit-toggle__track" /><span>Slow orbit</span></label>
          <p className="orbit-tip">Drag the passport to turn it. Move your pointer across the stage to shift the light and perspective.</p>
        </aside>
      </section>
      <section className="orbit-notes" aria-labelledby="orbit-notes-title">
        <p className="orbit-overline">FE-10 / performance note</p>
        <h2 id="orbit-notes-title">Small geometry, deliberate motion.</h2>
        <p>This scene is generated from a handful of low-poly Three.js primitives, so it ships with no model download and stays under a small texture budget. The canvas is route-lazy-loaded, caps pixel ratio at 1.5, uses low-power rendering, and falls back to a static CSS composition for reduced-motion and low-power contexts. With more time, I would add a compressed GLB stamp collection and test frame time on a wider device matrix.</p>
      </section>
    </section>
  );
}
