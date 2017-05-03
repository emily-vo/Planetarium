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
        aberration: {
          type: 'f',
          value: 0.0
        }
    },
    vertexShader: require('../shaders/pass-vert.glsl'),
    fragmentShader: require('../shaders/rgbshift-frag.glsl')
});

export default {
  shader: shader
}
