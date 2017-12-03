uniform vec4 uViewport;
uniform mediump vec2 uTextureDimensions;

attribute vec2 aPosition;
attribute vec3 aOrientation;
attribute vec2 aLayer;
attribute vec2 aTextureCoord;
attribute vec2 aGrimness;

varying mediump vec3 vTextureCoord;
varying mediump mat4 vColorMatrix;

const mat4 happyColorMatrix = mat4(
	1.0, 0.0, 0.0, 0.0,
	0.0, 1.0, 0.0, 0.0,
	0.0, 0.0, 1.0, 0.0,
	0.0, 0.0, 0.0, 0.0
);
const mat4 grimColorMatrix = mat4(
	0.7, 0.5, 0.4, 0.0,
	0.5, 0.7, 0.4, 0.0,
	0.5, 0.5, 0.9, 0.0,
	-0.2, -0.2, -0.2, 0.0
);

void main() {
	mat4 viewportScale = mat4(
			2.0 / uViewport.z, 0, 0, 0,
			0, -2.0 / uViewport.w, 0,0,
			0, 0,1,0,
			-1,+1,0,1);
	vec4 viewportTranslation = vec4(uViewport.xy, 0, 0);

	vec2 pos = aPosition;
	vec2 entityOrigin = aOrientation.xy;
	mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));
	pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin ;
	gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );
	vTextureCoord = vec3(aTextureCoord, aLayer.y);

	vColorMatrix = mat4(
			mix(happyColorMatrix[0], grimColorMatrix[0], aGrimness.x),
			mix(happyColorMatrix[1], grimColorMatrix[1], aGrimness.x),
			mix(happyColorMatrix[2], grimColorMatrix[2], aGrimness.x),
			mix(happyColorMatrix[3], grimColorMatrix[3], aGrimness.x));
}
