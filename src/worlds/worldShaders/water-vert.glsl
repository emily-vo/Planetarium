varying vec2 vUv;
varying vec3 f_normal; 
varying vec3 f_position;
uniform float u_time; 
// noise function returns range [-1,1]
float noise1(float x, float y, float z){
	float value1 = fract(sin(dot(vec2(z, y) ,vec2(1027.9898, 29381.233))) * 333019.5453);
	float value2 = fract(sin(x) * 43758.5453);
	return dot(value1, value2); 
}

float noise_3(float x, float y, float z) {
	float value1 = fract(sin(dot(vec2(x, y) ,vec2(12.9898, 78.233))) * 43758.5453);
	float value2 = fract(sin(z) * 202229.5453);

	return dot(value1, value2); 
}

float noise(float x, float y, float z){
	float value1 = fract(sin(dot(vec2(x, y) ,vec2(3427.9898, 9847.233))) * 202.5453);
	float value2 = fract(cos(z) * 20247.5453);

	return fract(dot(value1, value2)); 
}


// lerp
float lerp(float a, float b, float t) {
	return a * (1.0 - t) + b * t; 
}

// cosine interp 
float cos_interp(float a, float b, float t) {
	float cos_t = (1.0 - cos(t * 3.14159265358979)) * 0.5;
	return lerp(a , b , cos_t);
}

// Interpolate Noise function
// Given a position, use surrounding lattice points to interpolate and find influence 
// takes in (x,y,z) position, and the current octave level
float interpolateNoise(float x, float y, float z) {
	// define the lattice points surrounding the input position 
	float x0 = floor(x);
	float x1 = x0 + 1.0; 
	float y0 = floor(y);
	float y1 = y0 + 1.0;
	float z0 = floor(z);
	float z1 = z0 + 1.0; 

	// VALUE BASED NOISE
	vec3 p0 = vec3(x0, y0, z0); vec3 p1 = vec3(x0, y0, z1);
	vec3 p2 = vec3(x0, y1, z0); vec3 p3 = vec3(x0, y1, z1);
	vec3 p4 = vec3(x1, y0, z0); vec3 p5 = vec3(x1, y0, z1);
	vec3 p6 = vec3(x1, y1, z0); vec3 p7 = vec3(x1, y1, z1);

	// use noise function to generate random value
	// depending on the current octave, sample noise using a different function 
	float v0, v1, v2, v3, v4, v5, v6, v7;
	v0 = noise(p0.x, p0.y, p0.z); v1 = noise(p1.x, p1.y, p1.z);
	v2 = noise(p2.x, p2.y, p2.z); v3 = noise(p3.x, p3.y, p3.z);
    v4 = noise(p4.x, p4.y, p4.z); v5 = noise(p5.x, p5.y, p5.z);
	v6 = noise(p6.x, p6.y, p6.z); v7 = noise(p7.x, p7.y, p7.z);

	// trilinear interpolation of all 8 values
	// coordinates in the unit cube: 
	float unitX = x - x0;
	float unitY = y - y0;
	float unitZ = z - z0;

	float xCos1 = cos_interp(v0, v4, unitX);
	float xCos2 = cos_interp(v1, v5, unitX);
	float xCos3 = cos_interp(v2, v6, unitX);
	float xCos4 = cos_interp(v3, v7, unitX);

	float yCos1 = cos_interp(xCos1, xCos3, unitY);
	float yCos2 = cos_interp(xCos2, xCos4, unitY);

	float average = cos_interp(yCos1, yCos2, unitZ);

	return average;
}

// multioctave
float fbm(float x, float y, float z) {
	float total = 0.0; 
	// make a little less fractal-y 
	// total += interpolateNoise(x * 64.0, y * 64.0, z * 64.0) * 1.0;
	// total += interpolateNoise(x * 32.0, y * 32.0, z * 32.0) * 2.0; 
	// total += interpolateNoise(x * 16.0, y * 16.0, z * 16.0) * 4.0; 
	total += interpolateNoise(x * 8.0, y * 8.0, z * 8.0) * 8.0; 
	total += interpolateNoise(x * 4.0, y * 4.0, z * 4.0) * 16.0; 
	total += interpolateNoise(x * 2.0, y * 2.0, z * 2.0) * 32.0; 
	total += interpolateNoise(x * 1.0, y * 1.0, z * 1.0) * 64.0; 

	return total;
}

// main 
void main() {
	float time = u_time / 2.0;
	float waveHeight = 2.0; // smaller values will give bigger waves 
	// get noise height based on position 
	// TO ANIMATE: add time to the x parameter of this function 
    float noiseHeight = fbm(float(position.x / waveHeight) + time, float(position.y / waveHeight), float(position.z / waveHeight));
    vec3 noisePosition = (vec3(
    	position.x + noiseHeight / 300.0 + normal.x * noiseHeight / 20.0 , 
    	position.y + noiseHeight / 300.0 + normal.y * noiseHeight/ 20.0 , 
    	position.z + noiseHeight / 300.0 + normal.z * noiseHeight/ 20.0)); 

	f_normal = normal; 
	f_position = position; 
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( noisePosition, 1.0 );
}