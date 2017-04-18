
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import World from './worlds/world'
import BasicWorld from './worlds/basicWorld'
import CameraControls from './worlds/cameraControls'
import FlowerWorld from './worlds/flowerWorld'

// initialize global clock
var clock = new THREE.Clock();
var cameraControl;
var basicWorld;

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
  camera.lookAt(new THREE.Vector3(0,0,0));
  camera.updateProjectionMatrix();

  // putting in a simple axis helper to help visualize 
  var axisHelper = new THREE.AxisHelper( 10 );
  scene.add( axisHelper );

  cameraControl = new CameraControls(scene, clock, camera); 
 
  basicWorld = new FlowerWorld(scene, clock);

  // add gui controls
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });  
}

// called on frame updates
function onUpdate(framework) {

  // timer based geometry animation 
  // spin the world, then slow it down to a stop 
  if (basicWorld !== undefined) {
    if (clock.elapsedTime < 5) {
      basicWorld.spin(Math.PI / 10000);
    }
    if (clock.elapsedTime >= 5 && clock.elapsedTime < 10) {
      basicWorld.spin(Math.PI / 10000); // ease spin 
    }
    if (clock.elapsedTime>= 10 && clock.elapsedTime < 12) {
      basicWorld.spin(Math.PI / 1000); 


    }
    if (clock.elapsedTime>= 12 && clock.elapsedTime <= 14) {
      basicWorld.spin(Math.PI / 1000); 
    }

    // TESTING HARDCODED CAMERA CONTROLS!!!!ZZZZ!!! 
    cameraControl.zoomInZ(1, 3, 10); 
    cameraControl.zoomOutZ(3,5);
    cameraControl.simplePanX(5,7);

    
    basicWorld.tick();
  }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
