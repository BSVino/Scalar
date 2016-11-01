let Scalar = {};

Scalar.assert_type = function(object, type) {
	Scalar.assert(typeof object === type, type + " object expected, found a " + typeof object + " instead.");
}

// This uses my own bad homemade RTTI system to do type checking.
Scalar.assert_object = function(object, type) {
	let search = object;

	while (search) {
		if (search._object_type === type) {
			return;
		}

		search = Object.getPrototypeOf(search);
	}

	Scalar.assert(false, type + " object expected, found a " + object._object_type + " instead.");
}
