const THREE = require('three')
import Asset from './assets/asset'
import Cubes from './assets/cubes'
import World from './world'
// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class BasicWorld extends World {
    constructor(scene, timer) {
    	// initialize example uniform variables and store in list
        var shaderUniforms = {
            time: { 
                type: "float", 
                value: 0
            },
            color: {
                type: "v4",
                value: new THREE.Vector4( 1., 1., 1., 1. )
            }
        };
    
        // initialize example shader and mesh
        var material = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./worldShaders/basic-vert.glsl'),
              fragmentShader: require('./worldShaders/basic-frag.glsl')
        });
    
        var geometry = new THREE.IcosahedronGeometry(6, 3);
        var baseMesh = new THREE.Mesh(geometry, material);
        
        super(scene, timer, baseMesh);

        for (var i = 0; i < 10; i++) {
        	this.spawnAsset(new Cubes(scene, timer, this));
        }
    }
}