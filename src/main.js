
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Asset from './asset'
import World from './world'

// initialize global clock
var clock = new THREE.Clock();

var exWorld;

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
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);

  scene.add(directionalLight);

  // set camera position
  camera.position.set(1, 1, 20);
  camera.lookAt(new THREE.Vector3(0,0,0));
  camera.updateProjectionMatrix();

  // create example world
  exWorld = new World(scene, clock);

  // add gui controls
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });  
}

// removes all geometries with the tag "world" or "asset"
function clearScene() {
}

// called on frame updates
function onUpdate(framework) {
  if (exWorld !== undefined) {
    exWorld.tick();
  }
}


// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
