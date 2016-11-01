function run_tests() {
	let tests = [
		{ result: true, file: "Scalang/tests/test1.scl", },
		{ result: false, file: "Scalang/tests/error-duplicate-global.scl", },
	];

	let test_failed = false;
	let test_print = "";

	let succeededfailed = function(pass) {
		if (pass) {
			return "succeeded";
		} else {
			return "failed";
		}
	};

	for (let k = 0; k < tests.length; k++) {
		let filename = tests[k].file;
		let message_list = Scalang.Parse.parse(Scalar.read_file(filename));
		let messages = message_list.get_messages();

		if (message_list.has_an_error() !== tests[k].result) {
			continue;
		}

		test_print += "Test '" + filename + " " + succeededfailed(!message_list.has_an_error()) + " when it should have " + succeededfailed(tests[k].result) + ".\n";

		test_failed = true;

		if (messages.length > 0) {
			for (let e = 0; e < messages.length; e++) {
				// TODO: Actual error formatting routine
				test_print += filename + ":" + messages[e]._token.line + " [" + messages[e]._token.char_start + "-" + messages[e]._token.char_end + "] " + messages[e]._message + "\n";
			}

		}
	}

	return {success: !test_failed, messages: test_print};
}

