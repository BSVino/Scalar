// https://trac.webkit.org/browser/trunk/Source/JavaScriptCore/jsc.cpp?order=name

scalar_print = function(string) {
	debug(string);
};

scalar_read_file = function(file) {
	return readFile(file);
}

scalar_assert = function(condition, message) {
	if (!condition) {
		scalar_print(message);
		abort();
	}
}
