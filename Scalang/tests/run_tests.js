function run_tests() {
	let tests = [
		"Scalang/tests/test1.scl",
	];

	let test_failed = false;
	let test_print = "";

	for (let k = 0; k < tests.length; k++) {
		let filename = tests[k];
		let errors = Scalang.Parse.parse(Scalar.read_file(filename));
		if (errors.length > 0) {
			for (let e = 0; e < errors.length; e++) {
				// TODO: Actual error formatting routine
				test_print += filename + ":" + errors[e]._token.line + " [" + errors[e]._token.char_start + "-" + errors[e]._token.char_end + "] " + errors[e]._message + "\n";
			}

			test_failed = true;
		}
	}

	return {success: !test_failed, messages: test_print};
}

