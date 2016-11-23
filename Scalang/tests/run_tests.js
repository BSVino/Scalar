function run_tests() {
	let tests = [
		{ compile: true, file: "Scalang/tests/operators.scl", },
		{ compile: true, file: "Scalang/tests/test1.scl", },
		{ compile: false, file: "Scalang/tests/error-duplicate-global.scl", },
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
		let program = Scalang.compile(Scalar.read_file(filename));
		let message_list = program.messages;
		let messages = message_list.get_messages();

		if (message_list.has_an_error() !== tests[k].compile) {
			continue;
		}

		test_print += "Test '" + filename + " " + succeededfailed(!message_list.has_an_error()) + " when it should have " + succeededfailed(tests[k].compile) + ".\n";

		test_failed = true;

		if (messages.length > 0) {
			for (let e = 0; e < messages.length; e++) {
				// TODO: Actual error formatting routine
				let print_line = messages[e]._token.line + 1;
				test_print += filename + ":" + print_line + " [" + messages[e]._token.char_start + "-" + messages[e]._token.char_end + "] " + messages[e]._message + "\n";
			}

		}
	}

	return {success: !test_failed, messages: test_print};
}

