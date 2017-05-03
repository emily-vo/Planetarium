uniform sampler2D tDiffuse;
uniform float u_amount;
uniform float aberration;
varying vec2 f_uv;

// Influence from https://forum.unity3d.com/threads/rgb-split-shader.220068/
// Chromatic aberration!!!!!! Fun
void main() {

  float r = texture2D(tDiffuse, vec2(f_uv.x - aberration, f_uv.y)).r;
  float g = texture2D(tDiffuse, f_uv).g;
  float b = texture2D(tDiffuse, vec2(f_uv.x + aberration, f_uv.y)).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
