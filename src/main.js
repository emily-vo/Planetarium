
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

var koiGeo;

// worlds 
var flowerWorld;
var waterWorld; 
var crystalWorld;

// scene nodes
var scene;
var camera;
var directionalLight;

// animation control
var cameraControl;

var audioPlaying = false;

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
  camera.position.set(0, 0, 20);
  camera.lookAt(new THREE.Vector3(0,0,0)); 
  camera.updateProjectionMatrix();

  // putting in a simple axis helper to help visualize
  var axisHelper = new THREE.AxisHelper( 10 );
  scene.add( axisHelper );

  var objLoader = new THREE.OBJLoader();
  
  objLoader.load('house.obj', function(obj) {
    koiGeo = obj.children[0].geometry;
    Audio.init(); 
  });

  // add gui controls
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
}

function tryInitWorlds() {
  if (Audio.getAnalyser() !== undefined) {
      if (crystalWorld === undefined) {
        crystalWorld = new CrystalWorld(scene, camera, clock, 
          directionalLight, Audio.getAnalyser());
      }
      if (flowerWorld === undefined) {
        flowerWorld = new FlowerWorld(scene, clock, directionalLight);
      }
      if (waterWorld == undefined) {
        waterWorld = new WaterWorld(scene, clock, directionalLight, koiGeo);
        if (!audioPlaying) {
          Audio.playSound();
          clock.start();
          audioPlaying = true;
        } 
      }
       
  }
}

function timeTarget(time) {
  var epsilon = 0.1;
  return Math.abs(clock.elapsedTime - time) < epsilon;
}

function flowerWorldChoreo() {
  if (timeTarget(0)) {
    flowerWorld.toggleDisplay(true);
  }

  if (flowerWorld.displayed) {
    flowerWorld.spin(0, 2, Math.PI / 1000);
    flowerWorld.spinAccelerate(2, 4, Math.PI / 4000);
    flowerWorld.spinDeccelerate(4, 6, Math.PI / 4000); 
    flowerWorld.spinAccelerate(6, 8, Math.PI / 4000);
    flowerWorld.tick();
  }

  if (timeTarget(8)) {
    flowerWorld.toggleDisplay(false);
  }
}

function waterWorldChoreo() {
  if (timeTarget(8)) {
    waterWorld.toggleDisplay(true);
  }

  if (waterWorld.displayed) {
    waterWorld.spinAccelerate(7, 8.2, Math.PI / 6000);
    waterWorld.spinDeccelerate(8.2, 9.3, Math.PI / 6000); 
    waterWorld.spin(9, 15, Math.PI / 1000); 
    waterWorld.spinAccelerate(15, 16, Math.PI / 3000); 
    waterWorld.tick();
  }

  if (timeTarget(16)) {
    waterWorld.toggleDisplay(false);
  }
}

function crystalWorldChoreo() {
  if (timeTarget(16)) {
    crystalWorld.toggleDisplay(true);
  }

  if (crystalWorld.displayed) {
    crystalWorld.spin(16, 18, Math.PI / 1000);
    crystalWorld.spinAccelerate(18, 20, Math.PI / 4000);
    crystalWorld.spinDeccelerate(20, 22, Math.PI / 4000); 
    crystalWorld.spinAccelerate(22, 24, Math.PI / 4000);
    crystalWorld.tick();
  }

  if (timeTarget(24)) {
    crystalWorld.toggleDisplay(false);
  }
}

function defined() {
  return flowerWorld && waterWorld && crystalWorld;
}

// basic choreography set up 
function basicChoreography() { 
  // move first world 
  if (defined()) {
    flowerWorldChoreo();
    waterWorldChoreo();
    crystalWorldChoreo();
  }
    
  // temporarily turn of camera movements 
  // cameraControl.zoomInZ(4.5, 6.5); 
  // cameraControl.zoomOutZ(7.5,10);
}

// called on frame updates
function onUpdate(framework) {
  if (clock) clock.getDelta();

  tryInitWorlds();
  basicChoreography(); 
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
