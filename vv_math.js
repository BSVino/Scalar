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
	var r = new THREE.Vector3();
	r.copy(v);
	return r;
}

function TV3_Distance(v0, v1)
{
	var d = VVector3(v1);
	d.sub(v0);
	return d.length();
}

function TV3_Center(v0, v1)
{
	var center = VVector3(v1);
	center.sub(v0);
	center.multiplyScalar(0.5);
	center.add(v0);

	return center;
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
	var result = new THREE.Vector3(); result.copy(vector);

	var widthHalf = 0.25*renderer.context.canvas.width;
	var heightHalf = 0.25*renderer.context.canvas.height;

	result.project(camera);

	result.x = ( result.x * widthHalf ) + widthHalf;
	result.y = -( result.y * heightHalf ) + heightHalf;

	return result;
};

function fromScreenPosition(vector, camera)
{
	var result = new THREE.Vector3(); result.copy(vector);

	var widthHalf = 0.25*renderer.context.canvas.width;
	var heightHalf = 0.25*renderer.context.canvas.height;

	result.x = (result.x - widthHalf) / widthHalf;
	result.y = -(result.y - heightHalf) / heightHalf;

	result.unproject(camera);

	return result;
};

