uniform vec4 color;

varying vec2 vUv;
varying vec4 finalColor;

void main() {
    vUv = uv;
    finalColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}