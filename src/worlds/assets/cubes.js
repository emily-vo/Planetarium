const THREE = require('three')
import Asset from './asset'
import Item from './item'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class Cubes extends Asset {
    constructor(scene, timer, world) {
        super(scene, timer, world);

        // add basic cube mesh item as example asset
        this.shaderUniforms = {
            time: { 
                type: "float", 
                value: 0
            },
            color: {
                type: "v4",
                value: new THREE.Vector4( 1., 0., 0., 1. )
            }
        };

        var material = new THREE.ShaderMaterial({
              uniforms: this.shaderUniforms,
              vertexShader: require('./assetShaders/basic-vert.glsl'),
              fragmentShader: require('./assetShaders/basic-frag.glsl')
        });

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var mesh = new THREE.Mesh(geometry, material);

        var redCube = new Item(mesh);

        // The asset class must have a normal and a vertex assigned before alignment can occur
        // Make sure to call updateRotations from the asset class to update the item rotations
        redCube.localRotation = new THREE.Vector3(45, 45, 0);

        this.items.push(redCube);
    }
}