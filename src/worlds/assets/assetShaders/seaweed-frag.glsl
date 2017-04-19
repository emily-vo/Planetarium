varying vec2 vUv;
varying vec3 f_position; 
varying vec3 f_normal; 
varying float noise;
uniform sampler2D image;


void main() {

  vec2 uv = vec2(1,1) - vUv;
  vec4 color = vec4(0.921, 0.258, 0.258,1);

  // hardcoded light vector 
  vec3 light_vec = vec3(1.0, 1.0, 2.0); 
  // simple lambertian lighting
  vec3 d = normalize(light_vec - f_position);
  float lambert = clamp(dot(d, f_normal), 0.0, 1.0); 
  float globalIllum = 0.2; 

  // out color
  gl_FragColor = vec4( lambert * color.rgb, 1.0) + globalIllum * vec4(color.rgb, 1.0);
}