function run_tests() {
	let tests = [
		"Scalang/tests/test1.scl",
	];

	let test_failed = false;
	let test_print = "";

	for (let k = 0; k < tests.length; k++) {
		let filename = tests[k];
		let messages = Scalang.Parse.parse(Scalar.read_file(filename));
		if (messages.length > 0) {
			for (let e = 0; e < messages.length; e++) {
				// TODO: Actual error formatting routine
				test_print += filename + ":" + messages[e]._token.line + " [" + messages[e]._token.char_start + "-" + messages[e]._token.char_end + "] " + messages[e]._message + "\n";
			}

			test_failed = true;
		}
	}

	return {success: !test_failed, messages: test_print};
}

