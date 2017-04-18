const THREE = require('three')
import Asset from './asset'
import Item from './item'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class Flower extends Asset {
    constructor(scene, timer, world) {
        super(scene, timer, world);

        // Create inside petals
        for (var i = 0; i < 3; i++) {
          var c = createPetal();
          var item = new Item(c);
          setAbsoluteRotation(c, 'Y', 
            ((Math.PI * 2) / 3) * (i) + ((Math.PI * 2) / 6));
          setAbsoluteScale(c, 0.5, 0.5, 0.5);
          setAbsolutePosition(c, 0, 1, 0);
          //item.localPosition.y += 3;
          this.items.push(item);
        }

        // Create outside petals
        for (var i = 0; i < 3; i++) {
          var c = createPetal();
          var item = new Item(c);
          setAbsolutePosition(c, 0, -0.5, 0);
          setAbsoluteRotation(c, 'Y', 
            ((Math.PI * 2) / 3) * (i));
          setAbsoluteScale(c, 0.5, 0.5, 0.5);
          setAbsolutePosition(c, 0, 1, 0);
          //item.localPosition.y += 3;
          this.items.push(item);
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
function createPetal() {
    var shaderUniforms = {
        time: { 
            type: "float", 
            value: 0
        },
        color: {
            type: "v4",
            value: new THREE.Vector4( 1., 0., 0., 1. )
        }, 
        image: { // Check the Three.JS documentation for the different allowed types and values
            type: "t", 
            value: THREE.ImageUtils.loadTexture('./textures/petal.jpg')
        }
    };

    var material = new THREE.ShaderMaterial({
          uniforms: shaderUniforms,
          vertexShader: require('./assetShaders/basic-vert.glsl'),
          fragmentShader: require('./assetShaders/basic-frag.glsl'), 
          side: THREE.DoubleSide 
          //lights: true
    });

    // Create flower meshes procedurally
    var width = 1.0;
    var height = 5;
    var geometry = new THREE.PlaneGeometry( width, height, 1, 20);
    var petal = new THREE.Mesh( geometry, material );

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

    setAbsolutePosition(petal, 0, 2, 0);
    setAbsoluteRotation(petal, 'X', Math.PI / 3);

    return petal;
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
