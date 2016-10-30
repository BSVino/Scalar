
Scalang.Parse = {
	nodes: Object.freeze(function() {
		let obj = {};
		let i = 0;

		obj.None = i++;
		obj.Global = i++;

		return obj;
	}()),
};

Scalang.Lex = {
	_object_type: "Scalang.Lex",

	tokens: Object.freeze(function() {
		let obj = {};
		let i = 0;

		// NOTE: Make sure that any updates to this get reflected in token_strings
		obj.None = i++;
		obj.EOF = i++;
		obj.Identifier = i++;
		obj.NumericLiteral = i++;

		obj.StaticDeclare = i++; // ::
		obj.Semicolon = i++;     // ;

		obj.OpenParen = i++;     // (
		obj.CloseParen = i++;    // )
		obj.OpenCurly = i++;     // {
		obj.CloseCurly = i++;    // }

		obj.Return = i++;

		return obj;
	}()),
	token_strings: Object.freeze([
		"", // None
		"", // EOF
		"", // Identifier
		"", // NumericLiteral
		"::",
		";",
		"(",
		")",
		"{",
		"}",
		"return",
	]),
};

Scalang.Lex.Token = function(lex) {
	Scalar.assert_arg_object(lex, "Scalang.Lex");

	this._object_type = "Scalang.Lex.Token";

	this.data = ""; // The string of the token
	this.type = Scalang.Lex.tokens.None;
	this.line = lex._lex_line;
	this.char_start = lex._lex_position - lex._lex_line_start;
	this.char_end = this.char_start;

	return this;
};

Scalang.Lex.initialize = function(code, error) {
	Scalar.assert_arg(code, "string");
	Scalar.assert_arg_object(error, "Scalang.Error");

	this._code = code.split('');
	this._lex_position = 0;
	this._lex_line = 0;
	this._lex_line_start = 0;

	this._error = error;

	// Prime the pump
	this._next_token();
}

Scalang.Lex.peek = function() {
	return this._next;
}

Scalang.Lex.eat = function(expected) {
	Scalar.assert_arg(expected, "number");

	if (expected !== this.peek().type) {
		return false;
	}

	this._next_token();

	return true;
}

Scalang.Lex._is_whitespace = function(char) {
	Scalar.assert_arg(char, "string");

	return char === " " || char === "\t" || char === "\r" || char === "\n";
};

Scalang.Lex._get_basic_token = function() {
	let longest = -1;
	for (let k = 0; k < this.token_strings.length; k++) {
		let match = true;

		for (let n = 0; n < this.token_strings[k].length; n++) {
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

Scalang.Lex._is_numeric = function(char) {
	Scalar.assert_arg(char, "string");

	let codepoint = char.codePointAt(0);
	let codepoint0 = "0".codePointAt(0);
	let codepoint9 = "9".codePointAt(0);

	return codepoint >= codepoint0 && codepoint <= codepoint9;
}

Scalang.Lex._is_identifier_first = function(char) {
	Scalar.assert_arg(char, "string");

	// Identifiers can't start with numbers.
	if (this._is_numeric(char)) {
		return false;
	}

	return this._is_identifier(char);
}

Scalang.Lex._is_identifier = function(char) {
	Scalar.assert_arg(char, "string");

	// Nonprintable characters.
	let codepoint = char.codePointAt(0);
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
	let char = this._peek_char();

	if (char == "\n") {
		this._lex_line++;
		this._lex_line_start = this._lex_position;
	}

	this._lex_position++;

	this._next.char_end++;

	return char;
}

Scalang.Lex._next_token = function() {
	let token = Scalang.Lex.tokens.None;

	while (this._is_whitespace(this._peek_char())) {
		this._next_char();
		continue;
	}

	this._next = new Scalang.Lex.Token(this);

	if (this._peek_char() === "\x00") {
		this._next.type = Scalang.Lex.tokens.EOF;

		Object.freeze(this._next);
		return;
	}

	if (this._get_basic_token()) {
		this._next.type = this._get_basic_token();

		for (let k = 0; k < this.token_strings[this._next.type].length; k++) {
			this._next.data += this._next_char();
		}

		Object.freeze(this._next);
		return;
	}

	if (this._is_numeric(this._peek_char())) {
		this._next.type = Scalang.Lex.tokens.NumericLiteral;
		this._next.data += this._next_char();

		while (this._is_numeric(this._peek_char())) {
			this._next.data += this._next_char();
		}

		Object.freeze(this._next);
		return;
	}

	if (this._is_identifier_first(this._peek_char())) {
		this._next.type = Scalang.Lex.tokens.Identifier;
		this._next.data += this._next_char();

		while (this._is_identifier(this._peek_char())) {
			this._next.data += this._next_char();
		}

		Object.freeze(this._next);
		return;
	}

	Scalang.assert(false, "Shouldn't arrive here");
	Object.freeze(this._next);
	return;
};

// ( NumericLiteral )
Scalang.Parse._parse_expression = function() {
	let Lex = Scalang.Lex;

	this._eat(Lex.tokens.NumericLiteral);
}

// ( Return expression ";" ) 
Scalang.Parse._parse_statement = function() {
	let Lex = Scalang.Lex;

	if (Lex.peek().type == Lex.tokens.Return) {
		this._eat(Lex.tokens.Return);
		this._parse_expression();
		this._eat(Lex.tokens.Semicolon);
		return true;
	} else {
		return false;
	}
}

// "{" { statement } "}"
Scalang.Parse._parse_block = function() {
	let Lex = Scalang.Lex;

	this._eat(Lex.tokens.OpenCurly);

	while (Lex.peek().type !== Lex.tokens.CloseCurly) {
		this._parse_statement();
	}

	this._eat(Lex.tokens.CloseCurly);
}

// "(" [] ")"
Scalang.Parse._parse_function_arguments = function() {
	let Lex = Scalang.Lex;

	this._eat(Lex.tokens.OpenParen);
	this._eat(Lex.tokens.CloseParen);
}

// { Identifier "::" (function_arguments block) }
Scalang.Parse._parse_global = function(node) {
	Scalar.assert_arg_object(node, "AstNode");

	let Lex = Scalang.Lex;

	while (Lex.peek().type == Lex.tokens.Identifier) {
		let identifier = Lex.peek();

		this._eat(Lex.tokens.Identifier);

		this._eat(Lex.tokens.StaticDeclare);

		if (Lex.peek().type == Lex.tokens.OpenParen) {
			this._parse_function_arguments();
			this._parse_block();
		} else {
			Scalar.assert(false, "Unimplemented");
		}
	}
}

Scalang.Parse._eat = function(token) {
	Scalar.assert_arg(token, "number");

	let Lex = Scalang.Lex;

	let old_token = Lex.peek();

	let result = Lex.eat(token);

	if (!result) {
		this._error.add(old_token, "Expected token '" + Object.keys(Lex.tokens)[token] + "', but saw '" + Object.keys(Lex.tokens)[old_token] + "'.");
	}

	return result;
}

Scalang.Parse._initialize = function(error) {
	Scalar.assert_arg_object(error, "Scalang.Error");

	this._error = error;

	this._AstNode = function(type) {
		Scalar.assert_arg(type, "number");

		this._object_type = "AstNode";
		this._type = type;
	};

	this._ast = new this._AstNode(Scalang.Parse.nodes.Global);
}

Scalang.Parse.parse = function(code) {
	Scalar.assert_arg(code, "string");

	let error = new Scalang.Error();

	Scalang.Lex.initialize(code, error);

	this._initialize(error);

	this._parse_global(this._ast);

	return error.get_errors();
};
