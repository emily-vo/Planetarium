varying vec2 vUv;
varying vec3 f_position; 
varying vec3 f_normal; 

void main() {
	f_position = position;
	f_normal = normal; 
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}