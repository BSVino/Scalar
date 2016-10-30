
Scalang.Parse = {};

Scalang.Lex = {
	code: [], // Array of unicode characters
	lex_position: 0, // Currect lexing position
}

Scalang.Lex.initialize = function(code) {
	this.code = code.split('');
	this.lex_position = 0;
}

Scalang.Lex.is_whitespace = function(char) {
	if (char === " ") {
		return true;
	}

	if (char === "\t") {
		return true;
	}

	if (char === "\r") {
		return true;
	}

	if (char === "\n") {
		return true;
	}

	return false;
};

Scalang.Lex.next = function() {
	var token = Scalang.tokens.None;

	while (this.is_whitespace(this.code[this.lex_position])) {
		this.lex_position++;
		continue;
	}

	scalar_print(this.code[this.lex_position]);
};

Scalang.Parse.parse = function(code) {
	Scalang.Lex.initialize(code);

	// Prime the pump
	Scalang.Lex.next();

	return true;
};