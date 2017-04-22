const THREE = require('three')
import Asset from './asset'
import Item from './item'


// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class Seaweed extends Asset {
    constructor(scene, timer, world) {
        super(scene, timer, world);

        this.shaderUniforms = {
        time: { 
            type: "float", 
            value: 0
        },
        u_time: { 
            type: "float", 
            value: timer.elapsedTime
        },
        light_vec: {
            type: "v3",
            value: new THREE.Vector3(world.light.position.x, world.light.position.y, world.light.position.z)
        },
    };

    this.material = new THREE.ShaderMaterial({
          uniforms: this.shaderUniforms,
          vertexShader: require('./assetShaders/seaweed-vert.glsl'),
          fragmentShader: require('./assetShaders/seaweed-frag.glsl'), 
          side: THREE.DoubleSide 
    });



        // Create inside petals
        for (var i = 0; i < 2; i++) {
          var c = createSeaweed(timer, this.shaderUniforms, this.material);
          var item = new Item(c);
          setAbsoluteRotation(c, 'Z', 
            ((Math.PI) / 13) * (i) - ((Math.PI * 2.1)));
          setAbsolutePosition(c, -i/12,0,0);
          setAbsoluteScale(c, 1.0, i/2+1.0, 1.0);
          //item.localPosition.y += 3;
          this.items.push(item);
        }
    }
}

// Uses toolbox functions to create flower meshes
function createSeaweed(timer, shaderUniforms, material) {
    shaderUniforms = {
        time: { 
            type: "float", 
            value: 0
        },
        color: {
            type: "v4",
            value: new THREE.Vector4( 1., 0., 0., 1. )
        }, 
        u_time: { 
            type: "float", 
            value: timer.elapsedTime
        },

    };

    // make seaweed geometry 
    var width = 0.17;
    var height = 2.3;
    var geometry = new THREE.PlaneGeometry( width, height, 1, 20);
    var weed = new THREE.Mesh( geometry, material );

    // make it wavy 
    for (var i = 0; i < weed.geometry.vertices.length / 4; i++) {
        var val = 0.1 * Math.sin(weed.geometry.vertices[2 * i].y * 7);
         weed.geometry.vertices[2 * i].z = val;
         weed.geometry.vertices[2 * i + 1].z = val;
    }

    // taper the ends of seaweed 
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

function setAbsoluteScale(mesh, x, y, z) {
    mesh.scale.set(x, y, z);
    resetTransform(mesh);
}

