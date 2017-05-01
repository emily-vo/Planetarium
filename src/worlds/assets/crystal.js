const THREE = require('three')
import Asset from './asset'
import Item from './item'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class Crystal extends Asset {
    constructor(scene, camera, timer, world) {
        super(scene, timer, world);
        
        this.face;

        var texloader = new THREE.TextureLoader();
        var shaderUniforms = {
            texture: {
                type: "t", 
                value: texloader.load('./textures/iridescent.bmp')
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
                value: new THREE.Color('#111111')
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
                value: timer.elapsedTime
            }, 
            alpha: {
                type: 'float', 
                value: 0.0
            }
        };
    
        // initialize example shader and mesh
        var material = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./assetShaders/iridescent-vert.glsl'),
              fragmentShader: require('./assetShaders/iridescent-frag.glsl'), 
        });

        material.transparent = true;
        material.shading = THREE.FlatShading;
        this.material = material;
        var mesh = createMainCrystalMesh(material);   
        this.items.push(new Item(mesh));
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

function createMainCrystalMesh(material) {
  var thickness = 0.65;
  var pts = [], count = Math.floor(Math.random() * 5) + 3;

  for ( var i = 0; i < count; i ++ ) {
    var l = thickness;
    var a = 2 * i / count * Math.PI;
    pts.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );

  }

  var shape = new THREE.Shape( pts );

  var length = thickness * Math.random() * 6;
  var extrudeSettings = { amount: length, 
    bevelEnabled: true, bevelSegments: Math.floor(Math.random() * 2) + 1, 
    steps: 5, bevelSize: thickness, bevelThickness: thickness * 4};
  var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  material.needsUpdate = true;
  var mesh = new THREE.Mesh(geometry, material);
  mesh.geometry.dynamic = true;

  setAbsoluteRotation(mesh, 'X', Math.PI / 2);
  setAbsoluteRotation(mesh, 'Y', Math.PI / 2 * Math.random() / 10);
  setAbsolutePosition(mesh, 0, -length / 2, 0);

  return mesh;
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
