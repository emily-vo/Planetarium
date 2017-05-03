uniform sampler2D tDiffuse;
uniform float u_amount;
uniform float warmth;
varying vec2 f_uv;



void main() {
    vec4 col = texture2D(tDiffuse, f_uv);
    float brightness = 0.8;
    float lightness = 0.7;
    float red = warmth + 0.1;
    float yel = warmth;

    col.r = col.r * brightness + lightness + red;
    col.g = col.g * brightness + lightness;
    col.b = col.b * brightness + lightness - yel;

    // CRT scanlines
    float y = f_uv.y * 500.0;
    float d = floor(y) - y;
    float d_sq = d * d;

    if (d_sq < 0.1) {
      gl_FragColor = col;
    } else {
      gl_FragColor = col * 0.5;
    }

    //grain


}
