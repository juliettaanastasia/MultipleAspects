/*
    Orbit Controls [Done]
    Texture [Done]
    Controls [Done]
    Panorama [Done]
    Realistic Reflective [Done]
    Load Model [Done]
*/

import "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js";
import { GUI } from "https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js";
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { getRandomInt } from "./utils.js";

let scene, camera, renderer, controls, sphereCamera;
let canvasDOM;
let geometries = [];

const LIGHT_COLOR = 'purple';

// Create Geometry Function
const createCube = (side, x, y, z) => {
  const loader = new THREE.TextureLoader();
  const geometry = new THREE.BoxGeometry(side, side, side);
  const texture = loader.load(
    "https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg"
  );
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);

  return cube;
};

// Generate Random Cube
const generateCube = () => {
  const obj = createCube(
    getRandomInt(2, 5),
    getRandomInt(-10, 8),
    getRandomInt(10, 8),
    getRandomInt(-8, 10),
  );

  geometries.push(obj);
  scene.add(obj);
};

const main = () => {
  canvasDOM = document.getElementById("myCanvas");
  // Event Listener Function
  // On Windows Resize
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  // 1. Create the scene
  scene = new THREE.Scene();
  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    "https://threejsfundamentals.org/threejs/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg",
    () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      scene.background = rt.texture;
    }
  );

  // 2. Create an locate the camera
  camera = new THREE.PerspectiveCamera(
    75,window.innerWidth / window.innerHeight,0.1,1000
  );

  // Add the light
  const pLight = new THREE.HemisphereLight(LIGHT_COLOR, LIGHT_COLOR, 1);
  pLight.position.set(20, 20, 30);
  scene.add(pLight);

  // Add Fog
  const fogColor = 0xffffff; // white
  const fogNear = 10;
  const fogFar = 100;
  scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);

  // 3. Create an locate the object on the scene
  // Loop with geometryData
  for (let i = 0; i < 10; i++) {
    generateCube();
  }

  camera.position.set(15, 10, 20);

  //object plane (bottom)
  const loader4 = new THREE.TextureLoader();
  const sand = loader4.load("https://threejsfundamentals.org/threejs/lessons/resources/images/compressed-but-large-wood-texture.jpg");
  sand.wrapS = THREE.RepeatWrapping;
  sand.wrapT = THREE.RepeatWrapping;
  const repeats = 10;
  sand.repeat.set(repeats, repeats);

  let sandPlane = new THREE.BoxGeometry(25, 25);
  let sandMaterial = new THREE.MeshLambertMaterial({
    map:sand

  });

  let plane = new THREE.Mesh(sandPlane,sandMaterial);
  plane.rotation.x = Math.PI / 2;
  plane.position.y = -8.5;
  plane.receiveShadow = true;
  scene.add(plane);

  // Realistic Reflective
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  });

  sphereCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
  sphereCamera.position.set(0, 0, -1);
  scene.add(sphereCamera);
  let sphereMaterial = new THREE.MeshBasicMaterial({
    envMap: sphereCamera.renderTarget,
  });

  let sphereGeo = new THREE.SphereGeometry(4, 32, 16);
  let mirrorSphere = new THREE.Mesh(sphereGeo, sphereMaterial);
  mirrorSphere.position.set(0, 0, -1);
  scene.add(mirrorSphere);

  // 4. Create the renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvasDOM, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Orbit controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window); // optional

  controls.autoRotate = true;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  // Controls
  const gui = new GUI();
  gui.add(controls, "autoRotate").name("controls.autoRotate").listen();
  gui.add(controls, "enableDamping").name("controls.enableDamping").listen();
  gui.add(controls, "dampingFactor", 0, 0.1).name("controls.dampingFactor");

  //lights
  const ambientLight = new THREE.AmbientLight(0x000000);
  scene.add(ambientLight);

  const solarLight = new THREE.DirectionalLight();
  solarLight.position.set(500, 500, -500);
  solarLight.castShadow = true;
  solarLight.intensity = 2;
  solarLight.shadow.mapSize.width = 1024;
  solarLight.shadow.mapSize.height = 1024;
  solarLight.shadow.camera.near = 250;
  solarLight.shadow.camera.far = 1000;

  let intensity = 60;

  solarLight.shadow.camera.left = -intensity;
  solarLight.shadow.camera.right = intensity;
  solarLight.shadow.camera.top = intensity;
  solarLight.shadow.camera.bottom  = -intensity;
  scene.add(solarLight);

  // directional light
  const directionalLightFolder = gui.addFolder('Directional Light');
  directionalLightFolder.add(solarLight, 'visible');
  directionalLightFolder.add(solarLight.position, 'x').min(-500).max(500).step(10);
  directionalLightFolder.add(solarLight.position, 'y').min(-500).max(500).step(10);
  directionalLightFolder.add(solarLight.position, 'z').min(-500).max(500).step(10);
  directionalLightFolder.add(solarLight, 'intensity').min(0).max(10).step(0.1);

  // Set the Event Listener
  window.addEventListener("resize", onWindowResize);
};

const mainLoop = () => {
  renderer.render(scene, camera);
  sphereCamera.update(renderer, scene);

  controls.update();
  requestAnimationFrame(mainLoop);
};

document.addEventListener("DOMContentLoaded", () => {
  main();
  mainLoop();
});