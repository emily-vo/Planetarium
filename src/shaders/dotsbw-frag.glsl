uniform sampler2D tDiffuse;
uniform float u_amount;
uniform float scale;
varying vec2 f_uv;

float gray(vec4 col) {
  return col.r * 0.3 + col.g * 0.59 + col.b * 0.11;
}

// Influence from https://threejs.org/examples/webgl_postprocessing.html
float pattern() {
  vec2 center = vec2(0.5, 0.5);
  vec2 tSize = vec2(256, 256);
  float pScale = 4.0 + scale * 0.01;

  float s = sin(1.5);
  float c = cos(1.5);
  vec2 tex = f_uv * tSize - center;
  vec2 point = vec2(c * tex.x - s * tex.y, s * tex.x + c * tex.y) * pScale;
  return (sin(point.x) * sin(point.y)) * 4.0;
}

void main() {
    vec4 col = texture2D(tDiffuse, f_uv);
    float pat = pattern();
    float brightness = 1.1;

    float avg = (col.r + col.g + col.b) / 3.0;
    gl_FragColor = vec4(vec3(avg * 10.0 - 5.0 + pat), 1.0);
}
