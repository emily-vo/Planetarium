varying vec2 vUv;
varying vec3 f_normal; 
varying vec3 f_position;
uniform sampler2D image;
uniform vec3 light_vec; 
uniform float u_time; 

void main() {
  vec3 turquoise = vec3(27.0 / 255.0, 193.0 / 255.0, 163.0 / 255.0);
  vec3 darkBlue = vec3(0.2,0.5,1.0);

  // simple lambertian lighting
  vec3 d = normalize(light_vec - f_position);
  float lambert = clamp(dot(d, f_normal), 0.0, 1.0); 
  float globalIllum = 0.2; 

  // out color
  gl_FragColor = vec4( lambert * turquoise, 0.2) + globalIllum * vec4(darkBlue, 1.0);

  // set transparency 
  gl_FragColor.a = 0.6;
}