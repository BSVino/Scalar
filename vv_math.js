function VVector(color, v0, v1)
{
	return {color, v0, v1};
}

function VVector3(x, y, z)
{
	return {x, y, z};
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

