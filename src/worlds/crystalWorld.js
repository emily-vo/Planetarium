const THREE = require('three')
import Asset from './assets/asset'
import World from './world'
import Crystal from './assets/crystal'
// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class FlowerWorld extends World {
    constructor(scene, camera, timer, light) {
    	// initialize example uniform variables and store in list
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
            }
        };
    
        // initialize example shader and mesh
        var material = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./worldShaders/iridescent-vert.glsl'),
              fragmentShader: require('./worldShaders/iridescent-frag.glsl'), 
              //lights: true
        });
    
        var geometry = new THREE.IcosahedronGeometry(6, 1);
        var baseMesh = new THREE.Mesh(geometry, material);
        
        super(scene, timer, baseMesh);

        for (var i = 0; i < 30; i++) {
        	this.spawnAsset(new Crystal(scene, camera, timer, this));
        }
    }
}