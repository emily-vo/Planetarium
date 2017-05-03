uniform sampler2D tDiffuse;
uniform float u_amount;
varying vec2 f_uv;

float gray(vec4 col) {
  return col.r * 0.3 + col.g * 0.59 + col.b * 0.11;
}

void main() {
    vec4 col = texture2D(tDiffuse, f_uv);

    float sat = 5.0;
    float gray = gray(col);

    float r = sat * col.r + (1.0 - sat) * (col.r + (gray - col.r));
    float g = sat * col.g + (1.0 - sat) * (col.g + (gray - col.g));
    float b = sat * col.b + (1.0 - sat) * (col.b + (gray - col.b));

    gl_FragColor = col;//vec4(r, g, b, 1.0);
}
