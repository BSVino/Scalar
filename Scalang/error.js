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
	let object = new Object();

	object._object_type = "Scalang.MessageList";

	object._messages = [];

	object._ErrorInfo = function(type, token, message) {
		Scalar.assert_type(type, "number");
		Scalar.assert_object(token, "Scalang.Lex.Token");
		Scalar.assert_type(message, "string");

		let error_info = new Object();

		error_info._type = type;
		error_info._token = token;
		error_info._message = message;

		return Object.seal(error_info);
	};

	object.add = function(type, token, message) {
		Scalar.assert_type(type, "number");
		Scalar.assert_object(token, "Scalang.Lex.Token");
		Scalar.assert_type(message, "string");

		object._messages.push(new object._ErrorInfo(type, token, message));
	};

	object.get_messages = function() {
		return object._messages;
	}

	object.has_an_error = function() {
		let Error = Scalang.Error;

		return object._messages.map(function(a) {
			return a._type == Error.types.Error;
		}).reduce(function(a, b) {
			return a || b;
		}, false);
	}

	return Object.seal(object);
};

