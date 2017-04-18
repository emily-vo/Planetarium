varying vec2 vUv;
varying vec4 finalColor;

void main() {

    // float d = clamp(dot(normal, normalize( f_position)), 0.0, 1.0);

	// color the output 
	// gl_FragColor = vec4(d * finalColor * 1.2, 1); // frag with Lambertian shading 
	// gl_FragColor = vec4(color, 1); 

	gl_FragColor = finalColor;
}