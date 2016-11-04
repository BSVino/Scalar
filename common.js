let Scalar = {};

Scalar.assert_type = function(object, type) {
	Scalar.assert(typeof object === type, type + " object expected, found a " + typeof object + " instead.");
}

// This uses my own bad homemade RTTI system to do type checking.
Scalar.is_object_type = function(object, type) {
	if (!object) {
		return false;
	}

	let search = object;

	while (search) {
		if (search._object_type === type) {
			return true;
		}

		search = Object.getPrototypeOf(search);
	}

	return false;
}

Scalar.assert_object = function(object, type) {
	if (!object) {
		Scalar.assert(false, type + " object expected, found a null object instead.");
		return;
	}

	Scalar.assert(Scalar.is_object_type(object, type), type + " object expected, found a " + object._object_type + " instead.");
}

