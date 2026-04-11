export const vertexShader = `
varying vec2 vUv;
uniform float uHovered;
uniform float uScale;

void main() {
  vUv = uv;
  
  // Very subtle zoom in effect on hover
  vec3 pos = position;
  float scale = 1.0 + (uHovered * uScale);
  // Scale from the center
  pos *= scale;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const fragmentShader = `
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform vec2 uMouse;
uniform float uHovered;
uniform float uRadius;
uniform float uSoftness;
uniform vec2 uResolution;
uniform vec2 uImage1Resolution;
uniform vec2 uImage2Resolution;

// Per-texture alignment control
uniform vec2 uTexture1Offset;
uniform vec2 uTexture1Scale;
uniform vec2 uTexture2Offset;
uniform vec2 uTexture2Scale;

varying vec2 vUv;

vec2 computeCoverUV(vec2 uv, vec2 resolution, vec2 imageRes, vec2 offset, vec2 scale) {
  // background-size: cover equivalent
  vec2 ratio = vec2(
    min((resolution.x / resolution.y) / (imageRes.x / imageRes.y), 1.0),
    min((resolution.y / resolution.x) / (imageRes.y / imageRes.x), 1.0)
  );
  
  vec2 centeredUv = uv - vec2(0.5);
  // Apply custom scale to zoom in/out on the image
  vec2 scaledUv = centeredUv * ratio * scale;
  // Apply offset to reposition the image
  return scaledUv + vec2(0.5) + offset;
}

void main() {
  // Compute independent UVs for each texture layer
  vec2 uv1 = computeCoverUV(vUv, uResolution, uImage1Resolution, uTexture1Offset, uTexture1Scale);
  vec2 uv2 = computeCoverUV(vUv, uResolution, uImage2Resolution, uTexture2Offset, uTexture2Scale);

  // Get the base color from the spider-man texture
  vec4 color1 = texture2D(uTexture1, uv1);
  
  // Calculate mask for the circular reveal
  // Correct mouse distance for aspect ratio so the mask is perfectly circular
  vec2 screenRatio = vec2(uResolution.x / uResolution.y, 1.0);
  if (uResolution.y > uResolution.x) {
    screenRatio = vec2(1.0, uResolution.y / uResolution.x);
  }
  
  vec2 uvMouse = vUv * screenRatio;
  vec2 cursor = uMouse * screenRatio;

  float dist = distance(uvMouse, cursor);
  
  // Mask scales in when uHovered increases (0 to 1)
  float currentRadius = uRadius * uHovered;

  // The mask (1.0 where man image shows, 0.0 where spiderman shows)
  float mask = 1.0 - smoothstep(currentRadius - uSoftness, currentRadius + uSoftness, dist);
  
  // Add a small ripple / distortion on the edge of the mask
  vec2 distortedUv2 = uv2 + (mask * (1.0 - mask)) * 0.03 * uHovered;
  vec4 color2 = texture2D(uTexture2, distortedUv2);

  // Mix between spiderman and man based on the mask
  vec4 finalColor = mix(color1, color2, mask);

  // Subtle light bloom/glow near the cursor
  float glow = 1.0 - smoothstep(0.0, currentRadius * 1.5, dist);
  finalColor.rgb += vec3(0.04, 0.06, 0.08) * glow * uHovered;

  gl_FragColor = finalColor;
}
`;
