#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D u_tex0; // angry.jpg

float glow(float d, float str, float thickness) {
    return thickness / pow(d, str);
}

float square(vec2 P, float size) {
    return max(abs(P.x), abs(P.y)) - size / (1.0);
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    uv.x *= u_resolution.x / u_resolution.y;

    // 使用"angry.jpg"作為背景
    vec4 angryColor = texture2D(u_tex0, uv);

    // 現有的GLSL效果代碼
    vec2 uvs = uv * 36.0;
    vec2 ipos = floor(uvs);  // get the integer coords
    vec2 fpos = fract(uvs);  // get the fractional coords
    uv = fpos * 2.0 - 1.0;

    //mouse distortion
    vec2 mouse_ipose = floor(u_mouse.xy / u_resolution.xy * 36.0);
    float dist = length(mouse_ipose - ipos) / 36.0;
    dist = pow(1.0 - dist, 3.0) * 3.0;
    uv *= rotate2d(dist + u_time);        //以亂數增加個體變化

    //定義框
    float squareUV = square(uv, 0.02 + 0.35 * dist + 0.15 * random(ipos));   //以亂數增加個體變化
    float glowSquare = glow(squareUV, 0.4, 0.200);  //第一種寫法 by thickness/pow(dist, strength)

    // 這裡使用"angry.jpg"的透明度作為紋理的透明度
    gl_FragColor = vec4(vec3(glowSquare), angryColor.a); // 使用紋理的透明度，保留"angry.jpg"的透明度
}
