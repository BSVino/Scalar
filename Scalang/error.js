Scalang.Error = {
	types: Object.freeze(function() {
		let obj = {};
		let i = 0;

		obj.None = i++;
		obj.Error = i++;

		return obj;
	}()),
};

Scalang.MessageList = function() {
	this._object_type = "Scalang.MessageList";

	this._messages = [];

	this._ErrorInfo = function(type, token, message) {
		Scalar.assert_arg(type, "number");
		Scalar.assert_arg_object(token, "Scalang.Lex.Token");
		Scalar.assert_arg(message, "string");

		this._type = type;
		this._token = token;
		this._message = message;

		Object.seal(this);
	};

	this.add = function(type, token, message) {
		Scalar.assert_arg(type, "number");
		Scalar.assert_arg_object(token, "Scalang.Lex.Token");
		Scalar.assert_arg(message, "string");

		this._messages.push(new this._ErrorInfo(type, token, message));
	};

	this.get_messages = function() {
		return this._messages;
	}

	this.has_an_error = function() {
		let Error = Scalang.Error;

		return this._messages.map(function(a) {
			return a._type == Error.types.Error;
		}).reduce(function(a, b) {
			return a || b;
		}, false);
	}

	Object.seal(this);
};

