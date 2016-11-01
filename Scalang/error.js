Scalang.Error = {
	types: Object.freeze(function() {
		let obj = {};
		let i = 0;

		obj.None = i++;
		obj.Error = i++;

		return obj;
	}()),
};

Scalang.Error.MessageList = function() {
	this._object_type = "Scalang.Error.MessageList";

	this._messages = [];

	this._ErrorInfo = function(type, token, message) {
		Scalar.assert_type(type, "number");
		Scalar.assert_object(token, "Scalang.Lex.Token");
		Scalar.assert_type(message, "string");

		this._type = type;
		this._token = token;
		this._message = message;

		return Object.seal(this);
	};

	this.add = function(type, token, message) {
		Scalar.assert_type(type, "number");
		Scalar.assert_object(token, "Scalang.Lex.Token");
		Scalar.assert_type(message, "string");

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

	this.has_no_errors = function() {
		return !this.has_an_error();
	}

	return Object.seal(this);
};

