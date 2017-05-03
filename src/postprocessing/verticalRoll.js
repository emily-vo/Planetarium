const THREE = require('three');
const EffectComposer = require('three-effectcomposer')(THREE)

var shader = new EffectComposer.ShaderPass({
    uniforms: {
        tDiffuse: {
          type: 't',
          value: null
        },
        u_amount: {
          type: 'f',
          value: 1.0
        },
        rollSpeed: {
          type: 'f',
          value: 0.0
        },
        time: {
          type: 'f',
          value: 0.0
        },
        speed: {
          type: 'f',
          value: 0.2
        },
        distortion: {
          type: 'f',
          value: 0.0
        },
        distortion2: {
          type: 'f',
          value: 0.0
        }
    },
    vertexShader: require('../shaders/pass-vert.glsl'),
    fragmentShader: require('../shaders/verticalRoll-frag.glsl')
});



export default {
  shader: shader
}
