const THREE = require('three');
const EffectComposer = require('three-effectcomposer')(THREE)

var on = false;
function turnOn() { on = true }
function turnOff() { on = false }
function isOn() { return on }

var shader = new EffectComposer.ShaderPass({
    uniforms: {
        tDiffuse: {
          type: 't',
          value: null
        },
        u_amount: {
          type: 'f',
          value: 1.0
        }
    },
    vertexShader: require('../shaders/pass-vert.glsl'),
    fragmentShader: require('../shaders/saturate-frag.glsl')
});

export default {
  shader: shader,
  turnOn: turnOn,
  turnOff: turnOff,
  isOn: isOn
}
