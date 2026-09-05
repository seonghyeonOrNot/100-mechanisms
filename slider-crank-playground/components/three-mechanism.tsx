'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Box, Layers3, Move3d } from 'lucide-react';
import { solveSliderCrank } from '@/mechanics/sliderCrank';

type CameraView = 'perspective' | 'left' | 'right' | 'top';
type MovingParts = {
  root: THREE.Group;
  crank: THREE.Mesh;
  rod: THREE.Mesh;
  crankPin: THREE.Group;
  slider: THREE.Group;
  flywheel: THREE.Group;
  base: THREE.Mesh;
  rails: THREE.Mesh[];
};

const material = (color: number, metalness = .8, roughness = .26) => new THREE.MeshStandardMaterial({ color, metalness, roughness });

function beamBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3, thickness: number, depth: number) {
  const delta = end.clone().sub(start);
  mesh.position.copy(start).add(end).multiplyScalar(.5);
  mesh.scale.set(delta.length(), thickness, depth);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), delta.normalize());
}

export function ThreeMechanism({ r, length, angle, rpm }: { r: number; length: number; angle: number; rpm: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<MovingParts | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [view, setView] = useState<CameraView>('perspective');

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071722);
    scene.fog = new THREE.Fog(0x071722, 9, 18);
    const camera = new THREE.PerspectiveCamera(35, 1, .05, 80);
    camera.position.set(5.6, 4.3, 7.1);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = .07;
    controls.minDistance = 3.5;
    controls.maxDistance = 16;
    controls.target.set(.35, 0, 0);
    controlsRef.current = controls;

    scene.add(new THREE.HemisphereLight(0xc9edff, 0x071019, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 4.2); key.position.set(3, 7, 5); key.castShadow = true; scene.add(key);
    const rim = new THREE.DirectionalLight(0x2ccfff, 3); rim.position.set(-4, 2, -4); scene.add(rim);
    const warm = new THREE.PointLight(0xffad45, 18, 12); warm.position.set(5, 2, 3); scene.add(warm);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(28, 18), new THREE.MeshStandardMaterial({ color: 0x07131d, metalness: .1, roughness: .92 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -1.18; floor.receiveShadow = true; scene.add(floor);
    const grid = new THREE.GridHelper(24, 48, 0x1d4a60, 0x102b3b); grid.position.y = -1.17; scene.add(grid);

    const root = new THREE.Group(); scene.add(root);
    const steel = material(0x9aacb9, .92, .2), darkSteel = material(0x263d4d, .88, .25), cyan = material(0x20cffa, .75, .18), amber = material(0xf0a932, .78, .22);
    const base = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), darkSteel); base.castShadow = base.receiveShadow = true; root.add(base);
    const rails = [-1, 1].map((side) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), steel); mesh.position.z = side * 18; mesh.castShadow = true; root.add(mesh); return mesh; });
    const bearing = new THREE.Group(); root.add(bearing);
    [-1, 1].forEach((side) => { const support = new THREE.Mesh(new THREE.BoxGeometry(26, 38, 12), darkSteel); support.position.set(0, -15, side * 22); support.castShadow = true; bearing.add(support); const ring = new THREE.Mesh(new THREE.TorusGeometry(13, 4, 16, 48), steel); ring.position.z = side * 29; ring.castShadow = true; bearing.add(ring); });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 72, 32), steel); shaft.rotation.x = Math.PI / 2; shaft.castShadow = true; bearing.add(shaft);
    const flywheel = new THREE.Group(); root.add(flywheel);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(30, 6, 18, 64), darkSteel); wheel.castShadow = true; flywheel.add(wheel);
    for (let i=0;i<6;i++) { const spoke = new THREE.Mesh(new THREE.BoxGeometry(27, 4, 5), darkSteel); spoke.position.x = 13; spoke.rotation.z = i * Math.PI / 3; flywheel.add(spoke); }
    const crank = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cyan); crank.castShadow = true; root.add(crank);
    const rod = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), steel); rod.castShadow = true; root.add(rod);
    const crankPin = new THREE.Group(); const crankPinCore = new THREE.Mesh(new THREE.CylinderGeometry(7,7,22,32), steel); crankPinCore.rotation.x=Math.PI/2; crankPinCore.castShadow=true; crankPin.add(crankPinCore); const pinCollar = new THREE.Mesh(new THREE.TorusGeometry(8.5,2.2,12,32), cyan); pinCollar.position.z=12; crankPin.add(pinCollar); root.add(crankPin);
    const slider = new THREE.Group(); const block = new THREE.Mesh(new THREE.BoxGeometry(34,36,54), amber); block.castShadow=true; slider.add(block); const wrist = new THREE.Mesh(new THREE.CylinderGeometry(7,7,66,32),steel); wrist.rotation.x=Math.PI/2; wrist.castShadow=true; slider.add(wrist); root.add(slider);
    [crank,rod,crankPinCore,block,wrist,wheel,shaft].forEach(mesh=>{mesh.castShadow=true;mesh.receiveShadow=true});
    partsRef.current = { root, crank, rod, crankPin, slider, flywheel, base, rails };

    const resize = () => { const { clientWidth, clientHeight } = mount; renderer.setSize(clientWidth, clientHeight, false); camera.aspect = clientWidth / Math.max(clientHeight, 1); camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(mount); resize();
    let frame = 0; const render = () => { controls.update(); renderer.render(scene, camera); frame=requestAnimationFrame(render); }; render();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); controls.dispose(); renderer.dispose(); scene.traverse(object=>{ if(object instanceof THREE.Mesh){object.geometry.dispose(); const mats=Array.isArray(object.material)?object.material:[object.material];mats.forEach(m=>m.dispose())}}); renderer.domElement.remove(); };
  }, []);

  useEffect(() => {
    const parts = partsRef.current; if (!parts) return;
    const state = solveSliderCrank(r, length, angle, rpm);
    const scale = 3.8 / (length + r + 35);
    parts.root.scale.setScalar(scale);
    parts.root.position.x = -(length + r) * scale * .42;
    const origin = new THREE.Vector3(0,0,0), pin = new THREE.Vector3(state.crankPin.x,state.crankPin.y,0), slide = new THREE.Vector3(state.slider.x,0,0);
    beamBetween(parts.crank, origin, pin, 15, 13); beamBetween(parts.rod, pin, slide, 12, 15);
    parts.crankPin.position.copy(pin); parts.slider.position.copy(slide); parts.flywheel.rotation.z = state.theta;
    parts.base.scale.set(length+r+65,10,82); parts.base.position.set((length+r)*.42,-45,0);
    parts.rails.forEach((rail,i)=>{rail.scale.set(length+r+25,6,7);rail.position.set((length+r)*.53,-24,(i?1:-1)*25)});
  }, [r, length, angle, rpm]);

  useEffect(() => {
    const camera=cameraRef.current,controls=controlsRef.current;if(!camera||!controls)return;
    const positions:Record<CameraView,[number,number,number]>={perspective:[5.6,4.3,7.1],left:[0,0,9],right:[0,0,-9],top:[0,9,.01]};
    camera.position.set(...positions[view]); camera.up.set(0,1,0); if(view==='top')camera.up.set(0,0,-1); controls.target.set(.35,0,0); controls.update();
  },[view]);

  return <div className="three-stage"><div ref={mountRef} className="three-canvas"/><div className="view-toolbar"><span><Layers3/>3D PRODUCT VIEW</span>{(['perspective','left','right','top'] as CameraView[]).map(item=><button type="button" key={item} className={view===item?'active':''} onClick={()=>setView(item)}>{item}</button>)}</div><div className="three-hint"><Move3d/> Drag to orbit · Scroll to zoom</div><div className="geometry-note"><span className="status-dot"/> Three.js mesh driven by solved kinematic coordinates</div><div className="three-badge"><Box/> WEBGL</div></div>;
}
