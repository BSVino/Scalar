var result = run_tests();

if (!result.success) {
	Scalar.print(result.messages);
	abort();
}
