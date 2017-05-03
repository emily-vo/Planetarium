varying vec2 vUv;
varying vec3 f_position; 
varying vec3 f_normal; 
varying float noise;
uniform float u_time; 
uniform vec3 light_vec; 

// noise function 
float noiseValue(float x, float y, float z){
  float value1 = fract(sin(dot(vec2(z, y) ,vec2(1027.9898, 29381.233))) * 333019.5453);
  float value2 = fract(sin(x) * 43758.5453);
  return dot(value1, value2); 
}

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
  vec3 pink = vec3(0.898, 0.682, 0.866);
  float randColR = noiseValue(f_position.x, f_position.y, f_position.z);

  vec3 randCol = vec3(randColR,0.682 + randColR / 4.0, 0.866 + randColR / 2.0); 

  // hardcoded light vector 
  // vec3 light_vec = vec3(1.0, 1.0, 2.0); 
  // simple lambertian lighting
  vec3 d = normalize(light_vec - f_position);
  float lambert = clamp(dot(d, f_normal), 0.0, 1.0); 
  float globalIllum = 0.2; 

  // out color
  gl_FragColor = vec4( lambert * randCol, 1.0) + globalIllum * vec4(pink, 1.0);
}