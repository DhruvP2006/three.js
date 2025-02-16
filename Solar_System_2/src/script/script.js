import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Test-----------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
import gsap from "gsap";

import starsTexture from "../img/stars.jpg";
import sunTexture from "../img/sun.jpg";
import mercuryTexture from "../img/mercury.jpg";
import venusTexture from "../img/venus.jpg";
import earthTexture from "../img/earth.jpg";
import marsTexture from "../img/mars.jpg";
import jupiterTexture from "../img/jupiter.jpg";
import saturnTexture from "../img/saturn.jpg";
import saturnringTexture from "../img/saturnring.png";
import uranusTexture from "../img/uranus.jpg";
import uranusringTexture from "../img/uranusring.png";
import neptuneTexture from "../img/neptune.jpg";
import plutoTexture from "../img/pluto.jpg";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const textureLoader = new THREE.TextureLoader();
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(sunTexture),
});

const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanet(size, texture, position, ring) {
  const Geo = new THREE.SphereGeometry(size, 30, 30);
  const Mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });

  const mesh = new THREE.Mesh(Geo, Mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  mesh.position.x = position;
  return { mesh, obj };
}

const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnringTexture,
});
const uranus = createPlanet(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusringTexture,
});
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
pointLight.decay = 0;
scene.add(pointLight);

scene.add(cubeTextureLoader);

function animate() {
  renderer.render(scene, camera);
  // Add rotations to the planets
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  // Add revolutions to planets
  mercury.obj.rotateY(0.04);
  venus.obj.rotateY(0.015);
  earth.obj.rotateY(0.01);
  mars.obj.rotateY(0.008);
  jupiter.obj.rotateY(0.002);
  saturn.obj.rotateY(0.0009);
  uranus.obj.rotateY(0.0004);
  neptune.obj.rotateY(0.0001);
  pluto.obj.rotateY(0.00007);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// TEST -------------------------------------------------------------------
window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const planets = [
    mercury.obj,
    venus.obj,
    earth.obj,
    mars.obj,
    jupiter.obj,
    saturn.obj,
    uranus.obj,
    neptune.obj,
    pluto.obj,
  ];

  const intersects = raycaster.intersectObjects(planets, true);

  if (intersects.length > 0) {
    moveToPlanet(intersects[0].object);
  }
});

function moveToPlanet(planet) {
  const targetPosition = new THREE.Vector3();
  planet.getWorldPosition(targetPosition);

  const newCameraPos = targetPosition.clone().add(new THREE.Vector3(0, 10, 20));

  gsap.to(camera.position, {
    x: newCameraPos.x,
    y: newCameraPos.y,
    z: newCameraPos.z,
    duration: 2,
    onUpdate: () => {
      camera.lookAt(targetPosition);
    },
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    gsap.to(camera.position, { x: -90, y: 140, z: 140, duration: 2 });
  }
});
