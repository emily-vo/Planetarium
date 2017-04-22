const THREE = require('three')
import Asset from './asset'
import Item from './item'


// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class Seaweed extends Asset {
    constructor(scene, timer, world) {
        super(scene, timer, world);


        // Create inside petals
        for (var i = 0; i < 3; i++) {
          var c = createSeaweed();
          var item = new Item(c);
          // setAbsoluteRotation(c, 'Y', 
          //   ((Math.PI * 2) / 3) * (i) + ((Math.PI * 2) / 6));
          // setAbsoluteScale(c, 0.5, 0.5, 0.5);
          // setAbsolutePosition(c, 0, 1, 0);
          //item.localPosition.y += 3;
          this.items.push(item);
        }


        // for now, just visualize box 
        // var geometry = new THREE.BoxGeometry(0.1, 2, 0.1);
        // var mesh = new THREE.Mesh(geometry, material);

        // var mesh = new THREE.Mesh(koiMesh, material);

        // var weed = new Item(mesh);

        // The asset class must have a normal and a vertex assigned before alignment can occur
        // Make sure to call updateRotations from the asset class to update the item rotations
        // weed.localRotation = new THREE.Vector3(0, 0, 0);

        // this.items.push(weed);
    }
}

// Uses toolbox functions to create flower meshes
function createSeaweed() {
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
          vertexShader: require('./assetShaders/seaweed-vert.glsl'),
          fragmentShader: require('./assetShaders/seaweed-frag.glsl'), 
          side: THREE.DoubleSide 
    });

    // make seaweed geometry 
    var width = 0.17;
    var height = 2.3;
    var geometry = new THREE.PlaneGeometry( width, height, 1, 20);
    var weed = new THREE.Mesh( geometry, material );

    var prob = Math.random(); 

    // make it wavy 
    for (var i = 0; i < weed.geometry.vertices.length / 4; i++) {
        var val = 0.1 * Math.sin(weed.geometry.vertices[2 * i].y * 7);
        if (prob > 0.5) {
          val = 0.1 * Math.cos(weed.geometry.vertices[2 * i].y * 5);
        }
         // var val = 0.1 * Math.sin(weed.geometry.vertices[2 * i].y * 7);
         weed.geometry.vertices[2 * i].z = val;
         weed.geometry.vertices[2 * i + 1].z = val;
    }

    // taper the ends 
    for (var i = 0; i < weed.geometry.vertices.length; i++) {
        if (weed.geometry.vertices[i].x > width / 2.0) {
            var taper = width - weed.geometry.vertices[i].y / 5.0; // / (height * width);//  easeInQuadratic(weed.geometry.vertices[i].y / (height * width)); 
            weed.geometry.vertices[i].x = taper; 
        }
    }

    return weed;
}

// toolbox functions 
function cos(a, b, c, x) {
    return a * cos(b * x) + c; 
}

function sin(a, b, c, x) {
    return a * sin(b * x) + c; 
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

