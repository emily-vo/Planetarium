uniform sampler2D texture;
uniform int u_useTexture;
uniform vec3 u_albedo;
uniform vec3 u_ambient;
uniform vec3 u_lightPos;
uniform vec3 u_lightCol;
uniform float u_lightIntensity;
uniform vec3 u_camPos;
uniform float time;

varying vec3 f_position;
varying vec3 f_normal;
varying vec2 f_uv;
varying float noise;

uniform float alpha;


void main() {
    vec4 color = vec4(0.0, 0.0, 1.0, 1.0);
    float d = clamp(dot(f_normal, normalize(u_camPos - f_position)), 0.0, 1.0);

    //Read from texture using relation to the view vector and a little bit of noise
    if (u_useTexture == 1) {
        color = texture2D(texture, f_uv*vec2(noise));
    }

    gl_FragColor = vec4(d * color.rgb * u_lightCol * u_lightIntensity + u_ambient, alpha);

    if (alpha > 0.9) {
    	gl_FragColor.a = 0.9;
    }
    //gl_FragColor.a = 0.2;
}