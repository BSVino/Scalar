Scalang.Program = function() {
	this._object_type = "Scalang.Program";

	this.ast = new Scalang.Parse.Nodes.Global();
	this.type_map = new WeakMap();
	this.messages = new Scalang.Error.MessageList();

	return Object.seal(this);
};

Scalang.compile = function(code) {
	Scalar.assert_type(code, "string");

	let program = new Scalang.Program();
	let lexer = Scalang.Lex.Lexer(code, program.messages);
	let parser = Scalang.Parse.Parser(lexer, program.messages);

	parser.parse(program.ast);

	// Don't proceed if parsing had an error.
	if (program.messages.has_an_error()) {
		return program;
	}

	Scalang.Static.check(program);

	return program;
};

// ====================================================================
// LEXING =============================================================
// ====================================================================

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

		// Punctuation
		obj.StaticDeclare = i++; // ::
		obj.Semicolon = i++;     // ;
		obj.Arrow = i++;         // ->

		obj.OpenParen = i++;     // (
		obj.CloseParen = i++;    // )
		obj.OpenCurly = i++;     // {
		obj.CloseCurly = i++;    // }

		// Keywords
		obj.Return = i++;

		obj.Int = i++;

		return obj;
	}()),
	token_strings: Object.freeze([
		"", // None
		"", // EOF
		"", // Identifier
		"", // NumericLiteral
		"::",
		";",
		"->",
		"(",
		")",
		"{",
		"}",
		"return",
		"int",
	]),
};

Scalang.Lex.Token = function(lex) {
	Scalar.assert_object(lex, "Scalang.Lex.Lexer");

	this._object_type = "Scalang.Lex.Token";

	this.data = ""; // The string of the token
	this.type = Scalang.Lex.tokens.None;
	this.line = lex._lex_line;
	this.char_start = lex._lex_position - lex._lex_line_start;
	this.char_end = this.char_start;

	return Object.seal(this);
};

Scalang.Lex.Lexer = function(code, messages) {
	Scalar.assert_type(code, "string");
	Scalar.assert_object(messages, "Scalang.Error.MessageList");

	this.peek = function() {
		return this._next;
	};

	this.eat = function(expected) {
		Scalar.assert_type(expected, "number");

		if (expected !== this.peek().type) {
			return false;
		}

		this._next_token();

		return true;
	};

	this._is_whitespace = function(char) {
		Scalar.assert_type(char, "string");

		return char === " " || char === "\t" || char === "\r" || char === "\n";
	};

	this._get_basic_token = function() {
		let longest = -1;
		for (let k = 0; k < this.token_strings.length; k++) {
			let match = true;

			for (let n = 0; n < this.token_strings[k].length; n++) {
				if (this._lex_position+n >= this._code.length) {
					match = false;
					break;
				}

				if (this._code[this._lex_position+n] !== this.token_strings[k][n]) {
					match = false;
					break;
				}
			}

			if (!match) {
				continue;
			}

			if (longest === -1 || this.token_strings[k].length > this.token_strings[longest].length) {
				longest = k;
			}
		}

		if (longest >= 0) {
			return longest;
		}
	}

	this._is_numeric = function(char) {
		Scalar.assert_type(char, "string");

		let codepoint = char.codePointAt(0);
		let codepoint0 = "0".codePointAt(0);
		let codepoint9 = "9".codePointAt(0);

		return codepoint >= codepoint0 && codepoint <= codepoint9;
	}

	this._is_identifier_first = function(char) {
		Scalar.assert_type(char, "string");

		// Identifiers can't start with numbers.
		if (this._is_numeric(char)) {
			return false;
		}

		return this._is_identifier(char);
	}

	this._is_identifier = function(char) {
		Scalar.assert_type(char, "string");

		// Nonprintable characters.
		let codepoint = char.codePointAt(0);
		if (codepoint <= 32 || (codepoint >= 127 && codepoint <= 159)) {
			return false;
		}

		// If it's a token it's not an identifier
		if (this._get_basic_token() !== Scalang.Lex.tokens.None) {
			return false;
		}

		return !this._is_whitespace(char);
	}

	this._peek_char = function() {
		if (this._lex_position >= this._code.length) {
			return "\x00";
		} else {
			return this._code[this._lex_position];
		}
	}

	this._next_char = function() {
		let char = this._peek_char();

		if (char === "\n") {
			this._lex_line++;
			this._lex_line_start = this._lex_position;
		}

		this._lex_position++;

		this._next.char_end++;

		return char;
	}

	this._next_token = function() {
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

	this._object_type = "Scalang.Lex.Lexer";

	this._code = code.split('');
	this._lex_position = 0;
	this._lex_line = 0;
	this._lex_line_start = 0;

	this._error = messages;

	// Prime the pump
	this._next_token();

	return Object.seal(this);
}

// ====================================================================
// PARSING ============================================================
// ====================================================================

Scalang.Parse = {
	nodes: Object.freeze(function() {
		let obj = {};
		let i = 0;

		obj.None = i++;
		obj.Global = i++;
		obj.FunctionDefinition = i++;
		obj.Arguments = i++;
		obj.Block = i++;
		obj.Statement = i++;
		obj.ReturnStatement = i++;
		obj.Expression = i++;

		return obj;
	}()),
};

Scalang.Parse.Nodes = {};

Scalang.Parse.Nodes._AstNode = function(type) {
	Scalar.assert_type(type, "number");

	this._object_type = "Scalang.Parse.Nodes._AstNode";
	this._type = type;

	return Object.seal(this);
};

Scalang.Parse.Nodes.Global = function() {
	let object = Object.create(new Scalang.Parse.Nodes._AstNode(Scalang.Parse.nodes.Global));

	object._object_type = "Scalang.Parse.Nodes.Global";
	object._objects = []; // List of other AST nodes

	object.visit = function(visitor) {
		Scalar.assert_type(visitor, "function");

		for (let k = 0; k < object._objects.length; k++) {
			visitor(object._objects[k]);
		}
	};

	return Object.seal(object);
}

Scalang.Parse.Nodes.Arguments = function() {
	let object = Object.create(new Scalang.Parse.Nodes._AstNode(Scalang.Parse.nodes.Arguments));

	object._object_type = "Scalang.Parse.Nodes.Arguments";

	return Object.seal(object);
}

Scalang.Parse.Nodes.FunctionDefinition = function() {
	let object = Object.create(new Scalang.Parse.Nodes._AstNode(Scalang.Parse.nodes.FunctionDefinition));

	object._object_type = "Scalang.Parse.Nodes.FunctionDefinition";

	object._name = {}; // Scalang.Lex.Token
	object._arguments = {}; // Scalang.Parse.Nodes.Arguments
	object._return_type = {}; // Scalang.Static.Type
	object._block = {}; // Scalang.Parse.Nodes.Block

	object.visit_arguments = function(visitor) {
		Scalar.assert_type(visitor, "function");

		for (let k = 0; k < object._arguments.length; k++) {
			visitor(object._arguments[k]);
		}
	};

	object.visit_block_statements = function(visitor) {
		Scalar.assert_type(visitor, "function");

		object._block.visit_statements(visitor);
	};

	return Object.seal(object);
}

Scalang.Parse.Nodes.Statement = function() {
	let object = Object.create(new Scalang.Parse.Nodes._AstNode(Scalang.Parse.nodes.Statement));

	object._object_type = "Scalang.Parse.Nodes.Statement";

	return Object.seal(object);
}

Scalang.Parse.Nodes.Block = function() {
	let object = Object.create(new Scalang.Parse.Nodes.Statement());

	object._object_type = "Scalang.Parse.Nodes.Block";

	object._statements = [] // Scalang.Parse.Nodes.Statement

	object.visit_statements = function(visitor) {
		Scalar.assert_type(visitor, "function");

		for (let k = 0; k < object._statements.length; k++) {
			visitor(object._statements[k]);
		}
	};

	return Object.seal(object);
}

Scalang.Parse.Nodes.ReturnStatement = function() {
	let object = Object.create(new Scalang.Parse.Nodes.Statement());

	object._object_type = "Scalang.Parse.Nodes.ReturnStatement";

	object._expression = {}; // Scalang.Parse.Nodes.Expression

	object.get_expression = function() {
		return object._expression;
	}

	return Object.seal(object);
}

Scalang.Parse.Nodes.Expression = function() {
	let object = Object.create(new Scalang.Parse.Nodes._AstNode(Scalang.Parse.nodes.Expression));

	object._object_type = "Scalang.Parse.Nodes.Expression";

	object._token = {}; // Temporary

	return Object.seal(object);
}

Scalang.Parse.Parser = function(lexer, messages) {
	Scalar.assert_object(lexer, "Scalang.Lex.Lexer");
	Scalar.assert_object(messages, "Scalang.Error.MessageList");

	// ( NumericLiteral )
	this._parse_expression = function() {
		let Lex = Scalang.Lex;
		let Nodes = Scalang.Parse.Nodes;

		let expression = new Nodes.Expression();

		expression._token = this._lexer.peek();

		this._eat(Lex.tokens.NumericLiteral);

		return expression;
	}

	// ( Return expression ";" ) 
	this._parse_statement = function() {
		let Lex = Scalang.Lex;
		let Nodes = Scalang.Parse.Nodes;

		if (this._lexer.peek().type === Lex.tokens.Return) {
			let return_statement = new Nodes.ReturnStatement();

			this._eat(Lex.tokens.Return);
			return_statement._expression = this._parse_expression();
			this._eat(Lex.tokens.Semicolon);

			return return_statement;
		} else {
			Scalang.assert(false, "Unimplemented");
			return null;
		}
	}

	// "{" { statement } "}"
	this._parse_block = function() {
		let Lex = Scalang.Lex;
		let Nodes = Scalang.Parse.Nodes;

		let block = new Nodes.Block();

		this._eat(Lex.tokens.OpenCurly);

		while (this._lexer.peek().type !== Lex.tokens.CloseCurly) {
			block._statements.push(this._parse_statement());
		}

		this._eat(Lex.tokens.CloseCurly);

		return block;
	}

	// "(" [] ")"
	this._parse_function_arguments = function() {
		let Lex = Scalang.Lex;
		let Nodes = Scalang.Parse.Nodes;

		let arguments = new Nodes.Arguments();

		this._eat(Lex.tokens.OpenParen);
		this._eat(Lex.tokens.CloseParen);

		return arguments;
	}

	// int
	this._parse_type = function() {
		let Lex = Scalang.Lex;
		let Static = Scalang.Static;

		let type = new Static.BasicType(Static.types.Int);

		// Just one type right now!
		this._eat(Lex.tokens.Int);

		return type;
	}

	// { Identifier "::" (function_arguments "->" type block) }
	this._parse_global = function(node) {
		Scalar.assert_object(node, "Scalang.Parse.Nodes.Global");

		let Lex = Scalang.Lex;
		let Nodes = Scalang.Parse.Nodes;

		while (this._lexer.peek().type === Lex.tokens.Identifier) {
			let identifier = this._lexer.peek();

			this._eat(Lex.tokens.Identifier);

			this._eat(Lex.tokens.StaticDeclare);

			if (Lex.peek().type === Lex.tokens.OpenParen) {
				let function_definition = new Nodes.FunctionDefinition();

				function_definition._name = identifier;
				function_definition._arguments = this._parse_function_arguments();

				this._eat(Lex.tokens.Arrow);

				function_definition._return_type = this._parse_type();
				function_definition._block = this._parse_block();

				node._objects.push(function_definition);
			} else {
				Scalar.assert(false, "Unimplemented");
			}
		}
	}

	this._eat = function(token) {
		Scalar.assert_type(token, "number");

		let Lex = Scalang.Lex;
		let Error = Scalang.Error;

		let old_token = this._lexer.peek();

		let result = this._lexer.eat(token);

		if (!result) {
			// Only display the first parsing error as the remaining errors
			// will probably be nonsense after that.
			if (this._error.has_no_errors()) {
				this._error.add(Error.types.Error, old_token, "Expected token '" + Object.keys(Lex.tokens)[token] + "', but saw '" + Object.keys(Lex.tokens)[old_token] + "'.");
			}
		}

		return result;
	}

	this.parse = function(ast) {
		this._parse_global(ast);
		this._eat(Scalang.Lex.tokens.EOF);
	}

	this._lexer = lexer;
	this._error = messages;

	return Object.seal(this);
}




// ====================================================================
// TYPES ==============================================================
// ====================================================================

Scalang.Static = {
	types: Object.freeze(function() {
		let obj = {};
		let i = 0;

		obj.None = i++;
		obj.Void = i++;
		obj.Int = i++;
		obj.Function = i++;

		return obj;
	}()),
};

Scalang.Static._Type = function(type) {
	Scalar.assert_type(type, "number");

	this._object_type = "Scalang.Static.Type";

	this._type = type;

	return Object.seal(this);
};

Scalang.Static.Function = function() {
	let object = Object.create(new Scalang.Static._Type(Scalang.Static.types.Function));

	object._object_type = "Scalang.Static.Function";
	object._arguments = []; // Scalang.Static._Type
	object._return = {}; // Scalang.Static._Type

	return Object.seal(object);
}

Scalang.Static.BasicType = function(type) {
	Scalar.assert_type(type, "number");

	Scalar.assert(Scalang.Static.is_basic_type(type), "Require a basic type for Scalang.Static.BasicType");

	let object = Object.create(new Scalang.Static._Type(type));

	object._object_type = "Scalang.Static.BasicType";

	return Object.seal(object);
}

Scalang.Static.is_basic_type = function(type) {
	Scalar.assert_type(type, "number");

	let types = Scalang.Static.types;

	switch (type) {
	case types.None:
	case types.Void:
		return false;

	case types.Int:
		return true;
	}
}

Scalang.Static.SymbolTable = function() {
	let object = new Object();

	object._object_type = "Scalang.Static.SymbolTable";

	object._symbol_stack = [];
	object._scope_stack = [];

	object._scope_stack.push(0);

	object._Symbol = function(name, object) {
		Scalar.assert_type(name, "string");
		Scalar.assert_object(object, "Scalang.Parse.Nodes._AstNode");

		let symbol = new Object();

		symbol._object_type = "Scalang.Static._Symbol";

		symbol.name = name;
		symbol.object = object;

		return Object.seal(symbol);
	};

	object.find = function(name, highest_stack_only) {
		Scalar.assert_type(name, "string");
		if (highest_stack_only === undefined)
		{
			highest_stack_only = true;
		}
		else
		{
			Scalar.assert_type(highest_stack_only, "boolean");
		}

		for (let k = 0; k < object._symbol_stack.length; k++) {
			// Reverse the index.
			let index = object._symbol_stack.length - k - 1;

			if (object._symbol_stack[k].name === name) {
				return object._symbol_stack[k].object;
			}
		}

		return null;
	};

	object.push_symbol = function(name, node) {
		Scalar.assert_type(name, "string");
		Scalar.assert_object(node, "Scalang.Parse.Nodes._AstNode");

		Scalar.assert(!object.find(name, true), "Pushing a duplicate node to the symbol stack");

		object._symbol_stack.push(new object._Symbol(name, node));
	};

	object.push_frame = function() {
		object._scope_stack.push(object._symbol_stack.length);
	}

	object.pop_frame = function() {
		let first_symbol_in_stack = object._scope_stack[object._scope_stack.length-1];

		while (object._symbol_stack.length >= first_symbol_in_stack) {
			object._symbol_stack.pop();
		}

		object._scope_stack.pop();
	}

	return Object.seal(object);
};

Scalang.Static._resolve_type_of_expression = function(expression) {
	Scalar.assert_object(expression, "Scalang.Parse.Nodes.Expression");

	let Static = Scalang.Static;

	// TODO: This for real.
	return new Static.BasicType(Static.types.Int);
}

Scalang.Static.check = function(program) {
	Scalar.assert_object(program, "Scalang.Program");

	let Static = Scalang.Static;

	let Symbol = function(name, definition_ast_node) {
		Scalar.assert_type(name, "string");
		Scalar.assert_object(definition_ast_node, "Scalang.Parse.Nodes._AstNode");

		this.name = name;
		this.definition = definition_ast_node;

		return Object.seal(this);
	}

	let symbol_table = new Scalang.Static.SymbolTable();

	// Add all global objects to the symbol table.
	program.ast.visit(function(global) {
		Scalar.assert_object(global, "Scalang.Parse.Nodes.FunctionDefinition");

		let function_type = new Scalang.Static.Function();

		global.visit_arguments(function(argument) {
			Scalar.assert(false, "Unimplemented");
		});

		function_type._return = global._return_type;

		program.type_map.set(global, function_type);

		if (symbol_table.find(global._name.data) !== null) {
			program.messages.add(Scalang.Error.types.Error, global._name, "Duplicate object name at the global scope");
		} else {
			symbol_table.push_symbol(global._name.data, global);
		}
	});

	program.ast.visit(function(global) {
		Scalar.assert_object(global, "Scalang.Parse.Nodes.FunctionDefinition");

		global.visit_block_statements(function(statement) {
			if (Scalar.is_object_type(statement, "Scalang.Parse.Nodes.ReturnStatement")) {
				let type = Static._resolve_type_of_expression(statement.get_expression());
				program.type_map.set(statement.get_expression(), type);
			} else {
				Scalar.assert(false, "Unrecognized statement type");
			}
		});
	});

	return program.messages.has_no_errors();
}
