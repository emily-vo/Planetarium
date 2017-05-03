uniform sampler2D tDiffuse;
uniform float u_amount;
uniform float warmth;
uniform float time;
uniform float size;
varying vec2 f_uv;

// noise function returns range [-1,1]
float noise1(float x, float y, float z){
	float value1 = fract(sin(dot(vec2(z, y) ,vec2(1027.9898, 29381.233))) * 333019.5453);
	float value2 = fract(sin(x) * 43758.5453);
	return dot(value1, value2);
}

void main() {
    vec4 col = texture2D(tDiffuse, f_uv);
    float brightness = 0.7;
    float lightness = 0.7;
    float red = warmth + 0.2;
    float yel = warmth;

    // grain - https://www.reddit.com/r/opengl/comments/1rr4fy/any_good_ways_of_generating_film_grain_noise/
    float strength = 50.0;
    float x = (f_uv.x + 4.0) * (f_uv.y + 4.0) * (time * 10.0);
    vec3 grain = vec3(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01) - 0.005);
    grain *= strength;

    float offset2 = 0.01;
    float offsetSz = 25.0;
    if (size > 90.0) {
      offset2 = 0.03;
      offsetSz = 6.0;
    }

    if (mod(floor(f_uv.y * offsetSz * 2.0) - offsetSz, 7.0) == 0.0) {
      vec2 p = vec2(f_uv.x, f_uv.y + offset2);
      col = texture2D(tDiffuse, p);
      brightness *= 2.0;
    }

    col.r += grain.x;
    col.g += grain.y;
    col.b += grain.z;

    col.r = col.r * brightness + lightness + red;
    col.g = col.g * brightness + lightness;
    col.b = col.b * brightness + lightness - yel;

    // CRT scanlines https://gamedev.stackexchange.com/questions/64036/how-can-i-implement-a-scanline-effect
    float y = f_uv.y * 500.0;
    float d = floor(y) - y;
    float d_sq = d * d;

    if (d_sq > 0.1) {
      col.r *= 0.5;
      col.g *= 0.5;
      col.b *= 0.5;
    }

    gl_FragColor = col;

}
