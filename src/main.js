
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import World from './worlds/world'
import BasicWorld from './worlds/basicWorld'
import CameraControls from './worlds/cameraControls'
import FlowerWorld from './worlds/flowerWorld'
import WaterWorld from './worlds/waterWorld'

// initialize global clock
var clock = new THREE.Clock();
var cameraControl;
var basicWorld;
var waterWorld; 

// called after the scene loads
function onLoad(framework) {
  // initialize framework  
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats; 

  // initialize a simple box and material
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 1, 2);
  directionalLight.position.multiplyScalar(10);

  scene.add(directionalLight);

  var backLight = new THREE.DirectionalLight( 0xffffff, 1 );
  backLight.color.setHSL(0.1, 1, 0.95);
  backLight.position.set(1, 1, -2);
  backLight.position.multiplyScalar(10);

  scene.add(backLight);

  // set camera position
  camera.position.set(0, 0, 20); 
  camera.lookAt(new THREE.Vector3(0,0,0)); // reset x = 0 to look at flower plan
  camera.updateProjectionMatrix();

  // putting in a simple axis helper to help visualize 
  var axisHelper = new THREE.AxisHelper( 10 );
  scene.add( axisHelper );

  // new camera control
  cameraControl = new CameraControls(scene, clock, camera); 

  basicWorld = new FlowerWorld(scene, clock, directionalLight);

  waterWorld = new WaterWorld(scene, clock, directionalLight); 

  // add gui controls
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });  
}

// called on frame updates
function onUpdate(framework) {
  if (waterWorld !== undefined) {
     // enable animation of water 
     waterWorld.updateWaterTime();
  }

  // flower world animation control  
  if (basicWorld !== undefined) {
    basicWorld.spin(0, 5, Math.PI / 7000);
    basicWorld.spinAccelerate(5,7,Math.PI / 4000);
    basicWorld.spinDeccelerate(7,9,Math.PI / 4000); 
    basicWorld.spin(9, 20,Math.PI / 6000); 

    // temporarily turn of camera movements 
    cameraControl.zoomInZ(4.5, 6.5); 
    cameraControl.zoomOutZ(7.5,10);
    
    basicWorld.tick();
  }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
