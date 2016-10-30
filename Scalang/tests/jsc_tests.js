var result = run_tests();

if (!result.success) {
	scalar_print(result.output);
	abort();
}