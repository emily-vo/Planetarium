
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import World from './worlds/world'
import BasicWorld from './worlds/basicWorld'
import CameraControls from './worlds/cameraControls'
import FlowerWorld from './worlds/flowerWorld'
import WaterWorld from './worlds/waterWorld'
import CrystalWorld from './worlds/crystalWorld'

import Audio from './audio'

// initialize global clock
var clock =new THREE.Clock(false);
var cameraControls;

var koiGeo;

// worlds
var flowerWorld;
var waterWorld;
var crystalWorld;
var currentWorld;

// scene nodes
var scene;
var camera;
var directionalLight;

var humble = "./audio/humble.mp3";
var wildcat = "./audio/wildcat.mp3";
var flowers = "./audio/the-deli-flowers.mp3";

var zoomIn;
var zoomOut;

var music = {
  humble: 1,
  wildcat: 2,
  flowers: 3,
};

var song = music.flowers;

var audioControl = { 'mute': false, 'music': 'smooth operator' };
var planetControl = {'planet': 'flower'};

var cameraOffset = 20;
// called after the scene loads
function onLoad(framework) {

  // initialize framework
  scene = framework.scene;
  camera = framework.camera;
  var renderer = framework.renderer;
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
  var axisHelper = new THREE.AxisHelper( 10 );
  scene.add( axisHelper );

  var objLoader = new THREE.OBJLoader();

  // audio
  objLoader.load('textures/koi.obj', function(obj) {
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

  gui.add(audioControl, 'music', ['humble', 'wildcat', 'the-deli-flowers',
    'smooth-operator', 'cello-suite']).onChange(function(newVal) {
    Audio.setMusic(newVal, resetAnalysers);
  });

  gui.add(audioControl, 'mute').onChange(function(newVal) {
    if (newVal) {
      Audio.mute()
    } else {
      Audio.unmute()
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
    // var size = Audio.getSizeFromSound();
    var bg = scene.background ? scene.background : new THREE.Color(0,0,0);
    var color = Audio.getColorFromSound(bg);
    // Change the background color
    scene.background = color;
  }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
