import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(0);
camera.position.setY(30);

// Orbit controls.
const controls = new OrbitControls(camera, renderer.domElement);

// Initialize and add light source.
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

/* Helper for debugging.*/
//const lightHelper = new THREE.PointLightHelper(pointLight);
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

// Animate when changed.
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  renderer.setSize(window.innerWidth, window.innerHeight);
}

animate();

// ----------------------------------------------------------------------

// Add random star
function addStar() {
  const geometry = new THREE.SphereGeometry(1.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(1000));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(500).fill().forEach(addStar);

// For the background
const loader = new THREE.TextureLoader();
const texture = loader.load("/scene.jpeg");
const geometry = new THREE.SphereGeometry(500, 60, 40);
geometry.scale(-1, 1, 1); // flip the geometry inside out
const material = new THREE.MeshBasicMaterial({
  map: texture,
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// For Scrolling

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  //camera.position.z = t * -0.02;
  camera.position.x = t * 0.05;
  //camera.position.y = (t * THREE.MathUtils.randFloatSpread(10)) / 10000;
}
moveCamera();

document.body.onscroll = moveCamera;

// For the object in place -------

// Object
const ob = new THREE.TorusGeometry(10, 3, 16, 100);
const ma = new THREE.MeshBasicMaterial({
  color: 0xff6347,
  wireframe: true,
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Radom Spheres
let g = new THREE.SphereGeometry(1, 32, 16); // the same geometry for re-use

let spheres = [];
let spheresCount = 100;
for (let i = 0; i < spheresCount; i++) {
  addSphere();
}

let clock = new THREE.Clock();

renderer.setAnimationLoop((_) => {
  let t = clock.getElapsedTime();
  spheres.forEach((s) => {
    let ud = s.userData;
    let a = ud.speed * t + ud.phase;
    s.position
      .set(Math.cos(a), 0, -Math.sin(a))
      .multiplyScalar(ud.radius)
      .setY(ud.posY);
  });
  renderer.render(scene, camera);
});

function addSphere() {
  let s = new THREE.Mesh(
    g,
    new THREE.MeshLambertMaterial({
      color: Math.random() * 0x7f7f7f + 0x7f7f7f,
    })
  );
  s.scale.setScalar(THREE.MathUtils.randFloat(0.1, 0.55)); // sise of a sphere
  s.userData = {
    posY: THREE.MathUtils.randFloat(-100, 100), // at what height
    radius: THREE.MathUtils.randFloat(100, 100), // how far from Y-axis
    phase: Math.random() * Math.PI * 2, // where to start
    speed: (0.1 - Math.random() * 0.2) * Math.PI, // how fast to circulate
  };
  spheres.push(s);
  scene.add(s);
}
