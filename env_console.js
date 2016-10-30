// https://trac.webkit.org/browser/trunk/Source/JavaScriptCore/jsc.cpp?order=name

Scalar.print = function(string) {
	print(string);
};

Scalar.read_file = function(file) {
	return readFile(file);
}

Scalar.assert = function(condition, message) {
	if (!condition) {
		Scalar.print(message);
		abort();
	}
}
