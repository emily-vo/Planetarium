varying vec2 vUv;
varying vec3 f_normal; 
varying vec3 f_position;
uniform sampler2D image;
uniform vec3 light_vec; 
uniform float u_time; 

// cosine based palette from IQ 
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}


void main() {
    // compute colors
    float speed = 0.2; 
    vec3 col = palette(speed * u_time, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30));


  vec3 turquoise = vec3(27.0 / 255.0, 193.0 / 255.0, 163.0 / 255.0);
  vec3 darkBlue = vec3(0.2,0.5,1.0);

  // simple lambertian lighting
  vec3 d = normalize(light_vec - f_position);
  float lambert = clamp(dot(d, f_normal), 0.0, 1.0); 
  float globalIllum = 0.2; 

  // out color
  // gl_FragColor = vec4( lambert * turquoise, 0.2) + globalIllum * vec4(darkBlue, 1.0);
  gl_FragColor = vec4(lambert * col, 0.2) + globalIllum * vec4(col, 1.0); 

  // set transparency 
  gl_FragColor.a = 0.05;
}