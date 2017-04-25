varying vec2 vUv;
varying vec3 f_position; 
varying vec3 f_normal; 
uniform float u_time; 

float noise(float x, float y, float z){
    float value1 = fract(sin(dot(vec2(x, y) ,vec2(3427.9898, 9847.233))) * 202.5453);
    float value2 = fract(cos(z) * 20247.5453);

    return fract(dot(value1, value2)); 
}

void main() {
	f_position = position;
	f_normal = normal; 
    vUv = uv;

    // float noise = noise(f_position.x, f_position.y, f_position.z); 

    float timeMod = cos(u_time * 0.5); 

    vec3 position = vec3(f_position.x, f_position.y, f_position.z + timeMod);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}