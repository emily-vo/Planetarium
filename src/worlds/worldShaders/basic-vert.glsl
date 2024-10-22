varying vec2 vUv;
varying vec3 f_normal; 
varying vec3 f_position;

void main() {
    vUv = uv;
    f_normal = normal;
    f_position = position; 
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}