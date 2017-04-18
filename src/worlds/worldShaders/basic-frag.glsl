varying vec2 vUv;
varying float noise;
uniform sampler2D image;
varying vec3 f_normal; 
varying vec3 f_position;
uniform vec3 light_vec; 

void main() {
  vec2 uv = vec2(1,1) - vUv;
  vec4 color = texture2D( image, uv );

  // simple lambertian lighting
  vec3 d = normalize(light_vec - f_position);
  float lambert = clamp(dot(d, f_normal), 0.0, 1.0); 
  float globalIllum = 0.2; 
  gl_FragColor = vec4( lambert * color.rgb, 1.0) + globalIllum * vec4(color.rgb, 1);
}