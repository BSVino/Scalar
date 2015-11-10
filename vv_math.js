function VVector(parms)
{
	if (!("name" in parms))
		console.error("VVector with no name");

	if (!("color" in parms))
		console.error("VVector with no color");

	if (!("v0" in parms))
		console.error("VVector with no v0");

	if (!("v1" in parms))
		console.error("VVector with no v1");

	return parms;
}

function VVector3v(x, y, z)
{
	return new THREE.Vector3(x, y, z);
}

function VVector3(v)
{
	return new THREE.Vector3().copy(v);
}

function TV3_Distance(v0, v1)
{
	return VVector3(v1).sub(v0).length();
}

function TV3_Center(v0, v1)
{
	return VVector3(v1).sub(v0).multiplyScalar(0.5).add(v0);
}

// Gives the quaternion that represents the rotation of the vector v1-v0
function TV3_Direction(v0, v1)
{
	return new THREE.Quaternion().setFromUnitVectors(
		VVector3v(1, 0, 0),
		VVector3(v1).sub(v0).normalize()
	);
}

function TV3_NearestPointOnLine(p, v0, v1)
{
	var v = VVector3(v1).sub(v0);
	var w = VVector3(p).sub(v0);

	w.projectOnVector(v);

	return VVector3(v0).add(w);
}

function VTransition(type, start_value, end_value, start_time, end_time)
{
	return {type, start_value, end_value, start_time, end_time};
}

function RemapVal(x, in_low, in_high, out_low, out_high)
{
	return (x - in_low)/(in_high-in_low) * (out_high-out_low) + out_low;
}

// http://stackoverflow.com/a/27410603
function toScreenPosition(vector, camera)
{
	var result = VVector3(vector);

	var widthHalf = renderer.context.canvas.width*0.5/window.devicePixelRatio;
	var heightHalf = renderer.context.canvas.height*0.5/window.devicePixelRatio;

	result.project(camera);

	result.x = ( result.x * widthHalf ) + widthHalf;
	result.y = -( result.y * heightHalf ) + heightHalf;

	return result;
};

function fromScreenPosition(vector, camera)
{
	var result = VVector3(vector);

	var widthHalf = renderer.context.canvas.width*0.5/window.devicePixelRatio;
	var heightHalf = renderer.context.canvas.height*0.5/window.devicePixelRatio;

	result.x = (result.x - widthHalf) / widthHalf;
	result.y = -(result.y - heightHalf) / heightHalf;

	result.unproject(camera);

	return result;
};

