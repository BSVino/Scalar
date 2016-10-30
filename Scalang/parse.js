
Scalang.Parse = {};

Scalang.Lex = {
	tokens: Object.freeze({
		None: 0,
		EOF: 1,
		Identifier: 2,

		StaticDeclare: 3, // ::

		OpenParen: 4,     // (
		CloseParen: 5,    // )
		OpenCurly: 6,     // {
		CloseCurly: 7,    // }
	}),
	token_strings: Object.freeze([
		"", // None
		"", // EOF
		"", // Identifier
		"::", // StaticDeclare
		"(", // OpenParen
		")", // CloseParen
		"{", // OpenCurly
		"}", // CloseCurly
	]),
};

Scalang.Lex.Token = function(){
	this.data = ""; // The string of the token
	this.type = Scalang.Lex.tokens.None;

	return this;
};

Scalang.Lex.initialize = function(code) {
	scalar_assert(typeof code === "string", "Bad argument");

	this._code = code.split('');
	this._lex_position = 0; // Current lexing position

	// Prime the pump
	this._next = this._next_token();
}

Scalang.Lex.peek = function() {
	return this._next;
}

Scalang.Lex.eat = function(expected) {
	scalar_assert(typeof expected === "number", "Bad argument");

	if (expected !== this.peek().type) {
		return false;
	}

	this._next = this._next_token();

	return true;
}

Scalang.Lex._is_whitespace = function(char) {
	scalar_assert(typeof char === "string", "Bad argument");

	return char === " " || char === "\t" || char === "\r" || char === "\n";
};

Scalang.Lex._get_basic_token = function() {
	var longest = -1;
	for (var k = 0; k < this.token_strings.length; k++) {
		var match = true;

		for (var n = 0; n < this.token_strings[k].length; n++) {
			if (this._lex_position+n >= this._code.length) {
				match = false;
				break;
			}

			if (this._code[this._lex_position+n] != this.token_strings[k][n]) {
				match = false;
				break;
			}
		}

		if (!match) {
			continue;
		}

		if (longest == -1 || this.token_strings[k].length > this.token_strings[longest].length) {
			longest = k;
		}
	}

	if (longest >= 0) {
		return longest;
	}
}

Scalang.Lex._is_identifier_first = function(char) {
	scalar_assert(typeof char === "string", "Bad argument");

	var codepoint = char.codePointAt(0);
	var codepoint0 = "0".codePointAt(0);
	var codepoint9 = "9".codePointAt(0);

	// Identifiers can't start with numbers.
	if (codepoint >= codepoint0 && codepoint <= codepoint9) {
		return false;
	}

	return this._is_identifier(char);
}

Scalang.Lex._is_identifier = function(char) {
	scalar_assert(typeof char === "string", "Bad argument");

	// Nonprintable characters.
	var codepoint = char.codePointAt(0);
	if (codepoint <= 32 || (codepoint >= 127 && codepoint <= 159)) {
		return false;
	}

	// If it's a token it's not an identifier
	if (this._get_basic_token() != Scalang.Lex.tokens.None) {
		return false;
	}

	return !this._is_whitespace(char);
}

Scalang.Lex._peek_char = function() {
	if (this._lex_position >= this._code.length) {
		return "\x00";
	} else {
		return this._code[this._lex_position];
	}
}

Scalang.Lex._next_char = function() {
	var char = this._peek_char();

	this._lex_position++;

	return char;
}

Scalang.Lex._next_token = function() {
	var token = Scalang.Lex.tokens.None;

	while (this._is_whitespace(this._peek_char())) {
		this._next_char();
		continue;
	}

	var result = new Scalang.Lex.Token();

	if (this._peek_char() === "\x00") {
		result.type = Scalang.Lex.tokens.EOF;
		return result;
	}

	if (this._get_basic_token()) {
		result.type = this._get_basic_token();

		for (var k = 0; k < this.token_strings[result.type].length; k++) {
			result.data += this._next_char();
		}

		return result;
	}

	if (this._is_identifier_first(this._peek_char())) {
		result.type = Scalang.Lex.tokens.Identifier;
		result.data += this._next_char();

		while (this._is_identifier(this._peek_char())) {
			result.data += this._next_char();
		}
	}

	return result;
};

Scalang.Parse.parse = function(code) {
	scalar_assert(typeof code === "string", "Bad argument");

	Scalang.Lex.initialize(code);

	var next = Scalang.Lex.peek();

	var i = 0;

	while (next.type !== Scalang.Lex.tokens.EOF) {
		if (next.type === Scalang.Lex.tokens.None) {
			// TODO: Print error.
			return false;
		}

		scalar_print(next.type + ": " + next.data);
		Scalang.Lex.eat(Scalang.Lex.peek().type);
		next = Scalang.Lex.peek();

		if (i++ > 100)
			return false;
	}

	return true;
};