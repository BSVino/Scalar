function run_tests() {
	var tests = [
		"Scalang/tests/test1.scl",
	];

	var test_failed = false;
	var test_print = "";

	for (var k = 0; k < tests.length; k++) {
		if (!Scalang.Parse.parse(scalar_read_file(tests[k]))) {
			test_print += "Test " + tests[k] + " failed.\n";
			test_failed = true;
		}
	}

	return {success: !test_failed, output: test_print};
}

