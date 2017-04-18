
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import World from './worlds/world'
import BasicWorld from './worlds/basicWorld'
import CameraControls from './worlds/cameraControls'

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

  // create simple world
  basicWorld = new BasicWorld(scene, clock);

  // create camera controls
  cameraControl = new CameraControls(scene, clock, camera); 

  // Create flower meshes procedurally
  var width = 1.0;
  var height = 5;
  var geometry = new THREE.PlaneGeometry( width, height, 1, 20);
  var material = new THREE.MeshLambertMaterial( {color: 0xffffff, 
    side: THREE.DoubleSide, wireframe: false} );
  var geo = new THREE.PlaneGeometry( width, height, 1, 20);
  var mat = new THREE.MeshLambertMaterial( {color: 0xffffff, 
    side: THREE.DoubleSide, wireframe: false} );
  var petal = new THREE.Mesh( geometry, material );
  var outerPetal = new THREE.Mesh( geo, mat );

  // create inner petal geometry
  for (var i = 0; i < petal.geometry.vertices.length / 2; i++) {
    var val = 0.25 * easeInQuadratic(petal.geometry.vertices[2 * i].y);
    petal.geometry.vertices[2 * i].z = val;
    petal.geometry.vertices[2 * i + 1].z = val;
  }

  for (var i = 0; i < petal.geometry.vertices.length; i++) {
    if (petal.geometry.vertices[i].x == width / 2) {
      var xval = width  + width / 4 - 
      easeInQuadratic(petal.geometry.vertices[i].y) / (height * width);
      petal.geometry.vertices[i].x = xval;
    } else if (petal.geometry.vertices[i].x == - width / 2) {
      var xval = - width - width / 4 + 
      easeInQuadratic(petal.geometry.vertices[i].y) / (height * width);
      petal.geometry.vertices[i].x = xval;
    }
  }

  // create outer petal geometry
  for (var i = 0; i < outerPetal.geometry.vertices.length / 2; i++) {
    var val = 0.25 * easeInQuadratic(outerPetal.geometry.vertices[2 * i].y);
    outerPetal.geometry.vertices[2 * i].z = val;
    outerPetal.geometry.vertices[2 * i + 1].z = val;
  }

  for (var i = 0; i < outerPetal.geometry.vertices.length; i++) {
    if (outerPetal.geometry.vertices[i].x == width / 2) {
      var xval = width  + width / 4 - 
        easeInQuadratic(outerPetal.geometry.vertices[i].y) / (height * width);
      outerPetal.geometry.vertices[i].x = xval;
    } else if (outerPetal.geometry.vertices[i].x == - width / 2) {
      var xval = - width - width / 4 + 
        easeInQuadratic(outerPetal.geometry.vertices[i].y) / (height * width);
      outerPetal.geometry.vertices[i].x = xval;
    }
  }

  petal.position.set( 0, 2, 0 );
  petal.updateMatrix();
  petal.geometry.applyMatrix( petal.matrix );
  petal.position.set( 0, 0, 0 );
  petal.rotation.set( 0, 0, 0 );
  petal.scale.set( 1, 1, 1 );
  petal.updateMatrix();

  petal.rotation.x += (Math.PI / 3);
  petal.updateMatrix();
  petal.geometry.applyMatrix( petal.matrix );
  
  petal.position.set( 0, 0, 0 );
  petal.rotation.set( 0, 0, 0 );
  petal.scale.set( 1, 1, 1 );
  petal.updateMatrix();

  outerPetal.position.set( 0, 2.5, 0 );
  outerPetal.updateMatrix();
  outerPetal.geometry.applyMatrix( outerPetal.matrix );
  outerPetal.position.set( 0, 0, 0 );
  outerPetal.rotation.set( 0, 0, 0 );
  outerPetal.scale.set( 1, 1, 1 );
  outerPetal.updateMatrix();

  outerPetal.rotation.x += (Math.PI / 2.5);
  outerPetal.updateMatrix();
  outerPetal.geometry.applyMatrix( outerPetal.matrix );
  
  outerPetal.position.set( 0, 0, 0 );
  outerPetal.rotation.set( 0, 0, 0 );
  outerPetal.scale.set( 1, 1, 1 );
  outerPetal.updateMatrix();

  for (var i = 0; i < 3; i++) {
    var clone = petal.clone(); 
    clone.rotation.y += ((Math.PI * 2) / 3) * (i);
    //scene.add(clone);
  }

  for (var i = 0; i < 3; i++) {
    var c = outerPetal.clone();
    c.rotation.y += ((Math.PI * 2) / 3) * (i) + ((Math.PI * 2) / 6);
    //scene.add(c);
  }

  // add gui controls
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });  
}

function lerp(a0, a1, t) {
    return t+a0 + (1-t)*a1;
}

function bias(b, t) {
    return Math.pow(t, Math.log(b) / Math.log(0.5));
}

function easeInQuadratic(t) {
    return t*t;
}

function easeOutQuadratic(t) {
    return 1 - easeInQuadratic(1-t);
}

// removes all geometries with the tag "world" or "asset"
function clearScene() {
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
      basicWorld.easeSpin(Math.PI / 10000);
    }
    if (clock.elapsedTime>= 10 && clock.elapsedTime < 12) {
      basicWorld.spin(Math.PI / 1000); 


    }
    if (clock.elapsedTime>= 12 && clock.elapsedTime <= 14) {
      basicWorld.easeSpin(Math.PI / 1000); 
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
