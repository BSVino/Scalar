Scalang.Error = function() {
	this._object_type = "Scalang.Error";

	this._errors = [];

	this._ErrorInfo = function(token, message) {
		Scalar.assert_arg_object(token, "Scalang.Lex.Token");
		Scalar.assert_arg(message, "string");

		this._token = token;
		this._message = message;
	};

	this.add = function(token, message) {
		Scalar.assert_arg_object(token, "Scalang.Lex.Token");
		Scalar.assert_arg(message, "string");

		this._errors.push(new this._ErrorInfo(token, message));
	};

	this.get_errors = function() {
		return this._errors;
	}
};

