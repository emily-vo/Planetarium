const THREE = require('three')
import Asset from './asset'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class World {
    constructor(scene, timer) {
        this.scene = scene;
        this.timer = timer;
        this.assets = [];
        this.materials = [];
        
        /*
        // initialize example uniform variables and store in list
        var exShaderUniforms = {
            time: { 
                type: "float", 
                value: 0
            }
        };

        // initialize example shader
        var exMaterial = new THREE.ShaderMaterial({
              uniforms: exShaderUniforms,
              vertexShader: require('./shaders/noisy-vert.glsl'),
              fragmentShader: require('./shaders/noisy-frag.glsl')
        });

        // store in global list of shaders
        this.materials.push(exMaterial);

        // create an example asset
        var exAsset = new Asset(scene, timer);
        this.assets.push(exAsset);
        */
    }

    // update shader times
    updateShaderUniforms() {
        var delta = this.timer.getDelta();
        for (var i = 0; i < this.materials.length; i++) {
          var shader = this.materials[i];
          if (shader.uniforms.time !== undefined) {
              shader.uniforms.time.value += delta;
          }
        }
    }

    // update assets
    tick() {
        this.updateShaderUniforms();

        // assets tick
        for (var i = 0; i < this.assets.length; i++) {
          this.assets[i].tick();
        }
    }
}