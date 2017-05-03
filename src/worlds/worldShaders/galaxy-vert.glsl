varying vec2 vUv;
varying vec3 f_normal; 
varying vec3 f_position;

uniform float u_time;
uniform vec3 light_vec; 
uniform vec3 start_pos;

void main() {
    vUv = uv;
    f_normal = normal;
    f_position = position;
    float scale = position.y;  
    float timeMod = cos(u_time / (1.8 * scale)) * 15.0;
    float timeMod2 = sin(u_time / (1.8 * scale)) * 15.0; 
    vec3 pos = vec3(position.x + timeMod, position.y, position.z - timeMod2); 
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}