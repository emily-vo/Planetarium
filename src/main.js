
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

var humble = "./audio/humble.mp3";
var wildcat = "./audio/wildcat.mp3";
var flowers = "./audio/the-deli-flowers.mp3";

var music = {
  humble: 1,
  wildcat: 2,
  flowers: 3,
};

var song = music.wildcat;

var skyboxMat;

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

  cameraControl = new CameraControls(scene, clock, camera);

  // putting in a simple axis helper to help visualize
  var axisHelper = new THREE.AxisHelper( 10 );
  scene.add( axisHelper );

  var objLoader = new THREE.OBJLoader();
  
  objLoader.load('house.obj', function(obj) {
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
    Audio.init(path); 
  });

  var geo = new THREE.SphereGeometry(40, 32, 32);
  var texloader = new THREE.TextureLoader();
  // initialize example uniform variables and store in list
  var shaderUniforms = {
      texture: {
          type: "t", 
          value: texloader.load('./textures/sky.jpg')
      },
      u_useTexture: {
          type: 'i',
          value: true
      },
      u_albedo: {
          type: 'v3',
          value: new THREE.Color('#dddddd')
      },
      u_ambient: {
          type: 'v3',
          value: new THREE.Color('#000000')
      },
      u_lightPos: {
          type: 'v3',
          value: new THREE.Vector3(30, 50, 40)
      },
      u_lightCol: {
          type: 'v3',
          value: new THREE.Color('#ffffff')
      },
      u_lightIntensity: {
          type: 'f',
          value: 2
      },
      u_camPos: {
          type: 'v3',
          value: camera.position
      }, 
      time: {
          type: 'float',
          value: clock.elapsedTime
      }
  };
  
  // initialize example shader and mesh
  skyboxMat = new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader: require('./shaders/iridescent-vert.glsl'),
        fragmentShader: require('./shaders/iridescent-frag.glsl'), 
        //lights: true
  });

  skyboxMat.side = THREE.DoubleSide;
  skyboxMat.transparent = true;
  //skyboxMat.side = THREE.BackSide;

  var skySphere = new THREE.Mesh(geo, skyboxMat);
  //scene.add(skySphere);
  //camera.children.push(skySphere);
 // skySphere.parent = camera;
  
 

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

function flowerWorldChoreo(start, end) {
  if (timeTarget(start)) {
    flowerWorld.toggleDisplay(true);
  }

  if (flowerWorld.displayed) {
    flowerWorld.spin(start, start + 10, Math.PI / 1000);
    flowerWorld.spinAccelerate(start + 10, start + 15, Math.PI / 4000);
    flowerWorld.tick();
  }

  if (timeTarget(end)) {
    flowerWorld.toggleDisplay(false);
  }
}

function waterWorldChoreo(start, end) {
  if (timeTarget(start)) {
    waterWorld.toggleDisplay(true);
  }

  if (waterWorld.displayed) {
    waterWorld.spin(start, start + 6, Math.PI / 3000);
    waterWorld.tick();
  }

  if (timeTarget(end)) {
    waterWorld.toggleDisplay(false);
  }
}

function crystalWorldChoreo(start, end) {

  if (timeTarget(start)) {
    crystalWorld.toggleDisplay(true);
  }
  if (crystalWorld.displayed) {
    crystalWorld.fadeIn(3, 10);
    crystalWorld.fadeOut(15, 20);
    crystalWorld.fadeIn(25, 28);
    crystalWorld.tick();
  }

  if (timeTarget(end)) {
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
    //flowerWorldChoreo(2, 15);
    //waterWorldChoreo(15, 25);
    crystalWorldChoreo(2, 100);
  }
    
  if (cameraControl) {
    cameraControl.zoomInZ(4.5, 6.5); 
    cameraControl.zoomOutZ(7.5,10);
  }
}

// called on frame updates
function onUpdate(framework) {
  if (clock) clock.getDelta();
  if (skyboxMat && Audio.getAnalyser()) {
    //var analyser = Audio.getAnalyser();
    //var bufferLength = analyser.frequencyBinCount;
    //var musicData = new Uint8Array(bufferLength);
    //analyser.getByteFrequencyData(musicData);
    //
    //skyboxMat.uniforms.time.value = musicData[0] / 50;
  }

  tryInitWorlds();
  basicChoreography(); 
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
