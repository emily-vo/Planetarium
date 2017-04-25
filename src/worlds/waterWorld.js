const THREE = require('three')
import Asset from './assets/asset'
import Seaweed from './assets/seaweed'
import Koi from './assets/koi'
import World from './world'

var seaweeds = [];
var kois = [];   

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class WaterWorld extends World {
    constructor(scene, timer, light) {
        // this defines the position of the planet in space.
        var wPos = new THREE.Vector3(0,0,0);

        // initialize example uniform variables and store in list
        var shaderUniforms = {
            u_time: { 
                type: "float", 
                value: timer.elapsedTime
            },
            color: {
                type: "v4",
                value: new THREE.Vector4( 1., 1., 1., 1. )
            },
            light_vec: {
                type: "v3",
                value: new THREE.Vector3(light.position.x, light.position.y, light.position.z)
            },
        };

        // noise-water material
        var material = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./worldShaders/water-vert.glsl'),
              fragmentShader: require('./worldShaders/water-frag.glsl')
        });
        // enable transparency of the material 
        material.transparent = true;

        // basic lambert material 
        var basicMaterial = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./worldShaders/basic-vert.glsl'),
              fragmentShader: require('./worldShaders/water-base-frag.glsl')
        });
        // enable transparency of the material 
        material.transparent = true;

    
        var geometry = new THREE.IcosahedronGeometry(6, 2); // adjust second parameter: low poly (2) or high poly!!! (>3)
        var baseMesh = new THREE.Mesh(geometry, material);

        super(scene, timer, baseMesh);
        this.scene = scene; 
        this.timer = timer;
        this.light = light; 
        this.setMeshPosition(baseMesh, wPos.x, wPos.y, wPos.z);
        
        // make a "base sphere"
        // add this somewhere to the class? not sure 
        var baseSphereGeom = new THREE.IcosahedronGeometry(6,4);  // new THREE.BoxGeometry(6,6,6); consider making a box
        this.innerSphere = new THREE.Mesh(baseSphereGeom, basicMaterial); 

        // make a member for light
        this.light = light; 

        // the inside sphere 
        scene.add(this.innerSphere);
        this.setMeshPosition(this.innerSphere, wPos.x, wPos.y, wPos.z);
        
        // create seaweed assets!
        for (var i = 0; i < 25; i++) {
            var seaweed = new Seaweed(scene, timer, this);
            this.spawnAsset(seaweed);
            seaweeds.push(seaweed); 
        }

        // create koi assets
        for (var i = 0; i < 10; i++) {
            var koi = new Koi(scene, timer, this);
            this.spawnAsset(koi);
            kois.push(koi); 
        }

    }

    // remove the random base sphere from scene lol sad
    removeInnerSphere(time) {
        if (this.timer.elapsedTime >= time) {
            this.scene.remove(this.innerSphere);
        }
    }

    // add inner sphere to scene
    addInnerSphere(time) {
        if (this.timer.elapsedTime >= time) {
            this.scene.add(this.innerSphere);
        }
    }

    // to update the uniform in the frag shader, enables animation
    updateWaterTime() {
        this.baseMesh.material.uniforms.u_time.value = this.timer.elapsedTime;
        for (var i = 0; i < seaweeds.length; i++) {
            seaweeds[i].material.uniforms.u_time.value = this.timer.elapsedTime; 
        }
        for (var i = 0; i < kois.length; i++) {
            kois[i].material.uniforms.u_time.value = this.timer.elapsedTime; 
        }

    }
}