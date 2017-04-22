varying vec2 vUv;
varying vec3 f_position; 
varying vec3 f_normal; 
uniform float u_time; 

void main() {
	f_position = position;
	f_normal = normal; 
    vUv = uv;

    float timeMod; 
    if (f_position.x > 1.0 ) {
    	timeMod = cos(u_time * 2.0); 
    } else {
    	timeMod = sin(u_time * 2.0);
    }
    vec3 position = vec3(f_position.x , f_position.y, f_position.z * timeMod);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}