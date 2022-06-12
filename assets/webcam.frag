precision mediump float;

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;

// radius of hit
uniform float mixRadius;

// series of [x, y] coordinates of the hits
uniform vec2 hits[100];

float calculateMixAmount(vec2 hits[100], float mixRadius);
float calculateMixAmount(vec2 hits[100], float mixRadius) {
    float mixAmount = 1.0;

    for(int i = 0; i < 100; i++) {
        if(hits[i].x != 0.0 && hits[i].y != 0.0) {
            float dist = distance(hits[i], gl_FragCoord.xy);
            float newMixAmount = clamp(dist / mixRadius, 0.4, 1.);

            if(newMixAmount < 1.0 && mixAmount < 1.0) {
                mixAmount = mixAmount * newMixAmount;
            } else if(newMixAmount < 1.0) {
                mixAmount = newMixAmount;
            }
        }
    }

    return mixAmount;
}

void main() {
    vec2 uv = 1.0 - vTexCoord; // transformation to flip horizontally & vertically, so it displays the camera picture as if it was a mirror
    vec4 originalTexture = texture2D(tex0, uv); 
    float mixAmount = calculateMixAmount(hits, mixRadius); // calculate texture distortion at a given texel

    vec2 displacementUV = uv * vec2(.985, .99);
    vec4 hitTextureDisplacement = texture2D(tex0, displacementUV); 
    vec4 hitTextureColor = vec4(hitTextureDisplacement.x * .6, hitTextureDisplacement.y * .01, hitTextureDisplacement.z * .5, hitTextureDisplacement.a);
    vec4 hitTexture = mix(hitTextureColor, hitTextureDisplacement, 0.3);

    gl_FragColor = mix(hitTexture, originalTexture, mixAmount);
}

// vec4 calculateGreyscaleTexture(vTexCoord, sample) {
//     // https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
//     float yLinear = 0.2126 * sample.r + 0.7152 * sample.g + 0.0722 * sample.b;
//     vec4 bw = vec4((1.055 * pow(yLinear, (1.0 / 2.4)) - 0.055));
//     if(yLinear <= 0.0031308) {
//         bw = vec4(12.92 * yLinear);
//     }

//     return bw;
// }