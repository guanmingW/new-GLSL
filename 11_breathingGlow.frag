#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_texture;

float random(in float x) {
    return fract(sin(x) * 1e4);
}

float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float randomSerie(float x, float freq, float t) {
    return step(0.8, random(floor(x * freq) - floor(t)));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // 添加一些扭曲效果
    st += 0.1 * sin(u_time);

    // 使用鼠标位置调整條碼效果的参数
    float mouseEffect = 0.2; // 鼠标效果的强度
    st += mouseEffect * (u_mouse - 0.5);

    vec3 color = vec3(0.0);

    // 第一个效果（條碼變換）
    float cols = 2.0;
    float freq = random(floor(u_time)) + abs(atan(u_time) * 0.1);
    float t = 60.0 + u_time * (1.0 - freq) * 15.0; // 降低速度

    if (fract(st.y * cols * 0.5) < 0.5) {
        t *= -1.0;
    }

    freq += 0.005; // 调整频率的增量
    float offset = 0.025;
    color += vec3(randomSerie(st.x, freq * 99.528, t + offset),
                  randomSerie(st.x, freq * 100.0, t),
                  randomSerie(st.x, freq * 100.0, t - offset));

    // 第二个效果（现代艺术感）
    float freq2 = random(floor(u_time));
    float t2 = u_time * 2.0;

    freq2 += 0.005; // 调整频率的增量
    color.r += 0.5 * sin(t2 + st.x + sin(freq2));
    color.g += 0.5 * cos(t2 + st.y + cos(freq2));
    color.b += 0.5 * sin(t2 + st.x + st.y);

    // 使用混合模式来控制背景图像的透明度
    float alpha = 0.5; // 背景图像的透明度
    gl_FragColor = mix(vec4(1.0 - color, 1.0), texture2D(u_texture, st), alpha);
}
