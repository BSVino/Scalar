let Scalar = {};

Scalar.assert_arg = function(argument, type) {
	Scalar.assert(typeof argument == type, type + " argument expected, found a " + typeof argument + " instead.");
}

Scalar.assert_arg_object = function(argument, type) {
	Scalar.assert(argument._object_type == type, type + " argument expected, found a " + argument._object_type + " instead.");
}
