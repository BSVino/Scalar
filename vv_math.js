function VVector(name, color, v0, v1)
{
	return {name, color, v0, v1};
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

	var widthHalf = 0.25*renderer.context.canvas.width;
	var heightHalf = 0.25*renderer.context.canvas.height;

	result.project(camera);

	result.x = ( result.x * widthHalf ) + widthHalf;
	result.y = -( result.y * heightHalf ) + heightHalf;

	return result;
};

function fromScreenPosition(vector, camera)
{
	var result = VVector3(vector);

	var widthHalf = 0.25*renderer.context.canvas.width;
	var heightHalf = 0.25*renderer.context.canvas.height;

	result.x = (result.x - widthHalf) / widthHalf;
	result.y = -(result.y - heightHalf) / heightHalf;

	result.unproject(camera);

	return result;
};

