varying vec2 vUv;
varying vec3 f_position; 
varying vec3 f_normal; 
varying float noise;
uniform sampler2D image;
uniform float u_time; 
uniform vec3 light_vec; 

// cosine based palette from IQ 
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {

    // compute colors
    float speed = 0.1; 
    vec3 col = palette(speed * u_time, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20) );

  vec2 uv = vec2(1,1) - vUv;
  vec3 lGreen = vec3(0.403, 0.552, 0.384);
  vec3 dGreen = vec3(0.109, 0.360, 0.078); 

  // hardcoded light vector 
  // vec3 light_vec = vec3(1.0, 1.0, 2.0); 
  // simple lambertian lighting
  vec3 d = normalize(light_vec - f_position);
  float lambert = clamp(dot(d, f_normal), 0.0, 1.0); 
  float globalIllum = 0.2; 

  // out color
  gl_FragColor = vec4( lambert * dGreen, 1.0) + globalIllum * vec4(dGreen, 1.0);
}