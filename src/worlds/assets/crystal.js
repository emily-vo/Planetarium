const THREE = require('three')
import Asset from './asset'
import Item from './item'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class Crystal extends Asset {
    constructor(scene, camera, timer, world) {
        super(scene, timer, world);

        var shaderUniforms = {
            texture: {
                type: "t", 
                value: THREE.ImageUtils.loadTexture('./textures/iridescent.bmp')
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
                value: new THREE.Color('#414347')
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
            }
        };
    
        // initialize example shader and mesh
        var material = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./assetShaders/iridescent-vert.glsl'),
              fragmentShader: require('./assetShaders/iridescent-frag.glsl'), 
              //lights: true
        });

        var numCrystals = 3 + Math.random() * 3;
        for (var i = 0; i < 1; i++) {
          var geo = createCrystalGeo();   
          var mesh = new THREE.Mesh(geo, material);
          setAbsoluteRotation(mesh, 'X', Math.PI / 2);
          setAbsolutePosition(mesh, 0, Math.random() * 2 + 1, 0);
          this.items.push(new Item(mesh));
        }
    }
}

// Allows the mesh to assume it is untransformed
function resetTransform(mesh) {
    mesh.updateMatrix();
    mesh.geometry.applyMatrix( mesh.matrix );
    mesh.position.set( 0, 0, 0 );
    mesh.rotation.set( 0, 0, 0 );
    mesh.scale.set( 1, 1, 1 );
    mesh.updateMatrix();
}

function setAbsolutePosition(mesh, x, y, z) {
    mesh.position.set(x, y, z);
    resetTransform(mesh);
}

function setAbsoluteScale(mesh, x, y, z) {
    mesh.scale.set(x, y, z);
    resetTransform(mesh);
}

function setAbsoluteRotation(mesh, axis, rotation) {
    switch (axis) {
        case 'X':
            mesh.rotation.x = rotation;
        break;

        case 'Y':
            mesh.rotation.y = rotation;
        break;

        case 'Z':
            mesh.rotation.z = rotation;
        break;
    }
    resetTransform(mesh);
}

// Uses toolbox functions to create flower meshes
function createCrystalGeo() {
  var thickness = Math.random() / 20;
  var pts = [], count = Math.floor(Math.random()) * 3 + 3;

  for ( var i = 0; i < count; i ++ ) {
    var l = thickness;
    var a = 2 * i / count * Math.PI;
    pts.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );

  }

  var shape = new THREE.Shape( pts );

  var extrudeSettings = { amount: Math.random() * 5 + 2, bevelEnabled: true, bevelSegments: Math.floor(Math.random() * 2) + 1, steps: 5, bevelSize: 1, bevelThickness: 1.0};
  var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  return geometry;
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
