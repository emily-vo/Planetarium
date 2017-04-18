varying vec2 vUv;
varying vec3 f_position; 
varying vec3 f_normal; 
varying float noise;
uniform sampler2D image;


void main() {

  vec2 uv = vec2(1,1) - vUv;
  vec4 color = vec4(0,1,0,1);

  gl_FragColor = vec4( color.rgb, 1.0 );

}