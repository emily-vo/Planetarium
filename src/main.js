
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const EffectComposer = require('three-effectcomposer')(THREE)
import Framework from './framework'
import World from './worlds/world'
import BasicWorld from './worlds/basicWorld'
import CameraControls from './worlds/cameraControls'
import FlowerWorld from './worlds/flowerWorld'
import WaterWorld from './worlds/waterWorld'
import CrystalWorld from './worlds/crystalWorld'
import GalaxyBackground from './worlds/galaxybackground'

import VerticalRoll from './postprocessing/verticalRoll'
import RGBShift from './postprocessing/rgbShift'
import Dots from './postprocessing/dots'
import DotsBW from './postprocessing/dotsbw'
import Saturate from './postprocessing/saturate'
import Retro from './postprocessing/retro'

import Audio from './audio'

// initialize global clock
var clock = new THREE.Clock(false);
var cameraControls;

var koiGeo;

// worlds
var flowerWorld;
var waterWorld;
var crystalWorld;
var currentWorld;
var galaxy;

// scene nodes
var scene;
var camera;
var renderer;
var directionalLight;
var composer;

// Post-processing shaders
var allPost = [VerticalRoll, RGBShift, Dots, DotsBW, Saturate, Retro];
var currentPost = [];

var humble = "./audio/humble.mp3";
var wildcat = "./audio/wildcat.mp3";
var flowers = "./audio/the-deli-flowers.mp3";
var ysl = "./audio/ysl-bengfang.mp3";

var zoomIn;
var zoomOut;

var music = {
  humble: 1,
  wildcat: 2,
  flowers: 3,
  ysl: 4,
};

var song = music.wildcat;

var audioControl = { 'mute': false, 'music': 'wildcat' };
var planetControl = {'planet': 'flower'};

var cameraOffset = 20;
// called after the scene loads
function onLoad(framework) {

  // initialize framework
  scene = framework.scene;
  camera = framework.camera;
  renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // initialize a simple box and material
  directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 5, 2);
  directionalLight.position.multiplyScalar(10);

  scene.add(directionalLight);

  var backLight = new THREE.DirectionalLight( 0xffffff, 1 );
  backLight.color.setHSL(0.1, 1, 0.95);
  backLight.position.set(1, 1, -2);
  backLight.position.multiplyScalar(10);

  scene.add(backLight);

  // set camera position
  camera.position.set(0, 0, -10);
  camera.lookAt(new THREE.Vector3(0, 0, camera.position.z - 20));
  camera.updateProjectionMatrix();

  cameraControls = new CameraControls(scene, clock, camera);

  // putting in a simple axis helper to help visualize
  // var axisHelper = new THREE.AxisHelper( 10 );
  // scene.add( axisHelper );

  var objLoader = new THREE.OBJLoader();

  // audio
  objLoader.load('textures/koi2.obj', function(obj) {
    koiGeo = obj.children[0].geometry;
    var path;
    switch(song) {
      case music.humble:
        path = humble;
      break;
      case music.wildcat:
        path = wildcat;
      break;
      case music.flowers:
        path = flowers;
      break;
    }
    Audio.init(path, initWorlds);
  });

  currentPost = [ ];
  setPostProcessing();

  // load in background planets
  galaxy = new GalaxyBackground(scene, clock, directionalLight);
  galaxy.initializeBackground();

  gui.add(audioControl, 'music', ['humble', 'wildcat', 'the-deli-flowers', 'ysl-bengfang',
    'dont-want-to-leave', 'american-boy']).onChange(function(newVal) {
    Audio.setMusic(newVal, resetAnalysers);
    if (audioControl.mute) Audio.mute();
    switch(newVal) {
      case 'humble': currentPost = [ VerticalRoll ]; break;
      case 'ysl-bengfang': currentPost = [ RGBShift ]; break;
      case 'the-deli-flowers': currentPost = [ Dots ]; break;
      case 'dont-want-to-leave': currentPost = [ Retro ]; break;
      case 'american-boy': currentPost = [ DotsBW ]; break;
      default: currentPost = [];
    }
    setPostProcessing();
  });

  gui.add(audioControl, 'mute').onChange(function(newVal) {
    if (newVal) {
      Audio.mute();
    } else {
      Audio.unmute();
    }
  })

  gui.add(planetControl, 'planet', ['flower', 'water', 'crystal']).onChange(function(newVal) {
    currentWorld.toggleDisplay(false);
    if (newVal == 'flower') {
      currentWorld = flowerWorld;
    }
    else if (newVal == 'water') {
      currentWorld = waterWorld;
    }
    else if (newVal == 'crystal') {
      currentWorld = crystalWorld;
    }
    currentWorld.toggleDisplay(true);
  });
}


// Note: Currently can only have 1 shader pass at time.
// TODO: Get multiple passes to work
function setPostProcessing(shaders) {
  for (var s in allPost) { allPost[s].turnOff() }
  composer = new EffectComposer(renderer);
  var renderPass = new EffectComposer.RenderPass(scene, camera);
  composer.addPass(renderPass);
  for (var s in currentPost) {
    currentPost[s].turnOn();
    var pass = currentPost[s].shader;
    pass.renderToScreen = true;
    composer.addPass(pass);
  }
  render();
}

function render() {
  composer.render();
  requestAnimationFrame(render);
}

function initWorlds() {
  crystalWorld = new CrystalWorld(scene, camera, clock,
  directionalLight, new THREE.Vector3(0, 0, 0));
  crystalWorld.analyser = Audio.getAnalyser();

  flowerWorld = new FlowerWorld(scene, clock, directionalLight, new THREE.Vector3(0, 0, 0));
  flowerWorld.analyser = Audio.getAnalyser();

  waterWorld = new WaterWorld(scene, clock, directionalLight, koiGeo, new THREE.Vector3(0, 0, 0));
  waterWorld.analyser = Audio.getAnalyser();

  currentWorld = flowerWorld;
  currentWorld.toggleDisplay(true);

  setWorldSpeeds();
  if (audioControl.mute) Audio.mute()
  Audio.playSound();
  clock.start();
}

function setWorldSpeeds() {
  var speed = Audio.getRateFromSound() / 8000;
  flowerWorld.rotateSpeed = speed;
  waterWorld.rotateSpeed = speed;
  crystalWorld.rotateSpeed = speed;
}

function resetAnalysers() {
  crystalWorld.analyser = Audio.getAnalyser();
  flowerWorld.analyser = Audio.getAnalyser();
  waterWorld.analyser = Audio.getAnalyser();
  setWorldSpeeds();
}

function timeTarget(time) {
  var epsilon = 0.1;
  return Math.abs(clock.elapsedTime - time) < epsilon;
}

var FLOWER_ZOOMOUT = 0;
var FLOWER_ZOOMOUT_END = FLOWER_ZOOMOUT + 5;

var FLOWER_ZOOMIN = FLOWER_ZOOMOUT_END + 20;
var FLOWER_ZOOMIN_END = FLOWER_ZOOMIN + 2;

var CRYSTAL_ZOOMOUT = FLOWER_ZOOMIN_END;
var CRYSTAL_ZOOMOUT_END = CRYSTAL_ZOOMOUT + 2.5;

var CRYSTAL_EXPLODE = CRYSTAL_ZOOMOUT_END + 10;
var CRYSTAL_EXPLODE_END = CRYSTAL_EXPLODE + 1;

var CRYSTAL_ZOOM = CRYSTAL_EXPLODE_END;
var CRYSTAL_ZOOM_END = CRYSTAL_ZOOM + 4;

var WATER_ZOOMOUT = CRYSTAL_ZOOM_END;
var WATER_ZOOMOUT_END = WATER_ZOOMOUT + 4;

function choreo() {
  if (cameraControls) {
    cameraControls.zoom(FLOWER_ZOOMOUT, FLOWER_ZOOMOUT_END, -10, 20);
    cameraControls.zoom(FLOWER_ZOOMIN, FLOWER_ZOOMIN_END, 20, -10);

    if (timeTarget(1)) {
        setWorldSpeeds();
    }

    if (timeTarget(CRYSTAL_ZOOMOUT)) {
      currentWorld.toggleDisplay(false);
      currentWorld.normalOffset = -1;
      currentWorld = crystalWorld;
      var oldSpeed = currentWorld.rotateSpeed;
      currentWorld.toggleDisplay(true);
      currentWorld.rotateSpeed = oldSpeed;
      setWorldSpeeds();
    }

    var zooming = cameraControls.zoom(CRYSTAL_ZOOMOUT, CRYSTAL_ZOOMOUT_END, -10, 20);

    if (clock.elapsedTime > CRYSTAL_EXPLODE && clock.elapsedTime < CRYSTAL_EXPLODE_END) {
      currentWorld.normalOffset += 2;
    }

    if (clock.elapsedTime > CRYSTAL_ZOOM && clock.elapsedTime < CRYSTAL_ZOOM_END ) {
      cameraControls.zoom(CRYSTAL_ZOOM, CRYSTAL_ZOOM_END, 20, -10);
      currentWorld.rotateSpeed += Math.PI / 800;
    }

    if (timeTarget(WATER_ZOOMOUT)) {
      currentWorld.toggleDisplay(false);
      currentWorld.normalOffset = -1;
      currentWorld.rotateSpeed = Math.PI / 200;
      currentWorld = waterWorld;
      currentWorld.toggleDisplay(true);
      setWorldSpeeds();
    }

    cameraControls.zoom(WATER_ZOOMOUT, WATER_ZOOMOUT_END, -10, 20);

    if (!zooming && currentWorld) {
      currentWorld.tick();
    }
  }
}

// called on frame updates
function onUpdate(framework) {
  if (clock) clock.getDelta();
  if (crystalWorld && flowerWorld && waterWorld) choreo();

  if (Audio.isPlaying()) {
    // Change the background color
    var bg = scene.background ? scene.background : new THREE.Color(0,0,0);
    var color = Audio.getColorFromSound(bg);
    scene.background = color;

    var size = Audio.getSizeFromSound();
    var speed = Audio.getRateFromSound();

    if (VerticalRoll.isOn()) {
      var unif = VerticalRoll.shader.material.uniforms;
      unif.distortion.value = size / 35;
      unif.distortion2.value = size / 25;
      unif.speed.value = speed / 200;
      unif.rollSpeed.value = speed / 1000;
      unif.time.value = clock.elapsedTime;
    }
    if (RGBShift.isOn()) {
      RGBShift.shader.material.uniforms.aberration.value = size / 5000;
    }
    if (Dots.isOn()) {
      Dots.shader.material.uniforms.scale.value = size / 100;
    }
    if (DotsBW.isOn()) {
      DotsBW.shader.material.uniforms.scale.value = size / 100;
    }
    if (Retro.isOn()) {
      Retro.shader.material.uniforms.warmth.value = color.r;
      Retro.shader.material.uniforms.time.value = clock.elapsedTime;
      Retro.shader.material.uniforms.size.value = size;
    }
  }

  if (galaxy) galaxy.tick();
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
