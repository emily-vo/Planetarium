const THREE = require('three')
import Asset from './assets/asset'
import Flower from './assets/flower'
import World from './world'
// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class FlowerWorld extends World {
    constructor(scene, timer, light) {
    	// initialize example uniform variables and store in list
        var shaderUniforms = {
            time: { 
                type: "float", 
                value: 0
            },
            color: {
                type: "v4",
                value: new THREE.Vector4( 1., 1., 1., 1. )
            }, 
            image: { // Check the Three.JS documentation for the different allowed types and values
                type: "t", 
                value: THREE.ImageUtils.loadTexture('./textures/grass.jpg')
            },
            light_vec: {
                type: "v3",
                value: new THREE.Vector3(light.position.x, light.position.y, light.position.z)
            },
        };
    
        // initialize example shader and mesh
        var material = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./worldShaders/basic-vert.glsl'),
              fragmentShader: require('./worldShaders/basic-frag.glsl'), 
              //lights: true
        });
    
        var geometry = new THREE.IcosahedronGeometry(6, 1);
        var baseMesh = new THREE.Mesh(geometry, material);
        
        super(scene, timer, baseMesh);

        for (var i = 0; i < 10; i++) {
        	this.spawnAsset(new Flower(scene, timer, this));
        }
    }
}