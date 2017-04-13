const THREE = require('three')

// this class will be overridden very frequently for the various assets.
export default class Asset {
    constructor(scene, timer) {
        this.scene = scene;
        this.timer = timer;
        this.materials = [];
        
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
    }
    
    updateShaderUniforms() {
        var delta = this.timer.getDelta();
        for (var i = 0; i < this.materials.length; i++) {
          var shader = this.materials[i];
          if (shader.uniforms.time !== undefined) {
              shader.uniforms.time.value += delta;
          }
        }
    }

    tick() {
        console.log("asset ticking...");
        this.updateShaderUniforms();
    }
}