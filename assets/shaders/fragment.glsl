precision mediump float;

uniform sampler2D uSampler;
uniform mediump vec2 uTextureDimensions;

varying mediump vec3 vTextureCoord;
varying mediump mat4 vColorMatrix;

void main() {
	highp vec2 coord =   vTextureCoord.xy / uTextureDimensions;
	mediump vec4 baseColor = texture2D(uSampler, coord);
	vec3 color = (vColorMatrix * vec4(baseColor.rgb, 1.0)).rgb * baseColor.a * vTextureCoord.z;
	float alpha = baseColor.a * vTextureCoord.z;
	gl_FragColor = vec4(color, alpha);
}
