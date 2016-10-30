#!/bin/bash

set -e

jsc=/System/Library/Frameworks/JavaScriptCore.framework/Resources/jsc

echo "BUILD"

$jsc \
	common.js \
	env_console.js \
	Scalang/common.js \
	Scalang/parse.js \
	Scalang/error.js \
	Scalang/tests/run_tests.js \
	Scalang/tests/jsc_tests.js

echo "ALL TESTS PASS"

